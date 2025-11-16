import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

const Pendaftaran = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    umur: "",
    jenisKelamin: "L",
    noTelp: "",
    alamat: "",
    keluhan: "",
  });

  // 🔹 Generate ID unik otomatis
  const generateId = () => {
    const lastId = localStorage.getItem("lastPatientId");
    const nextNum = lastId ? parseInt(lastId.replace("P", "")) + 1 : 1;
    const newId = `P${nextNum.toString().padStart(3, "0")}`;
    localStorage.setItem("lastPatientId", newId);
    return newId;
  };

  // 🔹 Simpan pasien baru ke localStorage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient = {
      id: generateId(),
      nama: form.nama,
      umur: form.umur,
      jenisKelamin: form.jenisKelamin,
      noTelp: form.noTelp,
      alamat: form.alamat,
      keluhan: form.keluhan,
      terakhirKunjungan: new Date().toISOString(), // format sama dengan DataPasien
    };

    const existing = JSON.parse(localStorage.getItem("patients") || "[]");
    const updated = [...existing, newPatient];
    localStorage.setItem("patients", JSON.stringify(updated));

    // ✅ Pop-up sukses (tanpa reload)
    alert(`✅ Pasien ${form.nama} berhasil didaftarkan!`);

    // Reset form
    setForm({
      nama: "",
      umur: "",
      jenisKelamin: "L",
      noTelp: "",
      alamat: "",
      keluhan: "",
    });
    setIsOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="resepsionis" /> {/* Bisa disesuaikan dengan role login */}

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Pendaftaran Pasien"
            description="Daftarkan pasien baru ke dalam sistem"
            icon={UserPlus}
            action={
              <Button onClick={() => setIsOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Pasien
              </Button>
            }
          />

          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Klik tombol <b>Tambah Pasien</b> untuk melakukan pendaftaran.
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 🔹 Popup Form Pendaftaran */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Formulir Pendaftaran Pasien</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div>
              <Label>Nama Lengkap</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Umur</Label>
                <Input
                  type="number"
                  value={form.umur}
                  onChange={(e) => setForm({ ...form, umur: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Jenis Kelamin</Label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={form.jenisKelamin}
                  onChange={(e) =>
                    setForm({ ...form, jenisKelamin: e.target.value })
                  }
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div>
              <Label>No. Telepon</Label>
              <Input
                value={form.noTelp}
                onChange={(e) => setForm({ ...form, noTelp: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Alamat</Label>
              <Input
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Keluhan</Label>
              <Input
                value={form.keluhan}
                onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Simpan Data Pasien
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pendaftaran;