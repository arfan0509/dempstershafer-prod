/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { FaVirus, FaHeartbeat, FaUser, FaStethoscope } from "react-icons/fa";

const COLORS = [
  "#2C5DA0", // Biru Gelap
  "#4A8EDB", // Biru Muda
  "#F28C38", // Oranye Profesional
  "#3A945D", // Hijau Elegan
  "#D9534F", // Merah Lembut
  "#6C757D", // Abu-abu Netral
  "#9467bd", // Ungu (opsional)
  "#8c564b", // Coklat (opsional)
  "#bcbd22", // Zaitun (opsional)
  "#17becf", // Cyan (opsional)
];

const Dashboard: React.FC = () => {
  const [penyakitCount, setPenyakitCount] = useState(0);
  const [gejalaCount, setGejalaCount] = useState(0);
  const [pasienCount, setPasienCount] = useState(0);
  const [diagnosisCount, setDiagnosisCount] = useState(0);
  const [latestDiagnoses, setLatestDiagnoses] = useState<any[]>([]);
  const [topPenyakit, setTopPenyakit] = useState<any[]>([]);
  const [topGejala, setTopGejala] = useState<any[]>([]);

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
      if (!headers) return;

      const [penyakitRes, gejalaRes, pasienRes, diagnosisRes] =
        await Promise.all([
          axiosInstance.get("/penyakit", headers),
          axiosInstance.get("/gejala", headers),
          axiosInstance.get("/pasien/all", headers),
          axiosInstance.get("/diagnosis", headers),
        ]);

      setPenyakitCount(penyakitRes.data.length);
      setGejalaCount(gejalaRes.data.length);
      setPasienCount(pasienRes.data.length);
      setDiagnosisCount(diagnosisRes.data.length);
      setLatestDiagnoses(
        diagnosisRes.data
          .sort(
            (a: any, b: any) =>
              new Date(b.tanggal_diagnosis).getTime() -
              new Date(a.tanggal_diagnosis).getTime()
          )
          .slice(0, 5)
      );

      const penyakitFrequency: any = {};
      const gejalaFrequency: any = {};

      diagnosisRes.data.forEach((d: any) => {
        // Hitung frekuensi penyakit
        penyakitFrequency[d.hasil_diagnosis.penyakit] =
          (penyakitFrequency[d.hasil_diagnosis.penyakit] || 0) + 1;

        // Hitung frekuensi gejala
        d.hasil_diagnosis.gejala_terdeteksi.forEach((g: string) => {
          gejalaFrequency[g] = (gejalaFrequency[g] || 0) + 1;
        });
      });

      // Tampilkan SEMUA penyakit (tanpa .slice(0,5))
      setTopPenyakit(
        Object.entries(penyakitFrequency)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => (b.value as number) - (a.value as number))
      );

      // Untuk gejala, tetap ambil 5 terbanyak (sesuai kebutuhan)
      setTopGejala(
        Object.entries(gejalaFrequency)
          .map(([name, value]) => ({ name, value: value as number }))
          .sort((a, b) => (b.value as number) - (a.value as number))
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-2 min-h-screen">
      <h1 className="text-3xl font-bold text-[#4F81C7] mb-6">
        Dashboard Admin
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Penyakit",
            count: penyakitCount,
            icon: <FaVirus size={30} />,
          },
          {
            label: "Gejala",
            count: gejalaCount,
            icon: <FaHeartbeat size={30} />,
          },
          { label: "User", count: pasienCount, icon: <FaUser size={30} /> },
          {
            label: "Diagnosis",
            count: diagnosisCount,
            icon: <FaStethoscope size={30} />,
          },
        ].map(({ label, count, icon }) => (
          <div
            key={label}
            className="p-6 bg-[#4F81C7] text-white rounded-xl shadow-lg flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">Jumlah {label}</h3>
              <p className="text-3xl font-bold">{count}</p>
            </div>
            <div>{icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md shadow-lg p-6 mt-10 overflow-x-auto">
        <h3 className="text-2xl font-semibold text-[#4F81C7] mb-4">
          Diagnosis Terbaru
        </h3>
        <div className="w-full">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-[#4F81C7] text-white">
                <th className="p-3">Nama Pemilik</th>
                <th className="p-3">Nama Kucing</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Penyakit</th>
              </tr>
            </thead>
            <tbody>
              {latestDiagnoses.map((d, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-100">
                  <td className="p-3">{d.pasien?.nama || "-"}</td>
                  <td className="p-3">{d.nama_kucing || "-"}</td>
                  <td className="p-3">
                    {new Date(d.tanggal_diagnosis).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3">{d.hasil_diagnosis.penyakit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Penyakit Paling Umum */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-semibold text-[#4F81C7] mb-4">
            Penyakit Paling Umum
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topPenyakit}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#4F81C7"
                label
              >
                {topPenyakit.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom legend untuk penyakit */}
          <div className="mt-4 flex flex-wrap">
            {topPenyakit.map((entry, index) => (
              <div key={index} className="flex items-center mr-4">
                <div
                  className="w-4 h-4 mr-1"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gejala Paling Sering Muncul */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-semibold text-[#4F81C7] mb-4">
            Gejala Paling Sering Muncul
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topGejala}>
              <XAxis dataKey="name" hide={true} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value">
                {topGejala.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Custom legend untuk gejala */}
          <div className="mt-4 flex flex-wrap">
            {topGejala.map((entry, index) => (
              <div key={index} className="flex items-center mr-4">
                <div
                  className="w-4 h-4 mr-1"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
