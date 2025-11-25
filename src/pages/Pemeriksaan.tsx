import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Send } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  nama: string;
  antrian: string;
  keluhan: string;
  umur: number;
}

interface Diagnosis {
  id: string;
  tekananDarah: string;
  suhu: string;
  berat: string;
  diagnosis: string;
  resep: string;
  catatan: string;
  waktu: string;
  // optional dokter property when saved
  dokter?: string;
}

// 🔹 Daftar obat TANPA aturan otomatis
const OBAT_LIST = [
  { nama: "Paracetamol 500mg(150 tablet)" },
  { nama: "Amoxicillin 500mg(75 tablet)" },
  { nama: "Ibuprofen 400mg(100 tablet)" },
  { nama: "CTM 4mg(145 tablet)" },
  { nama: "Antasida Syrup(130 botol)" },
];

// 🔥 DOKTER BERTUGAS (baru)
const DOKTER_LIST = [
  "Dr. Andi Wijaya,Sp.PD",
  "Dr. Budi Santoso,Sp.A",
  "Dr. Siti Rahmawati,Sp.THT-KL",
  "Dr. Made Wirawan,Sp.M",
];

const Pemeriksaan = () => {
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [diagnosis, setDiagnosis] = useState<Diagnosis>({
    id: "",
    tekananDarah: "",
    suhu: "",
    berat: "",
    diagnosis: "",
    resep: "",
    catatan: "",
    waktu: "",
  });

  // 🔹 State untuk input obat
  const [selectedObat, setSelectedObat] = useState("");
  const [jumlahObat, setJumlahObat] = useState("");
  const [aturanPakai, setAturanPakai] = useState("");

  // 🔥 Dokter yang sedang bertugas
  const [dokterBertugas, setDokterBertugas] = useState(DOKTER_LIST[0]);

  // Ambil patients dan (opsional) pemeriksaan dari localStorage
  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    setWaitingPatients(patients);

    // Jika ada pemeriksaan sebelumnya, bisa juga digunakan (tidak wajib)
    // const pemeriksaan = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
  }, []);

  // Tambah obat ke resep textarea
  const handleAddObat = () => {
    if (!selectedObat) {
      toast.error("Pilih obat terlebih dahulu");
      return;
    }

    const line =
      `${selectedObat}` +
      (jumlahObat ? ` — ${jumlahObat}` : "") +
      (aturanPakai ? ` — ${aturanPakai}` : "");

    setDiagnosis((prev) => ({
      ...prev,
      resep: prev.resep ? prev.resep + `\n${line}` : line,
    }));

    // reset input
    setSelectedObat("");
    setJumlahObat("");
    setAturanPakai("");
  };

  // Hapus seluruh resep (opsional helper)
  const handleClearResep = () => {
    setDiagnosis((prev) => ({ ...prev, resep: "" }));
  };

  // Simpan pemeriksaan
  const handleSaveDiagnosis = () => {
    if (!selectedPatient) {
      toast.error("Pilih pasien terlebih dahulu");
      return;
    }

    // minimal validation: diagnosis atau resep boleh kosong tapi kita simpan
    const dataPemeriksaan = {
      ...diagnosis,
      id: selectedPatient.id,
      waktu: new Date().toLocaleString(),
      dokter: dokterBertugas,
    };

    const existingData = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
    const updatedData = [...existingData, dataPemeriksaan];
    localStorage.setItem("pemeriksaan", JSON.stringify(updatedData));

    const remainingPatients = waitingPatients.filter(
      (p) => p.id !== selectedPatient.id
    );
    setWaitingPatients(remainingPatients);
    localStorage.setItem("patients", JSON.stringify(remainingPatients));

    toast.success(
      `Pemeriksaan ${selectedPatient.nama} berhasil disimpan oleh ${dokterBertugas}`
    );

    // reset selected patient & form
    setSelectedPatient(null);
    setDiagnosis({
      id: "",
      tekananDarah: "",
      suhu: "",
      berat: "",
      diagnosis: "",
      resep: "",
      catatan: "",
      waktu: "",
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="dokter" />

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Pemeriksaan Pasien"
            description="Lakukan pemeriksaan dan buat resep obat"
            icon={Stethoscope}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* 🔹 Daftar Pasien */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Antrian Pemeriksaan</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {waitingPatients.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Tidak ada pasien dalam antrian
                    </p>
                  ) : (
                    waitingPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setDiagnosis((prev) => ({ ...prev, id: patient.id }));
                        }}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                          selectedPatient?.id === patient.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium">{patient.nama}</p>
                            <Badge variant="outline">{patient.antrian}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {patient.keluhan}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {patient.umur} tahun • ID: {patient.id}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 🔹 Form Pemeriksaan */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedPatient
                    ? `Pemeriksaan - ${selectedPatient.nama}`
                    : "Pilih Pasien"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {selectedPatient ? (
                  <div className="space-y-6">
                    {/* DOKTER BERTUGAS */}
                    <div className="space-y-2">
                      <Label>Dokter Bertugas</Label>
                      <select
                        className="border rounded-lg p-2 w-full bg-white"
                        value={dokterBertugas}
                        onChange={(e) => setDokterBertugas(e.target.value)}
                      >
                        {DOKTER_LIST.map((nama, i) => (
                          <option key={i} value={nama}>
                            {nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Info pasien */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="grid gap-3 md:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            ID Pasien
                          </p>
                          <p className="font-medium">{selectedPatient.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Umur</p>
                          <p className="font-medium">
                            {selectedPatient.umur} tahun
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Keluhan Awal
                          </p>
                          <p className="font-medium">
                            {selectedPatient.keluhan}
                          </p>
                        </div>

                        {/* Tampilkan dokter */}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ditangani Oleh
                          </p>
                          <p className="font-medium text-blue-600">
                            {dokterBertugas}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input pemeriksaan */}
                    <div className="space-y-4">
                      {/* Tekanan Darah / Suhu / Berat */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Tekanan Darah</Label>
                          <Input
                            placeholder="120/80"
                            value={diagnosis.tekananDarah}
                            onChange={(e) =>
                              setDiagnosis({
                                ...diagnosis,
                                tekananDarah: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Suhu (°C)</Label>
                          <Input
                            placeholder="36.5"
                            type="number"
                            step="0.1"
                            value={diagnosis.suhu}
                            onChange={(e) =>
                              setDiagnosis({
                                ...diagnosis,
                                suhu: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Berat (kg)</Label>
                          <Input
                            placeholder="60"
                            type="number"
                            value={diagnosis.berat}
                            onChange={(e) =>
                              setDiagnosis({
                                ...diagnosis,
                                berat: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="space-y-2">
                        <Label>Diagnosis</Label>
                        <Textarea
                          placeholder="Masukkan diagnosis lengkap..."
                          rows={4}
                          value={diagnosis.diagnosis}
                          onChange={(e) =>
                            setDiagnosis({
                              ...diagnosis,
                              diagnosis: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* PILIH OBAT + INPUT JUMLAH + ATURAN (LAYOUT C) */}
                      <div className="space-y-3">
                        <Label>Pilih Obat</Label>

                        {/* Dropdown Obat */}
                        <select
                          className="border rounded-lg p-2 w-full bg-white"
                          value={selectedObat}
                          onChange={(e) => setSelectedObat(e.target.value)}
                        >
                          <option value="">-- Pilih obat --</option>
                          {OBAT_LIST.map((o, i) => (
                            <option key={i} value={o.nama}>
                              {o.nama}
                            </option>
                          ))}
                        </select>

                        {/* Input Jumlah */}
                        <div className="space-y-2">
                          <Label>Jumlah</Label>
                          <Input
                            placeholder="contoh: 10 tablet"
                            value={jumlahObat}
                            onChange={(e) => setJumlahObat(e.target.value)}
                          />
                        </div>

                        {/* Input Aturan Pakai */}
                        <div className="space-y-2">
                          <Label>Aturan Pakai</Label>
                          <Input
                            placeholder="contoh: 3x1 sehari"
                            value={aturanPakai}
                            onChange={(e) => setAturanPakai(e.target.value)}
                          />
                        </div>

                        {/* Tombol Tambah */}
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={handleAddObat}
                        >
                          Tambah Obat ke Resep
                        </Button>
                      </div>

                      {/* Resep */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Resep Obat</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              onClick={handleClearResep}
                              className="text-sm"
                            >
                              Hapus Resep
                            </Button>
                          </div>
                        </div>

                        <Textarea
                          rows={6}
                          value={diagnosis.resep}
                          onChange={(e) =>
                            setDiagnosis({
                              ...diagnosis,
                              resep: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Catatan */}
                      <div className="space-y-2">
                        <Label>Catatan Tambahan</Label>
                        <Textarea
                          rows={3}
                          value={diagnosis.catatan}
                          onChange={(e) =>
                            setDiagnosis({
                              ...diagnosis,
                              catatan: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleSaveDiagnosis} className="flex-1">
                          <Send className="mr-2 h-4 w-4" />
                          Simpan & Kirim ke Apotek
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setSelectedPatient(null)}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Pilih pasien dari antrian untuk memulai pemeriksaan
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pemeriksaan;