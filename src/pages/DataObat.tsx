import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Edit, Trash2, AlertTriangle } from "lucide-react";

const DataObat = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const medicines = [
    { id: "OB001", nama: "Paracetamol 500mg", kategori: "Analgesik", stok: 150, harga: 3000, satuan: "Strip" },
    { id: "OB002", nama: "Amoxicillin 500mg", kategori: "Antibiotik", stok: 8, harga: 25000, satuan: "Strip" },
    { id: "OB003", nama: "Vitamin C 1000mg", kategori: "Vitamin", stok: 12, harga: 15000, satuan: "Botol" },
    { id: "OB004", nama: "Antasida", kategori: "Pencernaan", stok: 45, harga: 5000, satuan: "Strip" },
    { id: "OB005", nama: "OBH Combi", kategori: "Batuk & Flu", stok: 22, harga: 18000, satuan: "Botol" },
  ];

  const getStockBadge = (stock: number) => {
    if (stock < 15) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Menipis</Badge>;
    } else if (stock < 30) {
      return <Badge variant="outline">Terbatas</Badge>;
    }
    return <Badge className="bg-success">Aman</Badge>;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin" />
      
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Data Obat"
            description="Kelola stok dan harga obat"
            icon={Package}
            action={
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Tambah Obat
              </Button>
            }
          />

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Cari obat berdasarkan nama atau kategori..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">Filter Stok</Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-left text-sm font-semibold">Kode Obat</th>
                        <th className="pb-3 text-left text-sm font-semibold">Nama Obat</th>
                        <th className="pb-3 text-left text-sm font-semibold">Kategori</th>
                        <th className="pb-3 text-left text-sm font-semibold">Stok</th>
                        <th className="pb-3 text-left text-sm font-semibold">Status</th>
                        <th className="pb-3 text-left text-sm font-semibold">Harga</th>
                        <th className="pb-3 text-right text-sm font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((medicine) => (
                        <tr key={medicine.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="py-4 text-sm font-medium">{medicine.id}</td>
                          <td className="py-4 text-sm font-medium">{medicine.nama}</td>
                          <td className="py-4 text-sm text-muted-foreground">{medicine.kategori}</td>
                          <td className="py-4 text-sm">
                            {medicine.stok} {medicine.satuan}
                          </td>
                          <td className="py-4">
                            {getStockBadge(medicine.stok)}
                          </td>
                          <td className="py-4 text-sm font-medium">
                            Rp {medicine.harga.toLocaleString("id-ID")}
                          </td>
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

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Menampilkan 5 dari 5 obat</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                    <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DataObat;
