import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Printer } from "lucide-react";
import { toast } from "sonner";

const Pendaftaran = () => {
  const [formData, setFormData] = useState({
    nama: "",
    umur: "",
    jenisKelamin: "",
    alamat: "",
    noTelp: "",
    keluhan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pendaftaran berhasil! Nomor antrian: A-12");
  };

  const todayRegistrations = [
    { id: "P024", nama: "Ahmad Subandi", antrian: "A-01", waktu: "08:30", status: "Selesai" },
    { id: "P025", nama: "Siti Rahmawati", antrian: "A-02", waktu: "09:00", status: "Menunggu" },
    { id: "P026", nama: "Budi Santoso", antrian: "A-03", waktu: "09:30", status: "Menunggu" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="resepsionis" />
      
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Pendaftaran Pasien"
            description="Daftarkan pasien baru dan cetak nomor antrian"
            icon={UserPlus}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Form Pendaftaran */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Form Pendaftaran Pasien Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap *</Label>
                      <Input
                        id="nama"
                        placeholder="Masukkan nama lengkap"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="umur">Umur *</Label>
                      <Input
                        id="umur"
                        type="number"
                        placeholder="Masukkan umur"
                        value={formData.umur}
                        onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                      <Select
                        value={formData.jenisKelamin}
                        onValueChange={(value) => setFormData({ ...formData, jenisKelamin: value })}
                      >
                        <SelectTrigger id="jenisKelamin">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noTelp">No. Telepon *</Label>
                      <Input
                        id="noTelp"
                        placeholder="08xxxxxxxxxx"
                        value={formData.noTelp}
                        onChange={(e) => setFormData({ ...formData, noTelp: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat *</Label>
                    <Textarea
                      id="alamat"
                      placeholder="Masukkan alamat lengkap"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keluhan">Keluhan</Label>
                    <Textarea
                      id="keluhan"
                      placeholder="Masukkan keluhan pasien"
                      value={formData.keluhan}
                      onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Simpan & Cetak Antrian
                    </Button>
                    <Button type="button" variant="outline">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Daftar Pendaftaran Hari Ini */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pendaftaran Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayRegistrations.map((reg) => (
                    <div key={reg.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{reg.nama}</p>
                          <p className="text-xs text-muted-foreground">{reg.id}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-primary">{reg.antrian}</span>
                        <span className="text-muted-foreground">{reg.waktu}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pendaftaran;
