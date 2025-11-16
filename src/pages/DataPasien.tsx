import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DataPasien = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewPatient, setViewPatient] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any | null>(null);

  // Ambil data pasien dari localStorage
  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, []);

  // Filter pencarian
  const filteredPatients = patients.filter(
    (patient) =>
      patient.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // View patient
  const handleView = (patient: any) => {
    setViewPatient(patient);
    setViewOpen(true);
  };

  // Edit patient
  const handleEdit = (patient: any) => {
    setEditForm({ ...patient });
    setEditOpen(true);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editForm) return;
    const updated = patients.map((p) => (p.id === editForm.id ? editForm : p));
    setPatients(updated);
    localStorage.setItem("patients", JSON.stringify(updated));
    toast.success("Data pasien berhasil diperbarui");
    setEditOpen(false);
  };

  // Hapus patient
  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus data pasien ini?")) return;
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    localStorage.setItem("patients", JSON.stringify(updated));
    toast.success("Data pasien berhasil dihapus");
  };

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
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient, index) => (
                          <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                            <td className="py-4 text-sm font-medium">{patient.id || `P-${index + 1}`}</td>
                            <td className="py-4 text-sm">{patient.nama}</td>
                            <td className="py-4 text-sm">{patient.umur}</td>
                            <td className="py-4 text-sm">{patient.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</td>
                            <td className="py-4 text-sm">{patient.noTelp}</td>
                            <td className="py-4 text-sm">{patient.terakhirKunjungan || "-"}</td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleView(patient)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(patient)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-sm text-muted-foreground">
                            Belum ada data pasien yang tersimpan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {filteredPatients.length} pasien
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* View Dialog */}
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Detail Pasien</DialogTitle>
              </DialogHeader>
              {viewPatient && (
                <div className="space-y-2">
                  <p><strong>ID:</strong> {viewPatient.id}</p>
                  <p><strong>Nama:</strong> {viewPatient.nama}</p>
                  <p><strong>Umur:</strong> {viewPatient.umur}</p>
                  <p><strong>Jenis Kelamin:</strong> {viewPatient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                  <p><strong>No. Telepon:</strong> {viewPatient.noTelp}</p>
                  <p><strong>Alamat:</strong> {viewPatient.alamat}</p>
                  <p><strong>Keluhan:</strong> {viewPatient.keluhan}</p>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setViewOpen(false)}>Tutup</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Data Pasien</DialogTitle>
              </DialogHeader>
              {editForm && (
                <form onSubmit={handleSaveEdit} className="space-y-3 mt-2">
                  <div>
                    <Label>Nama Lengkap</Label>
                    <Input value={editForm.nama} onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Umur</Label>
                      <Input type="number" value={editForm.umur} onChange={(e) => setEditForm({ ...editForm, umur: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Jenis Kelamin</Label>
                      <select className="w-full border rounded-md p-2 text-sm" value={editForm.jenisKelamin} onChange={(e) => setEditForm({ ...editForm, jenisKelamin: e.target.value })}>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>No. Telepon</Label>
                    <Input value={editForm.noTelp} onChange={(e) => setEditForm({ ...editForm, noTelp: e.target.value })} />
                  </div>

                  <div>
                    <Label>Alamat</Label>
                    <Input value={editForm.alamat} onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })} />
                  </div>

                  <div>
                    <Label>Keluhan</Label>
                    <Input value={editForm.keluhan} onChange={(e) => setEditForm({ ...editForm, keluhan: e.target.value })} />
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="mr-2">Simpan</Button>
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default DataPasien;