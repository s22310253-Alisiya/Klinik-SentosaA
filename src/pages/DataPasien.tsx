import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Eye, Edit, Trash2 } from "lucide-react";

const DataPasien = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    { id: "P001", nama: "Ahmad Subandi", umur: 35, jenisKelamin: "L", noTelp: "081234567890", terakhirKunjungan: "2024-01-15" },
    { id: "P002", nama: "Siti Rahmawati", umur: 28, jenisKelamin: "P", noTelp: "081298765432", terakhirKunjungan: "2024-01-15" },
    { id: "P003", nama: "Budi Santoso", umur: 42, jenisKelamin: "L", noTelp: "081334455667", terakhirKunjungan: "2024-01-14" },
    { id: "P004", nama: "Dewi Kusuma", umur: 31, jenisKelamin: "P", noTelp: "081223344556", terakhirKunjungan: "2024-01-15" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin" />
      
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Data Pasien"
            description="Kelola data pasien klinik"
            icon={Users}
            action={
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Tambah Pasien
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
                      placeholder="Cari berdasarkan nama atau ID pasien..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">Filter Tanggal</Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-left text-sm font-semibold">ID Pasien</th>
                        <th className="pb-3 text-left text-sm font-semibold">Nama</th>
                        <th className="pb-3 text-left text-sm font-semibold">Umur</th>
                        <th className="pb-3 text-left text-sm font-semibold">Jenis Kelamin</th>
                        <th className="pb-3 text-left text-sm font-semibold">No. Telepon</th>
                        <th className="pb-3 text-left text-sm font-semibold">Terakhir Kunjungan</th>
                        <th className="pb-3 text-right text-sm font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="py-4 text-sm font-medium">{patient.id}</td>
                          <td className="py-4 text-sm">{patient.nama}</td>
                          <td className="py-4 text-sm">{patient.umur}</td>
                          <td className="py-4 text-sm">{patient.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</td>
                          <td className="py-4 text-sm">{patient.noTelp}</td>
                          <td className="py-4 text-sm">{new Date(patient.terakhirKunjungan).toLocaleDateString("id-ID")}</td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
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
                  <p className="text-sm text-muted-foreground">Menampilkan 4 dari 4 pasien</p>
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

export default DataPasien;
