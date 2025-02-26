import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import NavbarComponent from "../../components/user/NavbarComponent";
import LoadingModal from "../../components/user/LoadingModal";

const SistemPakarPage: React.FC = () => {
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  const [hasilDiagnosa, setHasilDiagnosa] = useState<any>([]);
  const [showOtherPenyakit, setShowOtherPenyakit] = useState<boolean>(false);

  // State untuk informasi kucing
  const [kucingData, setKucingData] = useState({
    nama: "",
    jenisKelamin: "",
    usia: "",
    warnaBulu: "",
  });

  // State untuk mengontrol apakah gejala dapat ditampilkan
  const [isGejalaVisible, setIsGejalaVisible] = useState<boolean>(false);

  // State untuk kontrol loading modal
  const [loading, setLoading] = useState<boolean>(false);
  // State untuk menunjukkan checklist setelah selesai
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/relasi");
        const data = response.data;

        const gejalaMap: any = {};
        const penyakitMap: any = {};

        data.forEach((item: any) => {
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
          penyakitMap[item.penyakit.kode_penyakit].gejala.push(
            item.gejala.kode_gejala
          );
        });

        setGejalaList(Object.values(gejalaMap));
        setPenyakitList(Object.values(penyakitMap));
      } catch (error) {
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

    let hasil: any = {};
    let totalBelief = 0;

    // 🔎 Hitung belief untuk setiap penyakit
    penyakitList.forEach((penyakit) => {
      let belief = 0;
      let gejalaCocok: string[] = [];

      penyakit.gejala.forEach((gejalaKode: string) => {
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

    const sortedResults = Object.entries(hasil).sort(
      (a, b) =>
        (b[1] as { belief: number }).belief -
        (a[1] as { belief: number }).belief
    );
    setHasilDiagnosa(sortedResults);

    // 🔀 Identifikasi semua penyakit dengan persentase tertinggi yang sama
    const highestBelief = (sortedResults[0][1] as { belief: number }).belief;
    const topDiagnoses = sortedResults.filter(
      ([_, value]) => (value as { belief: number }).belief === highestBelief
    );

    // 🔄 Format data untuk dikirim ke backend
    const mainDiagnosis = {
      penyakit: topDiagnoses[0][0],
      solusi: penyakitList.find((p) => p.nama === topDiagnoses[0][0])?.solusi,
      gejala_terdeteksi: (topDiagnoses[0][1] as { gejalaCocok: string[] })
        .gejalaCocok,
      kemungkinan_penyakit_lain: topDiagnoses.slice(1).map(([nama, data]) => ({
        penyakit: nama,
        solusi: penyakitList.find((p) => p.nama === nama)?.solusi,
        gejala_terdeteksi: (data as { gejalaCocok: string[] }).gejalaCocok,
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
      const response = await axiosInstance.post(
        "/diagnosis/tambah",
        diagnosisData
      );
      console.log("Diagnosis berhasil disimpan:", response.data.message);

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

  // Fungsi untuk mengecek apakah semua data kucing sudah terisi
  const checkIfGejalaVisible = () => {
    const { nama, jenisKelamin, usia, warnaBulu } = kucingData;
    if (nama && jenisKelamin && usia && warnaBulu) {
      setIsGejalaVisible(true); // Jika sudah lengkap, tampilkan pilihan gejala
    } else {
      setIsGejalaVisible(false); // Jika belum lengkap, sembunyikan pilihan gejala
    }
  };

  useEffect(() => {
    checkIfGejalaVisible();
  }, [kucingData]); // Memantau perubahan pada data kucing

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto pt-20 p-3">
        {/* ✅ Banner Tunggal */}
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

        {/* ✅ Form Data Kucing */}
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

        {/* ✅ Pilihan Gejala */}
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
                          prev.filter((gejala) => gejala !== value)
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

        {/* 📋 Hasil Diagnosa */}
        {hasilDiagnosa.length > 0 && (
          <div className="hasil-diagnosa bg-white p-8 rounded-2xl shadow-2xl mb-10">
            {/* 🏥 Hasil Diagnosa Utama */}
            <div className="bg-gradient-to-r from-[#4F81C7] to-[#3e6b99] text-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Diagnosa Utama: {hasilDiagnosa[0][0]}
              </h2>
              <div className="w-full bg-gray-300 rounded-full h-4 mt-4">
                <div
                  className="bg-green-400 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${hasilDiagnosa[0][1].belief.toFixed(2)}%` }}
                />
              </div>
              <p className="mt-2 text-sm">
                Keyakinan:{" "}
                <strong>{hasilDiagnosa[0][1].belief.toFixed(2)}%</strong>
              </p>
            </div>

            {/* 📜 Deskripsi & Solusi */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Deskripsi Penyakit
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {
                    penyakitList.find((p) => p.nama === hasilDiagnosa[0][0])
                      ?.deskripsi
                  }
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Solusi yang Disarankan
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {
                    penyakitList.find((p) => p.nama === hasilDiagnosa[0][0])
                      ?.solusi
                  }
                </p>
              </div>

              {/* 🏷️ Gejala Terdeteksi */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Gejala Terdeteksi
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hasilDiagnosa[0][1].gejalaCocok.map(
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

            {/* 🔽 Penyakit Lainnya */}
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
                    .map(([penyakitNama, { belief, gejalaCocok }], idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-6 shadow-lg bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-bold text-gray-700">
                            {penyakitNama}
                          </h3>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Keyakinan: <strong>{belief.toFixed(2)}%</strong>
                            </p>
                            <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                              <div
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${belief.toFixed(2)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                          <strong>Deskripsi:</strong>{" "}
                          {
                            penyakitList.find((p) => p.nama === penyakitNama)
                              ?.deskripsi
                          }
                        </p>
                        <p className="text-gray-600 mb-2">
                          <strong>Solusi:</strong>{" "}
                          {
                            penyakitList.find((p) => p.nama === penyakitNama)
                              ?.solusi
                          }
                        </p>
                        <p className="text-gray-600 mb-2">
                          <strong>Gejala Terdeteksi:</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {gejalaCocok.map((gejala: string, index: number) => (
                            <span
                              key={index}
                              className="bg-[#4F81C7] text-white px-3 py-1 rounded-full text-sm"
                            >
                              {gejala}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Loading Modal Component */}
      {loading && <LoadingModal />}
    </>
  );
};

export default SistemPakarPage;
