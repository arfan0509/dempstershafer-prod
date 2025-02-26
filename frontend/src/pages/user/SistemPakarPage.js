import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import NavbarComponent from "../../components/user/NavbarComponent";
import LoadingModal from "../../components/user/LoadingModal";
const SistemPakarPage = () => {
    const [gejalaList, setGejalaList] = useState([]);
    const [penyakitList, setPenyakitList] = useState([]);
    const [selectedGejala, setSelectedGejala] = useState([]);
    const [hasilDiagnosa, setHasilDiagnosa] = useState([]);
    const [showOtherPenyakit, setShowOtherPenyakit] = useState(false);
    // State untuk informasi kucing
    const [kucingData, setKucingData] = useState({
        nama: "",
        jenisKelamin: "",
        usia: "",
        warnaBulu: "",
    });
    // State untuk mengontrol apakah gejala dapat ditampilkan
    const [isGejalaVisible, setIsGejalaVisible] = useState(false);
    // State untuk kontrol loading modal
    const [loading, setLoading] = useState(false);
    // State untuk menunjukkan checklist setelah selesai
    const [done, setDone] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/relasi");
                const data = response.data;
                const gejalaMap = {};
                const penyakitMap = {};
                data.forEach((item) => {
                    gejalaMap[item.gejala.kode_gejala] = {
                        nama: item.gejala.nama_gejala,
                        bobot: parseFloat(item.gejala.bobot),
                        kode: item.gejala.kode_gejala,
                    };
                    if (!penyakitMap[item.penyakit.kode_penyakit]) {
                        penyakitMap[item.penyakit.kode_penyakit] = {
                            nama: item.penyakit.nama_penyakit,
                            deskripsi: item.penyakit.deskripsi,
                            solusi: item.penyakit.solusi,
                            gejala: [],
                        };
                    }
                    penyakitMap[item.penyakit.kode_penyakit].gejala.push(item.gejala.kode_gejala);
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
    const handleDiagnosa = async () => {
        if (selectedGejala.length === 0) {
            alert("Silakan pilih setidaknya satu gejala!");
            return;
        }
        let hasil = {};
        let totalBelief = 0;
        // 🔎 Hitung belief untuk setiap penyakit
        penyakitList.forEach((penyakit) => {
            let belief = 0;
            let gejalaCocok = [];
            penyakit.gejala.forEach((gejalaKode) => {
                const gejala = gejalaList.find((g) => g.kode === gejalaKode);
                if (gejala && selectedGejala.includes(gejala.kode)) {
                    belief += gejala.bobot;
                    gejalaCocok.push(gejala.nama);
                }
            });
            if (belief > 0) {
                hasil[penyakit.nama] = { belief, gejalaCocok };
                totalBelief += belief;
            }
        });
        if (totalBelief > 0) {
            Object.keys(hasil).forEach((penyakitNama) => {
                hasil[penyakitNama].belief =
                    (hasil[penyakitNama].belief / totalBelief) * 100;
            });
        }
        const sortedResults = Object.entries(hasil).sort((a, b) => b[1].belief -
            a[1].belief);
        setHasilDiagnosa(sortedResults);
        // 🔀 Identifikasi semua penyakit dengan persentase tertinggi yang sama
        const highestBelief = sortedResults[0][1].belief;
        const topDiagnoses = sortedResults.filter(([_, value]) => value.belief === highestBelief);
        // 🔄 Format data untuk dikirim ke backend
        const mainDiagnosis = {
            penyakit: topDiagnoses[0][0],
            solusi: penyakitList.find((p) => p.nama === topDiagnoses[0][0])?.solusi,
            gejala_terdeteksi: topDiagnoses[0][1]
                .gejalaCocok,
            kemungkinan_penyakit_lain: topDiagnoses.slice(1).map(([nama, data]) => ({
                penyakit: nama,
                solusi: penyakitList.find((p) => p.nama === nama)?.solusi,
                gejala_terdeteksi: data.gejalaCocok,
            })),
        };
        const diagnosisData = {
            id_pasien: localStorage.getItem("id_pasien"),
            nama_kucing: kucingData.nama,
            jenis_kelamin: kucingData.jenisKelamin,
            usia: kucingData.usia,
            warna_bulu: kucingData.warnaBulu,
            hasil_diagnosis: mainDiagnosis,
        };
        // 🕒 Tampilkan loading modal
        setLoading(true);
        setDone(false);
        try {
            const response = await axiosInstance.post("/diagnosis/tambah", diagnosisData);
            console.log("Diagnosis berhasil disimpan:", response.data.message);
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
    // Fungsi untuk mengecek apakah semua data kucing sudah terisi
    const checkIfGejalaVisible = () => {
        const { nama, jenisKelamin, usia, warnaBulu } = kucingData;
        if (nama && jenisKelamin && usia && warnaBulu) {
            setIsGejalaVisible(true); // Jika sudah lengkap, tampilkan pilihan gejala
        }
        else {
            setIsGejalaVisible(false); // Jika belum lengkap, sembunyikan pilihan gejala
        }
    };
    useEffect(() => {
        checkIfGejalaVisible();
    }, [kucingData]); // Memantau perubahan pada data kucing
    return (_jsxs(_Fragment, { children: [_jsx(NavbarComponent, {}), _jsxs("div", { className: "container mx-auto pt-20 p-3", children: [_jsx("div", { className: "relative w-full overflow-hidden rounded-lg shadow-lg mb-6", children: _jsx("img", { src: `/assets/banner-pakar.jpg`, alt: "Banner Pakar", className: "w-full object-cover h-40 sm:h-64 md:h-80 lg:h-[550px] transition duration-500" }) }), _jsxs("p", { className: "text-lg text-gray-700 mb-6 text-center", children: ["Selamat datang di ", _jsx("strong", { children: "Sistem Pakar Kucing!" }), " Pilih gejala yang sesuai untuk mendiagnosis masalah kesehatan pada kucing Anda."] }), _jsx("form", { onSubmit: (e) => e.preventDefault(), className: "mb-8", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Nama Kucing" }), _jsx("input", { type: "text", name: "nama", value: kucingData.nama, onChange: handleInputChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", placeholder: "Nama Kucing" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Jenis Kelamin" }), _jsxs("select", { name: "jenisKelamin", value: kucingData.jenisKelamin, onChange: handleSelectChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "", children: "Pilih Jenis Kelamin" }), _jsx("option", { value: "Jantan", children: "Jantan" }), _jsx("option", { value: "Betina", children: "Betina" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Usia" }), _jsx("input", { type: "text", name: "usia", value: kucingData.usia, onChange: handleInputChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", placeholder: "contoh: 3 bulan/1 tahun" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700", children: "Warna Bulu" }), _jsx("input", { type: "text", name: "warnaBulu", value: kucingData.warnaBulu, onChange: handleInputChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", placeholder: "Warna Bulu Kucing" })] })] }) }), isGejalaVisible && (_jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "mb-8", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: gejalaList.map((gejala, index) => (_jsxs("label", { className: "flex items-center p-3 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50", children: [_jsx("input", { type: "checkbox", value: gejala.kode, onChange: (e) => {
                                                const { checked, value } = e.target;
                                                if (checked) {
                                                    setSelectedGejala((prev) => [...prev, value]);
                                                }
                                                else {
                                                    setSelectedGejala((prev) => prev.filter((gejala) => gejala !== value));
                                                }
                                            }, className: "w-5 h-5 rounded-full text-[#4F81C7] focus:ring-[#4F81C7]" }), _jsxs("span", { className: "ml-3 text-gray-700 text-sm", children: [gejala.kode, " - ", gejala.nama] })] }, index))) }), _jsx("button", { onClick: handleDiagnosa, className: "w-full py-3 mt-6 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300", children: "Diagnosa" })] })), hasilDiagnosa.length > 0 && (_jsxs("div", { className: "hasil-diagnosa bg-white p-8 rounded-2xl shadow-2xl mb-10", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#4F81C7] to-[#3e6b99] text-white p-6 rounded-lg shadow-md mb-6", children: [_jsxs("h2", { className: "text-3xl font-bold mb-2", children: ["Diagnosa Utama: ", hasilDiagnosa[0][0]] }), _jsx("div", { className: "w-full bg-gray-300 rounded-full h-4 mt-4", children: _jsx("div", { className: "bg-green-400 h-4 rounded-full transition-all duration-500", style: { width: `${hasilDiagnosa[0][1].belief.toFixed(2)}%` } }) }), _jsxs("p", { className: "mt-2 text-sm", children: ["Keyakinan:", " ", _jsxs("strong", { children: [hasilDiagnosa[0][1].belief.toFixed(2), "%"] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Deskripsi Penyakit" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: penyakitList.find((p) => p.nama === hasilDiagnosa[0][0])
                                                    ?.deskripsi })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Solusi yang Disarankan" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: penyakitList.find((p) => p.nama === hasilDiagnosa[0][0])
                                                    ?.solusi })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Gejala Terdeteksi" }), _jsx("div", { className: "flex flex-wrap gap-2", children: hasilDiagnosa[0][1].gejalaCocok.map((gejala, index) => (_jsx("span", { className: "bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm shadow-sm", children: gejala }, index))) })] })] }), _jsxs("div", { className: "mt-10", children: [_jsx("button", { className: "w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-semibold text-[#4F81C7] transition duration-300", onClick: () => setShowOtherPenyakit(!showOtherPenyakit), children: showOtherPenyakit
                                            ? "🔼 Sembunyikan Penyakit Lainnya"
                                            : "🔽 Tampilkan Penyakit Lainnya" }), showOtherPenyakit && (_jsx("div", { className: "grid gap-6 mt-6", children: hasilDiagnosa
                                            .slice(1)
                                            .map(([penyakitNama, { belief, gejalaCocok }], idx) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6 shadow-lg bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "text-xl font-bold text-gray-700", children: penyakitNama }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Keyakinan: ", _jsxs("strong", { children: [belief.toFixed(2), "%"] })] }), _jsx("div", { className: "w-full bg-gray-300 rounded-full h-2 mt-1", children: _jsx("div", { className: "bg-yellow-400 h-2 rounded-full transition-all duration-500", style: { width: `${belief.toFixed(2)}%` } }) })] })] }), _jsxs("p", { className: "text-gray-600 mb-2", children: [_jsx("strong", { children: "Deskripsi:" }), " ", penyakitList.find((p) => p.nama === penyakitNama)
                                                            ?.deskripsi] }), _jsxs("p", { className: "text-gray-600 mb-2", children: [_jsx("strong", { children: "Solusi:" }), " ", penyakitList.find((p) => p.nama === penyakitNama)
                                                            ?.solusi] }), _jsx("p", { className: "text-gray-600 mb-2", children: _jsx("strong", { children: "Gejala Terdeteksi:" }) }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: gejalaCocok.map((gejala, index) => (_jsx("span", { className: "bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm", children: gejala }, index))) })] }, idx))) }))] })] }))] }), loading && _jsx(LoadingModal, {})] }));
};
export default SistemPakarPage;
