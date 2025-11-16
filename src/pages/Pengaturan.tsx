import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Settings = {
  theme: "light" | "dark";
  defaultLanding: Record<string, string>;
};

const defaultSettings: Settings = {
  theme: "light",
  defaultLanding: {
    admin: "/dashboard",
    dokter: "/pemeriksaan",
    apoteker: "/apotek",
    resepsionis: "/pendaftaran",
    administrasi: "/pembayaran",
  },
};

const Pengaturan = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const raw = localStorage.getItem("settings");
    if (raw) {
      try {
        setSettings(JSON.parse(raw));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    toast.success("Pengaturan disimpan");
  };

  const handleClearData = () => {
    if (!confirm("Hapus semua data pasien, resep, obat, dan pembayaran? Tindakan ini tidak bisa dibatalkan.")) return;
    const keys = ["patients", "pemeriksaan", "medicines", "riwayat", "riwayatPembayaran", "lastPatientId"];
    keys.forEach((k) => localStorage.removeItem(k));
    toast.success("Data utama telah dihapus");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin" />

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader title="Pengaturan" description="Atur preferensi aplikasi" icon={SettingsIcon} />

          <Card>
            <CardHeader>
              <CardTitle>Preferensi Aplikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Tema</Label>
                  <Select value={settings.theme} onValueChange={(v) => setSettings({ ...settings, theme: v as "light" | "dark" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Landing Page Default per Role</Label>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-2">
                    {Object.keys(settings.defaultLanding).map((r) => (
                      <div key={r} className="space-y-1">
                        <div className="text-sm text-muted-foreground">{r}</div>
                        <InputLanding roleKey={r} value={settings.defaultLanding[r]} onChange={(val) => setSettings({ ...settings, defaultLanding: { ...settings.defaultLanding, [r]: val } })} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSave}>Simpan Pengaturan</Button>
                  <Button variant="destructive" onClick={handleClearData}>Hapus Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Pengaturan;

// Small inner component for editable landing path
function InputLanding({ roleKey, value, onChange }: { roleKey: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input className="w-full rounded-md border px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
