import { useState } from "react";
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

const Pemeriksaan = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const waitingPatients = [
    { id: "P001", nama: "Ahmad Subandi", antrian: "A-01", keluhan: "Demam dan batuk", umur: 35 },
    { id: "P002", nama: "Siti Rahmawati", antrian: "A-02", keluhan: "Sakit kepala", umur: 28 },
    { id: "P003", nama: "Dewi Kusuma", antrian: "A-04", keluhan: "Flu", umur: 42 },
  ];

  const handleSaveDiagnosis = () => {
    toast.success("Pemeriksaan berhasil disimpan dan dikirim ke apotek");
    setSelectedPatient(null);
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
            {/* Daftar Pasien Menunggu */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Antrian Pemeriksaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {waitingPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                        selectedPatient?.id === patient.id ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="font-medium">{patient.nama}</p>
                          <Badge variant="outline">{patient.antrian}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.keluhan}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.umur} tahun • ID: {patient.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Form Pemeriksaan */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedPatient ? `Pemeriksaan - ${selectedPatient.nama}` : "Pilih Pasien"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPatient ? (
                  <div className="space-y-6">
                    {/* Data Pasien */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">ID Pasien</p>
                          <p className="font-medium">{selectedPatient.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Umur</p>
                          <p className="font-medium">{selectedPatient.umur} tahun</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Keluhan Awal</p>
                          <p className="font-medium">{selectedPatient.keluhan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Diagnosis */}
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Tekanan Darah</Label>
                          <Input placeholder="120/80" />
                        </div>
                        <div className="space-y-2">
                          <Label>Suhu Tubuh (°C)</Label>
                          <Input placeholder="36.5" type="number" step="0.1" />
                        </div>
                        <div className="space-y-2">
                          <Label>Berat Badan (kg)</Label>
                          <Input placeholder="60" type="number" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Diagnosis</Label>
                        <Textarea
                          placeholder="Masukkan diagnosis lengkap..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Resep Obat</Label>
                        <Textarea
                          placeholder="Contoh:&#10;1. Paracetamol 500mg - 3x1 sehari&#10;2. Amoxicillin 500mg - 3x1 sehari&#10;3. Vitamin C 1000mg - 1x1 sehari"
                          rows={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Catatan Tambahan</Label>
                        <Textarea
                          placeholder="Catatan untuk pasien atau apoteker..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleSaveDiagnosis} className="flex-1">
                          <Send className="mr-2 h-4 w-4" />
                          Simpan & Kirim ke Apotek
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedPatient(null)}>
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
