// components/user/PrintDiagnosis.tsx
import React, { forwardRef } from "react";

interface PrintDiagnosisProps {
  diagnosis: any;
}

const PrintDiagnosis = forwardRef<HTMLDivElement, PrintDiagnosisProps>(
  ({ diagnosis }, ref) => {
    return (
      <div ref={ref} className="p-6 bg-white text-gray-800 w-full">
        <h2 className="text-2xl font-bold text-center mb-4">📝 Struk Diagnosis Kucing</h2>
        <div className="border-b pb-4">
          <p><strong>Nama Kucing:</strong> {diagnosis.nama_kucing}</p>
          <p><strong>Jenis Kelamin:</strong> {diagnosis.jenis_kelamin}</p>
          <p><strong>Usia:</strong> {diagnosis.usia}</p>
          <p><strong>Warna Bulu:</strong> {diagnosis.warna_bulu}</p>
        </div>

        <div className="py-4">
          <h3 className="text-xl font-semibold text-[#4F81C7]">🩺 Diagnosis Utama</h3>
          <p><strong>Penyakit:</strong> {diagnosis.hasil_diagnosis.penyakit}</p>
          <p><strong>Gejala:</strong> {diagnosis.hasil_diagnosis.gejala_terdeteksi.join(", ")}</p>
          <p><strong>Solusi:</strong> {diagnosis.hasil_diagnosis.solusi}</p>
        </div>

        {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain?.length > 0 && (
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-700">🌟 Kemungkinan Penyakit Lain</h3>
            {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map((penyakit: any, idx: number) => (
              <div key={idx} className="mt-2 border-t pt-2">
                <p><strong>Penyakit:</strong> {penyakit.penyakit}</p>
                <p><strong>Gejala:</strong> {penyakit.gejala_terdeteksi.join(", ")}</p>
                <p><strong>Solusi:</strong> {penyakit.solusi}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🕒 Dicetak pada: {new Date(diagnosis.tanggal_diagnosis).toLocaleString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }
);

export default PrintDiagnosis;
