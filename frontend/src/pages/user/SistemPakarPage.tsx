/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import NavbarComponent from "../../components/user/NavbarComponent";
import LoadingModal from "../../components/user/LoadingModal";

// Fungsi pembulatan ke 4 desimal
const round4 = (num: number) => Math.round(num * 10000) / 10000;
// Fungsi untuk format angka tanpa trailing zero
const formatNumber = (num: number) => parseFloat(num.toFixed(4)).toString();

const SistemPakarPage: React.FC = () => {
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  // Hasil diagnosa: { penyakit, belief, gejalaCocok, deskripsi, solusi }
  const [hasilDiagnosa, setHasilDiagnosa] = useState<any[]>([]);
  const [showOtherPenyakit, setShowOtherPenyakit] = useState<boolean>(false);
  const [kucingData, setKucingData] = useState({
    nama: "",
    jenisKelamin: "",
    usia: "",
    warnaBulu: "",
  });
  const [isGejalaVisible, setIsGejalaVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [calcSteps, setCalcSteps] = useState<string>("");
  const [showCalcSteps, setShowCalcSteps] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/relasi");
        const data = response.data;
        const gejalaMap: any = {};
        const penyakitMap: any = {};

        data.forEach((item: any) => {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fungsi kombinasi dua fungsi massa dengan aturan Dempster-Shafer (dengan pembulatan)
  const combineMassFunctions = (
    m1: { [key: string]: number },
    m2: { [key: string]: number },
    frame: string[]
  ): { [key: string]: number } => {
    const fullFrameKey = frame.sort().join(",");
    let m_comb: { [key: string]: number } = {};
    let K = 0; // total konflik

    for (let key1 in m1) {
      for (let key2 in m2) {
        const set1 =
          key1 === fullFrameKey ? new Set(frame) : new Set(key1.split(","));
        const set2 =
          key2 === fullFrameKey ? new Set(frame) : new Set(key2.split(","));
        const intersection = new Set([...set1].filter((x) => set2.has(x)));
        const product = round4(m1[key1] * m2[key2]);
        if (intersection.size === 0) {
          K = round4(K + product);
        } else {
          const intersectionKey = [...intersection].sort().join(",");
          m_comb[intersectionKey] = round4(
            (m_comb[intersectionKey] || 0) + product
          );
        }
      }
    }
    const normalization = round4(1 - K);
    if (normalization === 0) return {};
    for (let key in m_comb) {
      m_comb[key] = round4(m_comb[key] / normalization);
    }
    return m_comb;
  };

  // Fungsi untuk mendapatkan daftar nama gejala yang mendukung suatu penyakit
  const getMatchingSymptoms = (disease: string): string[] => {
    return selectedGejala
      .map((kode) => {
        const g = gejalaList.find((gejala) => gejala.kode === kode);
        if (!g) return null;
        const relatedPenyakit = penyakitList.filter((p) =>
          p.gejala.some((relasi: any) => relasi.kode_gejala === g.kode)
        );
        const names = relatedPenyakit.map((p) => p.nama);
        return names.includes(disease) ? g.nama : null;
      })
      .filter((item) => item !== null) as string[];
  };

  // Fungsi utama perhitungan DS tanpa distribusi tambahan untuk himpunan komposit
  const handleDiagnosa = async () => {
    if (selectedGejala.length === 0) {
      alert("Silakan pilih setidaknya satu gejala!");
      return;
    }

    let steps = "";

    // Batasi frame hanya pada penyakit relevan dari gejala yang dipilih
    const gejalaToPenyakitMap: {
      [key: string]: { penyakit: string; bobot: number }[];
    } = {};
    penyakitList.forEach((p) => {
      p.gejala.forEach((relasi: any) => {
        const { kode_gejala, bobot } = relasi;
        if (!gejalaToPenyakitMap[kode_gejala]) {
          gejalaToPenyakitMap[kode_gejala] = [];
        }
        gejalaToPenyakitMap[kode_gejala].push({ penyakit: p.nama, bobot });
      });
    });
    const relevantDiseases = new Set<string>();
    selectedGejala.forEach((gejalaCode) => {
      const rel = gejalaToPenyakitMap[gejalaCode] || [];
      rel.forEach(({ penyakit }) => relevantDiseases.add(penyakit));
    });
    const frame = Array.from(relevantDiseases).sort();
    const fullFrameKey = frame.join(",");
    steps += `Frame (Θ): [${frame.join(", ")}]\n\n`;
    let m_comb: { [key: string]: number } = { [fullFrameKey]: 1 };
    steps += `Inisialisasi m(Θ) = { "${fullFrameKey}": 1 }\n\n`;

    // Proses perhitungan massa untuk setiap gejala yang dipilih
    selectedGejala.forEach((gejalaCode) => {
      const relasiGejala = gejalaToPenyakitMap[gejalaCode] || [];
      if (relasiGejala.length === 0) return;

      const m_gejala: { [key: string]: number } = {};
      const totalBobot = round4(
        relasiGejala.reduce((sum, item) => sum + item.bobot, 0)
      );
      // Confidence diambil sebagai nilai bobot maksimum dari relasi
      const confidence = Math.max(...relasiGejala.map((item) => item.bobot));
      steps += `\nGejala ${gejalaCode} (${
        gejalaList.find((g) => g.kode === gejalaCode)?.nama || "Tidak diketahui"
      }):\n`;
      relasiGejala.forEach(({ penyakit, bobot }) => {
        steps += `   Bobot untuk ${penyakit}: ${formatNumber(bobot)}\n`;
      });
      steps += `   Confidence = ${formatNumber(confidence)}\n`;
      steps += `   Total bobot = ${formatNumber(totalBobot)}\n`;
      relasiGejala.forEach(({ penyakit, bobot }) => {
        const frac = round4(bobot / totalBobot);
        const m_val = round4(confidence * frac);
        steps += `      m(${gejalaCode}){${penyakit}} = ${formatNumber(
          confidence
        )} x (${formatNumber(bobot)}/${formatNumber(
          totalBobot
        )}) = ${formatNumber(m_val)}\n`;
        m_gejala[penyakit] = m_val;
      });
      const mTheta = round4(1 - confidence);
      m_gejala[fullFrameKey] = mTheta;
      steps += `      m(${gejalaCode})(Θ) = 1 - ${formatNumber(
        confidence
      )} = ${formatNumber(mTheta)}\n\n`;
      steps += `   m(${gejalaCode}) = ${JSON.stringify(m_gejala)}\n\n`;
      m_comb = combineMassFunctions(m_comb, m_gejala, frame);
      steps += `   m_comb setelah kombinasi dengan ${gejalaCode}: ${JSON.stringify(
        m_comb
      )}\n\n`;
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
        const penyakitObj = penyakitList.find(
          (p) => p.nama === diseases[0]
        ) || {
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
    steps += `Final results (tanpa distribusi tambahan): ${JSON.stringify(
      finalResults
    )}\n`;

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
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      alert("Gagal menyimpan diagnosis.");
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setKucingData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto pt-20 p-3">
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg mb-6">
          <img
            src={`/assets/banner-pakar.jpg`}
            alt="Banner Pakar"
            className="w-full object-cover h-40 sm:h-64 md:h-80 lg:h-[550px] transition duration-500"
          />
        </div>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Selamat datang di <strong>Sistem Pakar Kucing!</strong> Pilih gejala
          yang sesuai untuk mendiagnosis masalah kesehatan pada kucing Anda.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Nama Kucing</label>
              <input
                type="text"
                name="nama"
                value={kucingData.nama}
                onChange={handleInputChange}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                placeholder="Nama Kucing"
              />
            </div>
            <div>
              <label className="block text-gray-700">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={kucingData.jenisKelamin}
                onChange={handleSelectChange}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Usia</label>
              <input
                type="text"
                name="usia"
                value={kucingData.usia}
                onChange={handleInputChange}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                placeholder="contoh: 3 bulan/1 tahun"
              />
            </div>
            <div>
              <label className="block text-gray-700">Warna Bulu</label>
              <input
                type="text"
                name="warnaBulu"
                value={kucingData.warnaBulu}
                onChange={handleInputChange}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                placeholder="Warna Bulu Kucing"
              />
            </div>
          </div>
        </form>
        {isGejalaVisible && (
          <form onSubmit={(e) => e.preventDefault()} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gejalaList.map((gejala, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={gejala.kode}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      if (checked) {
                        setSelectedGejala((prev) => [...prev, value]);
                      } else {
                        setSelectedGejala((prev) =>
                          prev.filter((g) => g !== value)
                        );
                      }
                    }}
                    className="w-5 h-5 rounded-full text-[#4F81C7] focus:ring-[#4F81C7]"
                  />
                  <span className="ml-3 text-gray-700 text-sm">
                    {gejala.kode} - {gejala.nama}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleDiagnosa}
              className="w-full py-3 mt-6 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300"
            >
              Diagnosa
            </button>
          </form>
        )}
        {hasilDiagnosa.length > 0 && (
          <div className="hasil-diagnosa bg-white p-8 rounded-2xl shadow-2xl mb-10">
            <div className="bg-gradient-to-r from-[#4F81C7] to-[#3e6b99] text-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Diagnosa Utama: {hasilDiagnosa[0].penyakit}
              </h2>
              <div className="w-full bg-gray-300 rounded-full h-4 mt-4">
                <div
                  className="bg-green-400 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${formatNumber(hasilDiagnosa[0].belief)}%` }}
                />
              </div>
              <p className="mt-2 text-sm">
                Keyakinan:{" "}
                <strong>{formatNumber(hasilDiagnosa[0].belief)}%</strong>
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Deskripsi Penyakit
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {hasilDiagnosa[0].deskripsi}
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Solusi yang Disarankan
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {hasilDiagnosa[0].solusi}
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Gejala Terdeteksi
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hasilDiagnosa[0].gejalaCocok.map(
                    (gejala: string, index: number) => (
                      <span
                        key={index}
                        className="bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm shadow-sm"
                      >
                        {gejala}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
            {hasilDiagnosa.length > 1 && (
              <div className="mt-10">
                <button
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-semibold text-[#4F81C7] transition duration-300"
                  onClick={() => setShowOtherPenyakit(!showOtherPenyakit)}
                >
                  {showOtherPenyakit
                    ? "🔼 Sembunyikan Penyakit Lainnya"
                    : "🔽 Tampilkan Penyakit Lainnya"}
                </button>
                {showOtherPenyakit && (
                  <div className="grid gap-6 mt-6">
                    {hasilDiagnosa
                      .slice(1)
                      .map(
                        (
                          { penyakit, belief, gejalaCocok, deskripsi, solusi },
                          idx: number
                        ) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-6 shadow-lg bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-xl font-bold text-gray-700">
                                {penyakit}
                              </h3>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  Keyakinan:{" "}
                                  <strong>{formatNumber(belief)}%</strong>
                                </p>
                                <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${formatNumber(belief)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">
                              <strong>Deskripsi:</strong> {deskripsi}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <strong>Solusi:</strong> {solusi}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <strong>Gejala Terdeteksi:</strong>
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {gejalaCocok.map(
                                (gejala: string, index: number) => (
                                  <span
                                    key={index}
                                    className="bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm"
                                  >
                                    {gejala}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                )}
              </div>
            )}
            <div className="mt-10">
              <button
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center font-semibold text-[#4F81C7] transition duration-300"
                onClick={() => setShowCalcSteps(!showCalcSteps)}
              >
                {showCalcSteps
                  ? "🔼 Sembunyikan Langkah Perhitungan"
                  : "🔽 Tampilkan Langkah Perhitungan"}
              </button>
              {showCalcSteps && (
                <div className="mt-4 p-4 border-t border-gray-300">
                  <h3 className="text-xl font-bold mb-2">
                    Langkah Perhitungan:
                  </h3>
                  <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                    {calcSteps}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {loading && <LoadingModal />}
    </>
  );
};

export default SistemPakarPage;
