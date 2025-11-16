import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

interface Pembayaran {
  id: string;
  namaPasien: string;
  total: number;
  tanggal: string;
}

const Pembayaran = () => {
  const [resepList, setResepList] = useState<PemeriksaanData[]>([]);
  const [selectedResep, setSelectedResep] = useState<PemeriksaanData | null>(
    null
  );
  const [openPopup, setOpenPopup] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [paymentItems, setPaymentItems] = useState<Array<{name: string; qty: number; price: number; subtotal: number}>>([]);

  // 🔹 Ambil data resep dari localStorage (data dari Apotek)
  useEffect(() => {
    const pemeriksaan = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
    setResepList(pemeriksaan);
  }, []);

  // 🔹 Buka popup pembayaran
  const handleOpenPayment = (item: PemeriksaanData) => {
    setSelectedResep(item);

    // Hitung total otomatis berdasarkan resep dan data obat di localStorage
      try {
      const storedMeds = JSON.parse(localStorage.getItem("medicines") || "[]");
      let computedTotal = 0;
      const items: Array<{name: string; qty: number; price: number; subtotal: number}> = [];

      if (item.resep && storedMeds && storedMeds.length > 0) {
        const lines = item.resep
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length);

        lines.forEach((line) => {
          const withoutNumber = line.replace(/^\d+\.\s*/, "");
          const parts = withoutNumber.split("-");
          const namePart = parts[0].trim().toLowerCase();

          let qty = 1;
          const afterDash = parts.slice(1).join("-");
          const qtyMatch1 = afterDash.match(/(\d+)\s*x\s*\d*/i) || withoutNumber.match(/(\d+)\s*x\s*\d*/i);
          const qtyMatch2 = afterDash.match(/x\s*(\d+)/i) || withoutNumber.match(/x\s*(\d+)/i);
          const qtyMatch3 = afterDash.match(/(\d+)\s*(strip|botol|tablet|tabs|kapsul|pcs)/i) || withoutNumber.match(/(\d+)\s*(strip|botol|tablet|tabs|kapsul|pcs)/i);

          if (qtyMatch1) qty = parseInt(qtyMatch1[1], 10);
          else if (qtyMatch2) qty = parseInt(qtyMatch2[1], 10);
          else if (qtyMatch3) qty = parseInt(qtyMatch3[1], 10);

          const idx = storedMeds.findIndex((m: any) => m.nama.toLowerCase().includes(namePart) || namePart.includes(m.nama.toLowerCase()));
          let matchedName = namePart;
          let price = 0;

          if (idx !== -1) {
            const med = storedMeds[idx];
            price = typeof med.harga === "number" ? med.harga : Number(med.harga || 0);
            matchedName = med.nama;
          } else {
            const firstToken = namePart.split(/\s+/)[0];
            const idx2 = storedMeds.findIndex((m: any) => m.nama.toLowerCase().includes(firstToken));
            if (idx2 !== -1) {
              const med = storedMeds[idx2];
              price = typeof med.harga === "number" ? med.harga : Number(med.harga || 0);
              matchedName = med.nama;
            } else {
              console.warn(`Obat pada resep tidak ditemukan: ${namePart}`);
            }
          }

          const subtotal = price * qty;
          computedTotal += subtotal;
          items.push({ name: matchedName, qty, price, subtotal });
        });
      }

      setPaymentItems(items);
      setTotal(computedTotal);
    } catch (err) {
      console.error("Gagal menghitung total dari resep:", err);
      setPaymentItems([]);
      setTotal(0);
    }

    setOpenPopup(true);
  };

  // 🔹 Simpan pembayaran ke localStorage
  const handlePayment = () => {
    if (!selectedResep) return;

    const pembayaranBaru: Pembayaran = {
      id: selectedResep.id,
      namaPasien: `Pasien ${selectedResep.id}`,
      total,
      tanggal: new Date().toLocaleString(),
    };

    const riwayatPembayaran = JSON.parse(
      localStorage.getItem("riwayatPembayaran") || "[]"
    );
    const updatedRiwayat = [...riwayatPembayaran, pembayaranBaru];

    localStorage.setItem("riwayatPembayaran", JSON.stringify(updatedRiwayat));

    toast.success(`Pembayaran pasien ${selectedResep.id} berhasil!`);
    setOpenPopup(false);
    setSelectedResep(null);
    setTotal(0);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Pembayaran"
            description="Lakukan pembayaran untuk pasien yang sudah memiliki resep"
            icon={CreditCard}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* 🔹 Daftar Pasien */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daftar Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {resepList.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Belum ada pasien dengan resep
                  </p>
                ) : (
                  <div className="space-y-3">
                    {resepList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenPayment(item)}
                        className="cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md"
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

            {/* 🔹 Info Pembayaran */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedResep ? (
                  <div className="space-y-4">
                    <p>
                      <strong>ID Pasien:</strong> {selectedResep.id}
                    </p>
                    <p>
                      <strong>Diagnosis:</strong> {selectedResep.diagnosis}
                    </p>
                    <p>
                      <strong>Resep:</strong> {selectedResep.resep}
                    </p>

                    <Button
                      className="w-full"
                      onClick={() => handleOpenPayment(selectedResep)}
                    >
                      Bayar Sekarang
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Pilih pasien untuk memproses pembayaran
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 🔹 Popup Pembayaran */}
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pembayaran Pasien {selectedResep?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            <p>Rincian obat dan total pembayaran (otomatis):</p>
            {paymentItems.length > 0 ? (
              <div className="space-y-2">
                {paymentItems.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>{it.name} x{it.qty}</div>
                    <div>Rp {it.subtotal.toLocaleString("id-ID")}</div>
                  </div>
                ))}
                <div className="flex justify-between font-medium pt-2 border-t">
                  <div>Total</div>
                  <div>Rp {total.toLocaleString("id-ID")}</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tidak ada rincian obat yang dikenali; total akan 0.</p>
            )}
            <Input type="number" value={total} readOnly />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handlePayment} disabled={total <= 0}>
              Selesaikan Pembayaran
            </Button>
            <Button variant="outline" onClick={() => setOpenPopup(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pembayaran;