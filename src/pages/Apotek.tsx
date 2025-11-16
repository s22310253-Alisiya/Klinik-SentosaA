import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PemeriksaanData {
  id: string;
  tekananDarah: string;
  suhu: string;
  berat: string;
  diagnosis: string;
  resep: string;
  catatan: string;
  waktu: string;
}

const Apotek = () => {
  const [resepList, setResepList] = useState<PemeriksaanData[]>([]);
  const [selectedResep, setSelectedResep] = useState<PemeriksaanData | null>(
    null
  );

  // 🔹 Ambil data pemeriksaan dari localStorage
  useEffect(() => {
    const pemeriksaan = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
    setResepList(pemeriksaan);
  }, []);

  // 🔹 Tandai resep sudah selesai
  const handleComplete = (id: string) => {
    const selesaiResep = resepList.find((r) => r.id === id);
    if (!selesaiResep) return;

    // Simpan ke riwayat
    const riwayat = JSON.parse(localStorage.getItem("riwayat") || "[]");
    const updatedRiwayat = [...riwayat, selesaiResep];
    localStorage.setItem("riwayat", JSON.stringify(updatedRiwayat));

    // Hapus dari resep aktif
    const updatedList = resepList.filter((r) => r.id !== id);
    setResepList(updatedList);
    localStorage.setItem("pemeriksaan", JSON.stringify(updatedList));
    // Kurangi stok obat berdasarkan resep (jika ditemukan di inventaris)
    try {
      const storedMeds = JSON.parse(localStorage.getItem("medicines") || "[]");
      if (storedMeds && storedMeds.length > 0 && selesaiResep.resep) {
        const lines = selesaiResep.resep.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l.length);
        const meds = [...storedMeds];
        lines.forEach((line: string) => {
          // Hapus nomor urut di awal dan ambil bagian nama sebelum tanda '-' jika ada
          const withoutNumber = line.replace(/^\d+\.\s*/, "");
          const parts = withoutNumber.split("-");
          const namePart = parts[0].trim().toLowerCase();

          // Cari obat yang cocok dengan namePart (cocok jika nama obat mengandung namePart atau sebaliknya)
          const idx = meds.findIndex((m: any) => m.nama.toLowerCase().includes(namePart) || namePart.includes(m.nama.toLowerCase()));
          if (idx !== -1) {
            // Kurangi 1 unit sebagai default
            meds[idx].stok = Math.max(0, meds[idx].stok - 1);
          } else {
            // Jika tidak ditemukan, coba cari kata pertama (mis. 'paracetamol')
            const firstToken = namePart.split(/\s+/)[0];
            const idx2 = meds.findIndex((m: any) => m.nama.toLowerCase().includes(firstToken));
            if (idx2 !== -1) {
              meds[idx2].stok = Math.max(0, meds[idx2].stok - 1);
            } else {
              // Tidak ditemukan, beri tahu di console (jangan spam toast untuk tiap item)
              console.warn(`Obat dalam resep tidak ditemukan di inventaris: ${namePart}`);
            }
          }
        });

        // Simpan perubahan ke localStorage
        localStorage.setItem("medicines", JSON.stringify(meds));
      }
    } catch (err) {
      console.error("Gagal memperbarui stok obat:", err);
    }

    toast.success(`Resep untuk ${selesaiResep.id} selesai diproses`);
    setSelectedResep(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar  />

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Apotek"
            description="Lihat dan proses resep dari dokter"
            icon={ClipboardList}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* 🔹 Daftar Resep Masuk */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Resep Masuk</CardTitle>
              </CardHeader>
              <CardContent>
                {resepList.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Belum ada resep masuk
                  </p>
                ) : (
                  <div className="space-y-3">
                    {resepList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedResep(item)}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                          selectedResep?.id === item.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Pasien {item.id}</p>
                          <Badge variant="outline">
                            {new Date(item.waktu).toLocaleTimeString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.diagnosis}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 🔹 Detail Resep */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedResep
                    ? `Detail Resep - Pasien ${selectedResep.id}`
                    : "Pilih Resep"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedResep ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          ID Pasien
                        </p>
                        <p className="font-medium">{selectedResep.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Suhu Tubuh
                        </p>
                        <p className="font-medium">{selectedResep.suhu} °C</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tekanan Darah
                        </p>
                        <p className="font-medium">
                          {selectedResep.tekananDarah}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Diagnosis</p>
                      <p className="font-medium whitespace-pre-line">
                        {selectedResep.diagnosis}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Resep</p>
                      <div className="rounded-lg bg-muted/50 p-4 whitespace-pre-line">
                        {selectedResep.resep}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Catatan Tambahan
                      </p>
                      <p className="text-sm">{selectedResep.catatan || "-"}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleComplete(selectedResep.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Tandai Selesai
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedResep(null)}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Pilih resep dari daftar untuk melihat detail
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

export default Apotek;