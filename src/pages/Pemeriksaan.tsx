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
}

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

  // 🔹 Ambil data pasien dari localStorage (pasien yang baru daftar)
  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    setWaitingPatients(patients);
  }, []);

  // 🔹 Handle simpan hasil pemeriksaan
  const handleSaveDiagnosis = () => {
    if (!selectedPatient) return;

    const dataPemeriksaan = {
      ...diagnosis,
      id: selectedPatient.id,
      waktu: new Date().toLocaleString(),
    };

    // Simpan ke localStorage
    const existingData = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
    const updatedData = [...existingData, dataPemeriksaan];
    localStorage.setItem("pemeriksaan", JSON.stringify(updatedData));

    // Hapus pasien dari daftar antrian
    const remainingPatients = waitingPatients.filter(
      (p) => p.id !== selectedPatient.id
    );
    setWaitingPatients(remainingPatients);
    localStorage.setItem("patients", JSON.stringify(remainingPatients));

    toast.success(
      `Pemeriksaan ${selectedPatient.nama} berhasil disimpan dan dikirim ke apotek`
    );

    // Reset
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
            {/* 🔹 Daftar Pasien Menunggu */}
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
                    {/* Data Pasien */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="grid gap-3 md:grid-cols-3">
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
                      </div>
                    </div>

                    {/* Form Diagnosis */}
                    <div className="space-y-4">
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
                          <Label>Suhu Tubuh (°C)</Label>
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
                          <Label>Berat Badan (kg)</Label>
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

                      <div className="space-y-2">
                        <Label>Resep Obat</Label>
                        <Textarea
                          placeholder={`Contoh:\n1. Paracetamol 500mg - 3x1 sehari\n2. Amoxicillin 500mg - 3x1 sehari`}
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

                      <div className="space-y-2">
                        <Label>Catatan Tambahan</Label>
                        <Textarea
                          placeholder="Catatan untuk pasien atau apoteker..."
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