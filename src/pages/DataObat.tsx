import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Edit, Trash2, AlertTriangle } from "lucide-react";

interface Medicine {
  id: string;
  nama: string;
  kategori: string;
  stok: number;
  harga: number;
  satuan: string;
}

const DataObat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Popup state
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Pilihan obat default
  const daftarPilihanObat: Medicine[] = [
    { id: "OB001", nama: "Paracetamol 500mg", kategori: "Analgesik", stok: 0, harga: 3000, satuan: "Strip" },
    { id: "OB002", nama: "Amoxicillin 500mg", kategori: "Antibiotik", stok: 0, harga: 25000, satuan: "Strip" },
    { id: "OB003", nama: "Vitamin C 1000mg", kategori: "Vitamin", stok: 0, harga: 15000, satuan: "Botol" },
    { id: "OB004", nama: "Antasida", kategori: "Pencernaan", stok: 0, harga: 5000, satuan: "Strip" },
    { id: "OB005", nama: "OBH Combi", kategori: "Batuk & Flu", stok: 0, harga: 18000, satuan: "Botol" },
  ];

  // Load awal dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("medicines");
    if (stored) {
      setMedicines(JSON.parse(stored));
    } else {
      localStorage.setItem("medicines", JSON.stringify([]));
    }
  }, []);

  // Fungsi tambah obat dari pilihan dropdown
  const tambahObatBaru = () => {
    if (!selectedMedicine) return;

    const newMedicine = {
      ...selectedMedicine,
      stok: 20, // stok default
    };

    const updated = [...medicines, newMedicine];
    setMedicines(updated);
    localStorage.setItem("medicines", JSON.stringify(updated));

    setShowAdd(false);
    setSelectedMedicine(null);
  };

  // Badge status stok
  const getStockBadge = (stock: number) => {
    if (stock < 15) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" /> Menipis
        </Badge>
      );
    } else if (stock < 30) {
      return <Badge variant="outline">Terbatas</Badge>;
    }
    return <Badge className="bg-success">Aman</Badge>;
  };

  // Filter search
  const filtered = medicines.filter(
    (m) =>
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin" />

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Data Obat"
            description="Kelola stok dan harga obat"
            icon={Package}
            action={<Button onClick={() => setShowAdd(true)}>Tambah Obat</Button>}
          />

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari obat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-left text-sm font-semibold">Kode</th>
                      <th className="pb-3 text-left text-sm font-semibold">Nama</th>
                      <th className="pb-3 text-left text-sm font-semibold">Kategori</th>
                      <th className="pb-3 text-left text-sm font-semibold">Stok</th>
                      <th className="pb-3 text-left text-sm font-semibold">Status</th>
                      <th className="pb-3 text-left text-sm font-semibold">Harga</th>
                      <th className="pb-3 text-right text-sm font-semibold">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((medicine) => (
                      <tr key={medicine.id} className="border-b hover:bg-muted/50">
                        <td className="py-4">{medicine.id}</td>
                        <td className="py-4 font-medium">{medicine.nama}</td>
                        <td className="py-4 text-muted-foreground">{medicine.kategori}</td>
                        <td className="py-4">{medicine.stok} {medicine.satuan}</td>
                        <td className="py-4">{getStockBadge(medicine.stok)}</td>
                        <td className="py-4">Rp {medicine.harga.toLocaleString("id-ID")}</td>

                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* POPUP TAMBAH OBAT */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Tambah Obat</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Obat</label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedMedicine?.id || ""}
                  onChange={(e) => {
                    const obat = daftarPilihanObat.find((o) => o.id === e.target.value);
                    setSelectedMedicine(obat || null);
                  }}
                >
                  <option value="">-- Pilih Obat --</option>
                  {daftarPilihanObat.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nama} ({o.kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAdd(false)}>
                  Batal
                </Button>

                <Button onClick={tambahObatBaru} disabled={!selectedMedicine}>
                  Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataObat;
