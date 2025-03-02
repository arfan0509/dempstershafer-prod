import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import NavbarComponent from "../../components/user/NavbarComponent";
import LoadingModal from "../../components/user/LoadingModal";
// Fungsi pembulatan ke 4 desimal
const round4 = (num) => Math.round(num * 10000) / 10000;
// Fungsi untuk format angka tanpa trailing zero
const formatNumber = (num) => parseFloat(num.toFixed(4)).toString();
const SistemPakarPage = () => {
    const [gejalaList, setGejalaList] = useState([]);
    const [penyakitList, setPenyakitList] = useState([]);
    const [selectedGejala, setSelectedGejala] = useState([]);
    // Hasil diagnosa: { penyakit, belief, gejalaCocok, deskripsi, solusi }
    const [hasilDiagnosa, setHasilDiagnosa] = useState([]);
    const [showOtherPenyakit, setShowOtherPenyakit] = useState(false);
    const [kucingData, setKucingData] = useState({
        nama: "",
        jenisKelamin: "",
        usia: "",
        warnaBulu: "",
    });
    const [isGejalaVisible, setIsGejalaVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [calcSteps, setCalcSteps] = useState("");
    const [showCalcSteps, setShowCalcSteps] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/relasi");
                const data = response.data;
                const gejalaMap = {};
                const penyakitMap = {};
                data.forEach((item) => {
                    // Ambil data gejala dengan bobot dari relasi (item.bobot)
                    gejalaMap[item.gejala.kode_gejala] = {
                        nama: item.gejala.nama_gejala,
                        bobot: parseFloat(item.bobot),
                        kode: item.gejala.kode_gejala,
                    };
                    // Simpan data penyakit beserta relasinya sebagai objek { kode_gejala, bobot }
                    if (!penyakitMap[item.penyakit.kode_penyakit]) {
                        penyakitMap[item.penyakit.kode_penyakit] = {
                            nama: item.penyakit.nama_penyakit,
                            deskripsi: item.penyakit.deskripsi,
                            solusi: item.penyakit.solusi,
                            gejala: [],
                        };
                    }
                    // Gunakan bobot dari item.bobot, bukan dari item.gejala.bobot
                    penyakitMap[item.penyakit.kode_penyakit].gejala.push({
                        kode_gejala: item.gejala.kode_gejala,
                        bobot: parseFloat(item.bobot),
                    });
                });
                setGejalaList(Object.values(gejalaMap));
                setPenyakitList(Object.values(penyakitMap));
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    // Fungsi kombinasi dua fungsi massa dengan aturan Dempster-Shafer (dengan pembulatan)
    const combineMassFunctions = (m1, m2, frame) => {
        const fullFrameKey = frame.sort().join(",");
        let m_comb = {};
        let K = 0; // total konflik
        for (let key1 in m1) {
            for (let key2 in m2) {
                const set1 = key1 === fullFrameKey ? new Set(frame) : new Set(key1.split(","));
                const set2 = key2 === fullFrameKey ? new Set(frame) : new Set(key2.split(","));
                const intersection = new Set([...set1].filter((x) => set2.has(x)));
                const product = round4(m1[key1] * m2[key2]);
                if (intersection.size === 0) {
                    K = round4(K + product);
                }
                else {
                    const intersectionKey = [...intersection].sort().join(",");
                    m_comb[intersectionKey] = round4((m_comb[intersectionKey] || 0) + product);
                }
            }
        }
        const normalization = round4(1 - K);
        if (normalization === 0)
            return {};
        for (let key in m_comb) {
            m_comb[key] = round4(m_comb[key] / normalization);
        }
        return m_comb;
    };
    // Fungsi untuk mendapatkan daftar nama gejala yang mendukung suatu penyakit
    const getMatchingSymptoms = (disease) => {
        return selectedGejala
            .map((kode) => {
            const g = gejalaList.find((gejala) => gejala.kode === kode);
            if (!g)
                return null;
            const relatedPenyakit = penyakitList.filter((p) => p.gejala.some((relasi) => relasi.kode_gejala === g.kode));
            const names = relatedPenyakit.map((p) => p.nama);
            return names.includes(disease) ? g.nama : null;
        })
            .filter((item) => item !== null);
    };
    // Fungsi utama perhitungan DS tanpa distribusi tambahan untuk himpunan komposit
    const handleDiagnosa = async () => {
        if (selectedGejala.length === 0) {
            alert("Silakan pilih setidaknya satu gejala!");
            return;
        }
        let steps = "";
        // Batasi frame hanya pada penyakit relevan dari gejala yang dipilih
        const gejalaToPenyakitMap = {};
        penyakitList.forEach((p) => {
            p.gejala.forEach((relasi) => {
                const { kode_gejala, bobot } = relasi;
                if (!gejalaToPenyakitMap[kode_gejala]) {
                    gejalaToPenyakitMap[kode_gejala] = [];
                }
                gejalaToPenyakitMap[kode_gejala].push({ penyakit: p.nama, bobot });
            });
        });
        const relevantDiseases = new Set();
        selectedGejala.forEach((gejalaCode) => {
            const rel = gejalaToPenyakitMap[gejalaCode] || [];
            rel.forEach(({ penyakit }) => relevantDiseases.add(penyakit));
        });
        const frame = Array.from(relevantDiseases).sort();
        const fullFrameKey = frame.join(",");
        steps += `Frame (Θ): [${frame.join(", ")}]\n\n`;
        let m_comb = { [fullFrameKey]: 1 };
        steps += `Inisialisasi m(Θ) = { "${fullFrameKey}": 1 }\n\n`;
        // Proses perhitungan massa untuk setiap gejala yang dipilih
        selectedGejala.forEach((gejalaCode) => {
            const relasiGejala = gejalaToPenyakitMap[gejalaCode] || [];
            if (relasiGejala.length === 0)
                return;
            const m_gejala = {};
            const totalBobot = round4(relasiGejala.reduce((sum, item) => sum + item.bobot, 0));
            // Confidence diambil sebagai nilai bobot maksimum dari relasi
            const confidence = Math.max(...relasiGejala.map((item) => item.bobot));
            steps += `\nGejala ${gejalaCode} (${gejalaList.find((g) => g.kode === gejalaCode)?.nama || "Tidak diketahui"}):\n`;
            relasiGejala.forEach(({ penyakit, bobot }) => {
                steps += `   Bobot untuk ${penyakit}: ${formatNumber(bobot)}\n`;
            });
            steps += `   Confidence = ${formatNumber(confidence)}\n`;
            steps += `   Total bobot = ${formatNumber(totalBobot)}\n`;
            relasiGejala.forEach(({ penyakit, bobot }) => {
                const frac = round4(bobot / totalBobot);
                const m_val = round4(confidence * frac);
                steps += `      m(${gejalaCode}){${penyakit}} = ${formatNumber(confidence)} x (${formatNumber(bobot)}/${formatNumber(totalBobot)}) = ${formatNumber(m_val)}\n`;
                m_gejala[penyakit] = m_val;
            });
            const mTheta = round4(1 - confidence);
            m_gejala[fullFrameKey] = mTheta;
            steps += `      m(${gejalaCode})(Θ) = 1 - ${formatNumber(confidence)} = ${formatNumber(mTheta)}\n\n`;
            steps += `   m(${gejalaCode}) = ${JSON.stringify(m_gejala)}\n\n`;
            m_comb = combineMassFunctions(m_comb, m_gejala, frame);
            steps += `   m_comb setelah kombinasi dengan ${gejalaCode}: ${JSON.stringify(m_comb)}\n\n`;
        });
        if (Object.keys(m_comb).length === 0) {
            alert("Tidak ada penyakit yang cocok dengan gejala yang dipilih.");
            return;
        }
        // Hasil akhir langsung diambil dari m_comb tanpa distribusi tambahan
        const results = Object.entries(m_comb)
            .map(([key, mass]) => {
            const belief = round4(mass * 100);
            const diseases = key.split(",");
            const penyakitObj = penyakitList.find((p) => p.nama === diseases[0]) || {
                deskripsi: "Tidak tersedia",
                solusi: "Tidak tersedia",
            };
            return {
                penyakit: key,
                belief: belief,
                deskripsi: penyakitObj.deskripsi,
                solusi: penyakitObj.solusi,
                gejalaCocok: getMatchingSymptoms(key),
            };
        })
            .sort((a, b) => b.belief - a.belief);
        steps += `\nHasil diagnosa sementara: ${JSON.stringify(results)}\n\n`;
        if (results.length === 0) {
            alert("Tidak ada penyakit yang cocok dengan gejala yang dipilih.");
            return;
        }
        // Ambil penyakit dengan keyakinan tertinggi; jika ada tie, tampilkan semuanya
        const maxBeliefValue = results[0].belief;
        const ties = results.filter((item) => item.belief === maxBeliefValue);
        const finalResults = ties.length > 1 ? ties : [results[0]];
        steps += `Final results (tanpa distribusi tambahan): ${JSON.stringify(finalResults)}\n`;
        setHasilDiagnosa(finalResults);
        setCalcSteps(steps);
        // Simpan diagnosis utama ke backend
        const mainDiagnosis = finalResults[0];
        const diagnosisData = {
            id_pasien: localStorage.getItem("id_pasien"),
            nama_kucing: kucingData.nama,
            jenis_kelamin: kucingData.jenisKelamin,
            usia: kucingData.usia,
            warna_bulu: kucingData.warnaBulu,
            hasil_diagnosis: {
                penyakit: mainDiagnosis.penyakit,
                solusi: mainDiagnosis.solusi,
                deskripsi: mainDiagnosis.deskripsi,
                gejala_terdeteksi: mainDiagnosis.gejalaCocok,
            },
        };
        setLoading(true);
        setDone(false);
        try {
            await axiosInstance.post("/diagnosis/tambah", diagnosisData);
            setTimeout(() => {
                setDone(true);
                setTimeout(() => setLoading(false), 2000);
            }, 3000);
        }
        catch (error) {
            console.error("Error saving diagnosis:", error);
            alert("Gagal menyimpan diagnosis.");
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setKucingData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setKucingData((prevData) => ({ ...prevData, [name]: value }));
    };
    const checkIfGejalaVisible = () => {
        const { nama, jenisKelamin, usia, warnaBulu } = kucingData;
        setIsGejalaVisible(!!(nama && jenisKelamin && usia && warnaBulu));
    };
    useEffect(() => {
        checkIfGejalaVisible();
    }, [kucingData]);
    return (_jsxs(_Fragment, { children: [_jsx(NavbarComponent, {}), _jsxs("div", { className: "container mx-auto pt-20 p-3", children: [_jsx("div", { className: "relative w-full overflow-hidden rounded-lg shadow-lg mb-6", children: _jsx("img", { src: `/assets/banner-pakar.jpg`, alt: "Banner Pakar", className: "w-full object-cover h-40 sm:h-64 md:h-80 lg:h-[550px] transition duration-500" }) }), _jsxs("p", { className: "text-lg text-gray-700 mb-6 text-center", children: ["Selamat datang di ", _jsx("strong", { children: "Sistem Pakar Kucing!" }), " Pilih gejala yang sesuai untuk mendiagnosis masalah kesehatan pada kucing Anda."] }), _jsx("form", { onSubmit: (e) => e.preventDefault(), className: "mb-8", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Nama Kucing" }), _jsx("input", { type: "text", name: "nama", value: kucingData.nama, onChange: handleInputChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", placeholder: "Nama Kucing" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Jenis Kelamin" }), _jsxs("select", { name: "jenisKelamin", value: kucingData.jenisKelamin, onChange: handleSelectChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "", children: "Pilih Jenis Kelamin" }), _jsx("option", { value: "Jantan", children: "Jantan" }), _jsx("option", { value: "Betina", children: "Betina" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Usia" }), _jsx("input", { type: "text", name: "usia", value: kucingData.usia, onChange: handleInputChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", placeholder: "contoh: 3 bulan/1 tahun" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Warna Bulu" }), _jsx("input", { type: "text", name: "warnaBulu", value: kucingData.warnaBulu, onChange: handleInputChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", placeholder: "Warna Bulu Kucing" })] })] }) }), isGejalaVisible && (_jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "mb-8", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: gejalaList.map((gejala, index) => (_jsxs("label", { className: "flex items-center p-3 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50", children: [_jsx("input", { type: "checkbox", value: gejala.kode, onChange: (e) => {
                                                const { checked, value } = e.target;
                                                if (checked) {
                                                    setSelectedGejala((prev) => [...prev, value]);
                                                }
                                                else {
                                                    setSelectedGejala((prev) => prev.filter((g) => g !== value));
                                                }
                                            }, className: "w-5 h-5 rounded-full text-[#4F81C7] focus:ring-[#4F81C7]" }), _jsxs("span", { className: "ml-3 text-gray-700 text-sm", children: [gejala.kode, " - ", gejala.nama] })] }, index))) }), _jsx("button", { onClick: handleDiagnosa, className: "w-full py-3 mt-6 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300", children: "Diagnosa" })] })), hasilDiagnosa.length > 0 && (_jsxs("div", { className: "hasil-diagnosa bg-white p-8 rounded-2xl shadow-2xl mb-10", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#4F81C7] to-[#3e6b99] text-white p-6 rounded-lg shadow-md mb-6", children: [_jsxs("h2", { className: "text-3xl font-bold mb-2", children: ["Diagnosa Utama: ", hasilDiagnosa[0].penyakit] }), _jsx("div", { className: "w-full bg-gray-300 rounded-full h-4 mt-4", children: _jsx("div", { className: "bg-green-400 h-4 rounded-full transition-all duration-500", style: { width: `${formatNumber(hasilDiagnosa[0].belief)}%` } }) }), _jsxs("p", { className: "mt-2 text-sm", children: ["Keyakinan:", " ", _jsxs("strong", { children: [formatNumber(hasilDiagnosa[0].belief), "%"] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Deskripsi Penyakit" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: hasilDiagnosa[0].deskripsi })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Solusi yang Disarankan" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: hasilDiagnosa[0].solusi })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Gejala Terdeteksi" }), _jsx("div", { className: "flex flex-wrap gap-2", children: hasilDiagnosa[0].gejalaCocok.map((gejala, index) => (_jsx("span", { className: "bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm shadow-sm", children: gejala }, index))) })] })] }), hasilDiagnosa.length > 1 && (_jsxs("div", { className: "mt-10", children: [_jsx("button", { className: "w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-semibold text-[#4F81C7] transition duration-300", onClick: () => setShowOtherPenyakit(!showOtherPenyakit), children: showOtherPenyakit
                                            ? "🔼 Sembunyikan Penyakit Lainnya"
                                            : "🔽 Tampilkan Penyakit Lainnya" }), showOtherPenyakit && (_jsx("div", { className: "grid gap-6 mt-6", children: hasilDiagnosa
                                            .slice(1)
                                            .map(({ penyakit, belief, gejalaCocok, deskripsi, solusi }, idx) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6 shadow-lg bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "text-xl font-bold text-gray-700", children: penyakit }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Keyakinan:", " ", _jsxs("strong", { children: [formatNumber(belief), "%"] })] }), _jsx("div", { className: "w-full bg-gray-300 rounded-full h-2 mt-1", children: _jsx("div", { className: "bg-yellow-400 h-2 rounded-full transition-all duration-500", style: {
                                                                            width: `${formatNumber(belief)}%`,
                                                                        } }) })] })] }), _jsxs("p", { className: "text-gray-600 mb-2", children: [_jsx("strong", { children: "Deskripsi:" }), " ", deskripsi] }), _jsxs("p", { className: "text-gray-600 mb-2", children: [_jsx("strong", { children: "Solusi:" }), " ", solusi] }), _jsx("p", { className: "text-gray-600 mb-2", children: _jsx("strong", { children: "Gejala Terdeteksi:" }) }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: gejalaCocok.map((gejala, index) => (_jsx("span", { className: "bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm", children: gejala }, index))) })] }, idx))) }))] })), _jsxs("div", { className: "mt-10", children: [_jsx("button", { className: "w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-semibold text-[#4F81C7] transition duration-300", onClick: () => setShowCalcSteps(!showCalcSteps), children: showCalcSteps
                                            ? "🔼 Sembunyikan Langkah Perhitungan"
                                            : "🔽 Tampilkan Langkah Perhitungan" }), showCalcSteps && (_jsxs("div", { className: "mt-4 p-4 border-t border-gray-300", children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: "Langkah Perhitungan:" }), _jsx("pre", { className: "whitespace-pre-wrap text-gray-700 text-sm", children: calcSteps })] }))] })] }))] }), loading && _jsx(LoadingModal, {})] }));
};
export default SistemPakarPage;
