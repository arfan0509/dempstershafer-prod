import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, } from "recharts";
import { FaVirus, FaHeartbeat, FaUser, FaStethoscope } from "react-icons/fa";
const COLORS = [
    "#1f77b4", // Biru
    "#ff7f0e", // Oranye
    "#2ca02c", // Hijau
    "#d62728", // Merah
    "#9467bd", // Ungu
    "#8c564b", // Coklat
    "#e377c2", // Pink
    "#7f7f7f", // Abu-abu
    "#bcbd22", // Zaitun
    "#17becf", // Cyan
];
const Dashboard = () => {
    const [penyakitCount, setPenyakitCount] = useState(0);
    const [gejalaCount, setGejalaCount] = useState(0);
    const [pasienCount, setPasienCount] = useState(0);
    const [diagnosisCount, setDiagnosisCount] = useState(0);
    const [latestDiagnoses, setLatestDiagnoses] = useState([]);
    const [topPenyakit, setTopPenyakit] = useState([]);
    const [topGejala, setTopGejala] = useState([]);
    const getAuthHeaders = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            window.location.href = "/admin-login";
            return null;
        }
        return { headers: { Authorization: `Bearer ${token}` } };
    };
    const fetchDashboardData = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            const [penyakitRes, gejalaRes, pasienRes, diagnosisRes] = await Promise.all([
                axiosInstance.get("/penyakit", headers),
                axiosInstance.get("/gejala", headers),
                axiosInstance.get("/pasien/all", headers),
                axiosInstance.get("/diagnosis", headers),
            ]);
            setPenyakitCount(penyakitRes.data.length);
            setGejalaCount(gejalaRes.data.length);
            setPasienCount(pasienRes.data.length);
            setDiagnosisCount(diagnosisRes.data.length);
            setLatestDiagnoses(diagnosisRes.data
                .sort((a, b) => new Date(b.tanggal_diagnosis).getTime() -
                new Date(a.tanggal_diagnosis).getTime())
                .slice(0, 5));
            const penyakitFrequency = {};
            const gejalaFrequency = {};
            diagnosisRes.data.forEach((d) => {
                // Hitung frekuensi penyakit
                penyakitFrequency[d.hasil_diagnosis.penyakit] =
                    (penyakitFrequency[d.hasil_diagnosis.penyakit] || 0) + 1;
                // Hitung frekuensi gejala
                d.hasil_diagnosis.gejala_terdeteksi.forEach((g) => {
                    gejalaFrequency[g] = (gejalaFrequency[g] || 0) + 1;
                });
            });
            // Tampilkan SEMUA penyakit (tanpa .slice(0,5))
            setTopPenyakit(Object.entries(penyakitFrequency)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value));
            // Untuk gejala, tetap ambil 5 terbanyak (sesuai kebutuhan)
            setTopGejala(Object.entries(gejalaFrequency)
                .map(([name, value]) => ({ name, value: value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5));
        }
        catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);
    return (_jsxs("div", { className: "p-2 min-h-screen", children: [_jsx("h1", { className: "text-3xl font-bold text-[#4F81C7] mb-6", children: "Dashboard Admin" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [
                    {
                        label: "Penyakit",
                        count: penyakitCount,
                        icon: _jsx(FaVirus, { size: 30 }),
                    },
                    {
                        label: "Gejala",
                        count: gejalaCount,
                        icon: _jsx(FaHeartbeat, { size: 30 }),
                    },
                    { label: "User", count: pasienCount, icon: _jsx(FaUser, { size: 30 }) },
                    {
                        label: "Diagnosis",
                        count: diagnosisCount,
                        icon: _jsx(FaStethoscope, { size: 30 }),
                    },
                ].map(({ label, count, icon }) => (_jsxs("div", { className: "p-6 bg-[#4F81C7] text-white rounded-xl shadow-lg flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Jumlah ", label] }), _jsx("p", { className: "text-3xl font-bold", children: count })] }), _jsx("div", { children: icon })] }, label))) }), _jsxs("div", { className: "bg-white rounded-md shadow-lg p-6 mt-10 overflow-x-auto", children: [_jsx("h3", { className: "text-2xl font-semibold text-[#4F81C7] mb-4", children: "Diagnosis Terbaru" }), _jsx("div", { className: "w-full", children: _jsxs("table", { className: "w-full min-w-[600px] text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#4F81C7] text-white", children: [_jsx("th", { className: "p-3", children: "Nama Pemilik" }), _jsx("th", { className: "p-3", children: "Nama Kucing" }), _jsx("th", { className: "p-3", children: "Tanggal" }), _jsx("th", { className: "p-3", children: "Penyakit" })] }) }), _jsx("tbody", { children: latestDiagnoses.map((d, idx) => (_jsxs("tr", { className: "border-b hover:bg-gray-100", children: [_jsx("td", { className: "p-3", children: d.pasien?.nama || "-" }), _jsx("td", { className: "p-3", children: d.nama_kucing || "-" }), _jsx("td", { className: "p-3", children: new Date(d.tanggal_diagnosis).toLocaleDateString("id-ID") }), _jsx("td", { className: "p-3", children: d.hasil_diagnosis.penyakit })] }, idx))) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-4", children: [_jsx("h3", { className: "text-xl font-semibold text-[#4F81C7] mb-4", children: "Penyakit Paling Umum" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: topPenyakit, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, fill: "#4F81C7", label: true, children: topPenyakit.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }), _jsx("div", { className: "mt-4 flex flex-wrap", children: topPenyakit.map((entry, index) => (_jsxs("div", { className: "flex items-center mr-4", children: [_jsx("div", { className: "w-4 h-4 mr-1", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsx("span", { children: entry.name })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-4", children: [_jsx("h3", { className: "text-xl font-semibold text-[#4F81C7] mb-4", children: "Gejala Paling Sering Muncul" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: topGejala, children: [_jsx(XAxis, { dataKey: "name", hide: true }), _jsx(YAxis, { allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", children: topGejala.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) })] }) }), _jsx("div", { className: "mt-4 flex flex-wrap", children: topGejala.map((entry, index) => (_jsxs("div", { className: "flex items-center mr-4", children: [_jsx("div", { className: "w-4 h-4 mr-1", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsx("span", { children: entry.name })] }, index))) })] })] })] }));
};
export default Dashboard;
