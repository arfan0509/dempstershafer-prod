import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import NavbarComponent from "../../components/user/NavbarComponent";
import LoadingModal from "../../components/user/LoadingModal";
// Fungsi pembulatan ke 4 desimal
const round4 = (num) => Math.round(num * 10000) / 10000;
// Fungsi format untuk menghilangkan trailing nol (misal: 0.2000 → "0.2")
const formatNumber = (num) => parseFloat(num.toFixed(4)).toString();
/**
 * combineMassFunctions: Menggabungkan dua fungsi massa (m1 dan m2)
 * menggunakan aturan kombinasi Dempster-Shafer.
 * - m1: Fungsi massa sebelumnya.
 * - m2: Fungsi massa gejala saat ini.
 * - frame: Daftar penyakit (himpunan Θ) yang relevan (dalam hal ini semua penyakit).
 * - stepsDetail: Array string untuk mencatat tiap langkah perhitungan.
 */
const combineMassFunctions = (m1, m2, frame, stepsDetail) => {
    // Frame penuh hanya untuk logging
    const fullFrameKey = frame.slice().sort().join(",");
    let m_comb = {};
    let K = 0; // total konflik
    stepsDetail.push(`Mulai kombinasi massa:`);
    for (let key1 in m1) {
        for (let key2 in m2) {
            // Jika key adalah "Θ", artinya ketidakpastian → gunakan seluruh frame
            const set1 = key1 === "Θ" ? new Set(frame) : new Set(key1.split(","));
            const set2 = key2 === "Θ" ? new Set(frame) : new Set(key2.split(","));
            // Hitung irisan dari kedua set
            const intersection = new Set([...set1].filter((x) => set2.has(x)));
            const product = round4(m1[key1] * m2[key2]);
            stepsDetail.push(`  ${key1} (${formatNumber(m1[key1])}) x ${key2} (${formatNumber(m2[key2])}) = ${formatNumber(product)} → ${intersection.size === 0
                ? "konflik"
                : `hasil ${[...intersection].sort().join(",")}`}`);
            if (intersection.size === 0) {
                K = round4(K + product);
            }
            else {
                const intersectionKey = [...intersection].sort().join(",");
                m_comb[intersectionKey] = round4((m_comb[intersectionKey] || 0) + product);
            }
        }
    }
    stepsDetail.push(`Total konflik (K): ${formatNumber(K)}`);
    // Normalisasi: bagi setiap massa dengan (1 - K)
    const normalization = round4(1 - K);
    stepsDetail.push(`Normalisasi = 1 - K = ${formatNumber(normalization)}`);
    if (normalization === 0)
        return {};
    for (let key in m_comb) {
        const before = m_comb[key];
        m_comb[key] = round4(m_comb[key] / normalization);
        stepsDetail.push(`  Normalisasi m(${key}): ${formatNumber(before)} / ${formatNumber(normalization)} = ${formatNumber(m_comb[key])}`);
    }
    stepsDetail.push(`Hasil kombinasi: ${JSON.stringify(m_comb)}`);
    return m_comb;
};
const SistemPakarPage = () => {
    const [gejalaList, setGejalaList] = useState([]);
    const [penyakitList, setPenyakitList] = useState([]);
    const [selectedGejala, setSelectedGejala] = useState([]);
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
                    // Simpan data gejala (gunakan item.bobot untuk relasi)
                    gejalaMap[item.gejala.kode_gejala] = {
                        nama: item.gejala.nama_gejala,
                        bobot: parseFloat(item.bobot),
                        kode: item.gejala.kode_gejala,
                    };
                    // Simpan data penyakit beserta relasinya
                    if (!penyakitMap[item.penyakit.kode_penyakit]) {
                        penyakitMap[item.penyakit.kode_penyakit] = {
                            nama: item.penyakit.nama_penyakit,
                            deskripsi: item.penyakit.deskripsi,
                            solusi: item.penyakit.solusi,
                            gejala: [],
                        };
                    }
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
    // Fungsi untuk mendapatkan nama-nama gejala yang mendukung suatu penyakit
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
    // Fungsi utama perhitungan Dempster-Shafer (DS) dengan pendekatan "ambil bobot tertinggi"
    const handleDiagnosa = async () => {
        if (selectedGejala.length === 0) {
            alert("Silakan pilih setidaknya satu gejala!");
            return;
        }
        let steps = "";
        // Urutkan gejala yang dipilih agar konsisten (misalnya: G2, G3, G4)
        const sortedSelectedGejala = [...selectedGejala].sort();
        steps += `Gejala yang dipilih (urut): ${sortedSelectedGejala.join(", ")}\n\n`;
        // Buat array semua penyakit (bukan hanya relevan)
        const allDiseases = penyakitList.map((p) => p.nama);
        // Buat frame yang mencakup semua penyakit
        const frame = Array.from(new Set(allDiseases)).sort();
        // Tampilkan frame berisi seluruh penyakit
        steps += `Frame (Θ) (All Diseases): [${frame.join(", ")}]\n\n`;
        // Inisialisasi massa awal: m(Θ)=1.
        // Untuk representasi di object, kita pakai key gabungan (fullFrameKey) = "P1,P2,..."
        // agar sesuai dengan combineMassFunctions
        const fullFrameKey = frame.join(",");
        let m_comb = { [fullFrameKey]: 1 };
        steps += `Inisialisasi: m(Θ) = { "${fullFrameKey}": 1 }\n\n`;
        // Buat mapping gejala → daftar (penyakit, bobot)
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
        // Proses perhitungan untuk setiap gejala terpilih
        sortedSelectedGejala.forEach((gejalaCode) => {
            const relasiGejala = gejalaToPenyakitMap[gejalaCode] || [];
            if (relasiGejala.length === 0)
                return;
            const m_gejala = {};
            // Total bobot dari semua relasi untuk gejala ini
            const totalBobot = round4(relasiGejala.reduce((sum, item) => sum + item.bobot, 0));
            // Confidence: ambil bobot tertinggi di antara relasi
            const confidence = Math.max(...relasiGejala.map((item) => item.bobot));
            steps += `Gejala ${gejalaCode} (${gejalaList.find((g) => g.kode === gejalaCode)?.nama || "Tidak diketahui"}):\n`;
            relasiGejala.forEach(({ penyakit, bobot }) => {
                steps += `  Bobot untuk ${penyakit}: ${formatNumber(bobot)}\n`;
            });
            steps += `  Confidence = ${formatNumber(confidence)}\n`;
            steps += `  Total bobot = ${formatNumber(totalBobot)}\n`;
            // Bagi bobot tiap penyakit secara proporsional dan kalikan dengan confidence
            relasiGejala.forEach(({ penyakit, bobot }) => {
                const frac = round4(bobot / totalBobot);
                const m_val = round4(confidence * frac);
                steps += `    m(${gejalaCode}){${penyakit}} = ${formatNumber(confidence)} x (${formatNumber(bobot)}/${formatNumber(totalBobot)}) = ${formatNumber(m_val)}\n`;
                m_gejala[penyakit] = m_val;
            });
            // Sisa keyakinan menjadi ketidakpastian, simpan dengan key "Θ"
            const mTheta = round4(1 - confidence);
            m_gejala["Θ"] = mTheta;
            steps += `    m(${gejalaCode})(Θ) = 1 - ${formatNumber(confidence)} = ${formatNumber(mTheta)}\n\n`;
            steps += `  m(${gejalaCode}) = ${JSON.stringify(m_gejala)}\n\n`;
            // Gabungkan fungsi massa gejala ini dengan kombinasi sebelumnya
            const stepsDetail = [];
            m_comb = combineMassFunctions(m_comb, m_gejala, frame, stepsDetail);
            steps += `Setelah kombinasi dengan ${gejalaCode}:\n`;
            stepsDetail.forEach((line) => (steps += "  " + line + "\n"));
            steps += "\n";
        });
        if (Object.keys(m_comb).length === 0) {
            alert("Tidak ada penyakit yang cocok dengan gejala yang dipilih.");
            return;
        }
        // Buat hasil akhir (dalam persen) berdasarkan m_comb
        const results = Object.entries(m_comb)
            .map(([key, mass]) => {
            const belief = round4(mass * 100);
            // Ambil data penyakit berdasarkan entri pertama (jika key merupakan hipotesis gabungan)
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
        steps += `Hasil diagnosa sementara: ${JSON.stringify(results)}\n\n`;
        if (results.length === 0) {
            alert("Tidak ada penyakit yang cocok dengan gejala yang dipilih.");
            return;
        }
        // Ambil hasil dengan keyakinan tertinggi (jika ada tie, tampilkan semua)
        const maxBeliefValue = results[0].belief;
        const ties = results.filter((item) => item.belief === maxBeliefValue);
        const finalResults = ties.length > 1 ? ties : [results[0]];
        steps += `Final results: ${JSON.stringify(finalResults)}\n`;
        setCalcSteps(steps);
        // Tampilkan loading, lalu simpan diagnosis ke backend
        setLoading(true);
        setDone(false);
        try {
            // Buat payload ke backend
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
            await axiosInstance.post("/diagnosis/tambah", diagnosisData);
            // Setelah post berhasil, setTimeout untuk mensimulasikan proses
            setTimeout(() => {
                setDone(true);
                setTimeout(() => setLoading(false), 2000);
            }, 3000);
            // Baru kita set hasilDiagnosa (supaya tidak muncul sebelum loading selesai)
            // Jika Anda ingin hasil langsung muncul tanpa menunggu loading, pindahkan setHasilDiagnosa(finalResults) sebelum setTimeout
            setHasilDiagnosa(finalResults);
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
                                            }, className: "w-5 h-5 rounded-full text-[#4F81C7] focus:ring-[#4F81C7]" }), _jsxs("span", { className: "ml-3 text-gray-700 text-sm", children: [gejala.kode, " - ", gejala.nama] })] }, index))) }), _jsx("button", { onClick: handleDiagnosa, className: "w-full py-3 mt-6 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300", children: "Diagnosa" })] })), done && hasilDiagnosa.length > 0 && (_jsxs("div", { className: "hasil-diagnosa bg-white p-8 rounded-2xl shadow-2xl mb-10", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#4F81C7] to-[#3e6b99] text-white p-6 rounded-lg shadow-md mb-6", children: [_jsxs("h2", { className: "text-3xl font-bold mb-2", children: ["Diagnosa Utama: ", hasilDiagnosa[0].penyakit] }), _jsx("div", { className: "w-full bg-gray-300 rounded-full h-4 mt-4", children: _jsx("div", { className: "bg-green-400 h-4 rounded-full transition-all duration-500", style: { width: `${formatNumber(hasilDiagnosa[0].belief)}%` } }) }), _jsxs("p", { className: "mt-2 text-sm", children: ["Keyakinan:", " ", _jsxs("strong", { children: [formatNumber(hasilDiagnosa[0].belief), "%"] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Deskripsi Penyakit" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: hasilDiagnosa[0].deskripsi })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Solusi yang Disarankan" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: hasilDiagnosa[0].solusi })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Gejala Terdeteksi" }), _jsx("div", { className: "flex flex-wrap gap-2", children: hasilDiagnosa[0].gejalaCocok.map((gejala, index) => (_jsx("span", { className: "bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm shadow-sm", children: gejala }, index))) })] })] }), hasilDiagnosa.length > 1 && (_jsxs("div", { className: "mt-10", children: [_jsx("button", { className: "w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-semibold text-[#4F81C7] transition duration-300", onClick: () => setShowOtherPenyakit(!showOtherPenyakit), children: showOtherPenyakit
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
