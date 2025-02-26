import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/user/PrintDiagnosis.tsx
import { forwardRef } from "react";
const PrintDiagnosis = forwardRef(({ diagnosis }, ref) => {
    return (_jsxs("div", { ref: ref, className: "p-6 bg-white text-gray-800 w-full", children: [_jsx("h2", { className: "text-2xl font-bold text-center mb-4", children: "\uD83D\uDCDD Struk Diagnosis Kucing" }), _jsxs("div", { className: "border-b pb-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nama Kucing:" }), " ", diagnosis.nama_kucing] }), _jsxs("p", { children: [_jsx("strong", { children: "Jenis Kelamin:" }), " ", diagnosis.jenis_kelamin] }), _jsxs("p", { children: [_jsx("strong", { children: "Usia:" }), " ", diagnosis.usia] }), _jsxs("p", { children: [_jsx("strong", { children: "Warna Bulu:" }), " ", diagnosis.warna_bulu] })] }), _jsxs("div", { className: "py-4", children: [_jsx("h3", { className: "text-xl font-semibold text-[#4F81C7]", children: "\uD83E\uDE7A Diagnosis Utama" }), _jsxs("p", { children: [_jsx("strong", { children: "Penyakit:" }), " ", diagnosis.hasil_diagnosis.penyakit] }), _jsxs("p", { children: [_jsx("strong", { children: "Gejala:" }), " ", diagnosis.hasil_diagnosis.gejala_terdeteksi.join(", ")] }), _jsxs("p", { children: [_jsx("strong", { children: "Solusi:" }), " ", diagnosis.hasil_diagnosis.solusi] })] }), diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain?.length > 0 && (_jsxs("div", { className: "pt-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700", children: "\uD83C\uDF1F Kemungkinan Penyakit Lain" }), diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map((penyakit, idx) => (_jsxs("div", { className: "mt-2 border-t pt-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Penyakit:" }), " ", penyakit.penyakit] }), _jsxs("p", { children: [_jsx("strong", { children: "Gejala:" }), " ", penyakit.gejala_terdeteksi.join(", ")] }), _jsxs("p", { children: [_jsx("strong", { children: "Solusi:" }), " ", penyakit.solusi] })] }, idx)))] })), _jsx("div", { className: "text-center mt-6", children: _jsxs("p", { className: "text-sm text-gray-500", children: ["\uD83D\uDD52 Dicetak pada: ", new Date(diagnosis.tanggal_diagnosis).toLocaleString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })] }) })] }));
});
export default PrintDiagnosis;
