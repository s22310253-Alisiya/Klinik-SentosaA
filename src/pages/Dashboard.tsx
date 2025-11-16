import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, FileText, Pill, AlertCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [lowStockMeds, setLowStockMeds] = useState<any[]>([]);
  const [totalMedicines, setTotalMedicines] = useState(0);

  // Load data dari localStorage
  useEffect(() => {
    // Pasien
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    setTotalPatients(patients.length);
    // Ambil 4 pasien terbaru untuk recent list
    const recent = patients.slice(-4).reverse().map((p: any, i: number) => ({
      id: p.id,
      name: p.nama,
      time: new Date(p.terakhirKunjungan || Date.now()).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: i === 0 ? "in-progress" : i < 2 ? "waiting" : "completed",
    }));
    setRecentPatients(recent);

    // Pemeriksaan (resep aktif)
    const pemeriksaan = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
    setTotalPrescriptions(pemeriksaan.length);

    // Pembayaran
    const riwayatPembayaran = JSON.parse(localStorage.getItem("riwayatPembayaran") || "[]");
    setTotalPayments(riwayatPembayaran.length);

    // Obat - low stock dan total
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    setTotalMedicines(medicines.length);
    const lowStock = medicines.filter((m: any) => m.stok < 30).sort((a: any, b: any) => a.stok - b.stok).slice(0, 3);
    setLowStockMeds(lowStock.map((m: any) => ({ name: m.nama, stock: m.stok, unit: m.satuan })));
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      waiting: { label: "Menunggu", variant: "outline" as const },
      "in-progress": { label: "Sedang Diperiksa", variant: "default" as const },
      completed: { label: "Selesai", variant: "secondary" as const },
    };
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleRefresh = () => {
    // Reload semua data dari localStorage
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    setTotalPatients(patients.length);
    const recent = patients.slice(-4).reverse().map((p: any, i: number) => ({
      id: p.id,
      name: p.nama,
      time: new Date(p.terakhirKunjungan || Date.now()).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: i === 0 ? "in-progress" : i < 2 ? "waiting" : "completed",
    }));
    setRecentPatients(recent);

    const pemeriksaan = JSON.parse(localStorage.getItem("pemeriksaan") || "[]");
    setTotalPrescriptions(pemeriksaan.length);

    const riwayatPembayaran = JSON.parse(localStorage.getItem("riwayatPembayaran") || "[]");
    setTotalPayments(riwayatPembayaran.length);

    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    setTotalMedicines(medicines.length);
    const lowStock = medicines.filter((m: any) => m.stok < 30).sort((a: any, b: any) => a.stok - b.stok).slice(0, 3);
    setLowStockMeds(lowStock.map((m: any) => ({ name: m.nama, stock: m.stok, unit: m.satuan })));
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="dokter" />
      
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Dashboard"
            description="Ringkasan aktivitas hari ini"
            icon={LayoutDashboard}
            action={
              <Button onClick={handleRefresh}>
                <Clock className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            }
          />

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Pasien Hari Ini"
              value={totalPatients.toString()}
              icon={Users}
              trend={{ value: `${recentPatients.length} baru`, isPositive: true }}
              color="primary"
            />
            <StatCard
              title="Resep Aktif"
              value={totalPrescriptions.toString()}
              icon={FileText}
              trend={{ value: `${totalPayments} terproses`, isPositive: true }}
              color="warning"
            />
            <StatCard
              title="Stok Menipis"
              value={lowStockMeds.length.toString()}
              icon={AlertCircle}
              color="destructive"
            />
            <StatCard
              title="Obat Tersedia"
              value={totalMedicines.toString()}
              icon={Pill}
              color="success"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Pasien Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {patient.id} • {patient.time}
                        </p>
                      </div>
                      {getStatusBadge(patient.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Stok Obat Menipis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockMeds.map((med, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">Tersisa: {med.stock} {med.unit}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Pesan
                      </Button>
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

export default Dashboard;
