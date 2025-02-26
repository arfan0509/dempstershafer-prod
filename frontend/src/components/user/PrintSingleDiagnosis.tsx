const PrintSingleDiagnosis = (diagnosisData: any) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Diagnosis</title>
            <style>
              @page { size: A4; margin: 20mm; }
              html, body { width: 210mm; font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: #333; }
              .container { width: 100%; padding: 20px; box-sizing: border-box; }
              .header { display: flex; align-items: center; justify-content: center; gap: 15px; border-bottom: 1px solid #ddd; margin-bottom: 20px; padding-bottom: 10px; }
              .header img { width: 60px; height: auto; }
              .header h2 { font-size: 22px; color: #4F81C7; margin: 0; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; font-size: 16px; color: #4F81C7; margin-bottom: 8px; }
              .content-box { padding: 15px; border: 1px solid #eee; border-radius: 6px; background-color: #f9f9f9; }
              .gejala-tag { display: inline-block; background-color: #4F81C7; color: white; padding: 5px 10px; margin: 3px 3px 0 0; border-radius: 20px; font-size: 13px; }
              .footer { text-align: center; font-size: 13px; color: #777; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="/assets/struk.png" alt="Struk Logo" />
                <h2>Detail Diagnosis Kucing</h2>
              </div>
  
              <div class="section">
                <div class="section-title">Informasi Kucing</div>
                <div class="content-box">
                  <p><strong>Nama:</strong> ${diagnosisData.nama_kucing}</p>
                  <p><strong>Jenis Kelamin:</strong> ${
                    diagnosisData.jenis_kelamin
                  }</p>
                  <p><strong>Usia:</strong> ${diagnosisData.usia}</p>
                  <p><strong>Warna Bulu:</strong> ${
                    diagnosisData.warna_bulu
                  }</p>
                </div>
              </div>
  
              <div class="section">
                <div class="section-title">Diagnosis Utama</div>
                <div class="content-box">
                  <p><strong>Penyakit:</strong> ${
                    diagnosisData.hasil_diagnosis.penyakit
                  }</p>
                  <p><strong>Gejala Terdeteksi:</strong></p>
                  <div>
                    ${diagnosisData.hasil_diagnosis.gejala_terdeteksi
                      .map(
                        (gejala: string) =>
                          `<span class="gejala-tag">${gejala}</span>`
                      )
                      .join("")}
                  </div>
                  <p style="margin-top: 10px;"><strong>Solusi:</strong> ${
                    diagnosisData.hasil_diagnosis.solusi
                  }</p>
                </div>
              </div>
  
              ${
                diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain &&
                diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                  0
                  ? `<div class="section">
                      <div class="section-title">Kemungkinan Penyakit Lain</div>
                      <div class="content-box">
                        ${diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain
                          .map(
                            (penyakit: any) => `
                            <div style="margin-bottom: 15px;">
                              <p><strong>Penyakit:</strong> ${
                                penyakit.penyakit
                              }</p>
                              <p><strong>Gejala:</strong> ${penyakit.gejala_terdeteksi.join(
                                ", "
                              )}</p>
                              <p><strong>Solusi:</strong> ${penyakit.solusi}</p>
                            </div>
                          `
                          )
                          .join("")}
                      </div>
                    </div>`
                  : ""
              }
  
              <div class="section">
                <div class="section-title">Tanggal Diagnosis</div>
                <div class="content-box">
                  ${new Date(diagnosisData.tanggal_diagnosis).toLocaleString(
                    "id-ID",
                    { dateStyle: "full", timeStyle: "short" }
                  )}
                WIB</div>
              </div>
  
              <div class="footer">
                <p>Sistem Pakar Kucing - "Analisis Cerdas untuk Sahabat Berbulu Anda"</p>
              </div>
            </div>
  
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = window.close;
              };
            </script>
          </body>
        </html>
      `);
    printWindow.document.close();
  }
};

export default PrintSingleDiagnosis;
