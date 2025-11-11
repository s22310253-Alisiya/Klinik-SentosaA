import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, FileText, Pill, AlertCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const recentPatients = [
    { id: "P001", name: "Ahmad Subandi", time: "08:30", status: "waiting" },
    { id: "P002", name: "Siti Rahmawati", time: "09:00", status: "in-progress" },
    { id: "P003", name: "Budi Santoso", time: "09:30", status: "completed" },
    { id: "P004", name: "Dewi Kusuma", time: "10:00", status: "waiting" },
  ];

  const lowStockMeds = [
    { name: "Paracetamol 500mg", stock: 15, unit: "strip" },
    { name: "Amoxicillin 500mg", stock: 8, unit: "strip" },
    { name: "Vitamin C 1000mg", stock: 12, unit: "botol" },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      waiting: { label: "Menunggu", variant: "outline" as const },
      "in-progress": { label: "Sedang Diperiksa", variant: "default" as const },
      completed: { label: "Selesai", variant: "secondary" as const },
    };
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
              <Button>
                <Clock className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            }
          />

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Pasien Hari Ini"
              value="24"
              icon={Users}
              trend={{ value: "12% dari kemarin", isPositive: true }}
              color="primary"
            />
            <StatCard
              title="Resep Aktif"
              value="15"
              icon={FileText}
              trend={{ value: "3 menunggu", isPositive: false }}
              color="warning"
            />
            <StatCard
              title="Stok Menipis"
              value="3"
              icon={AlertCircle}
              color="destructive"
            />
            <StatCard
              title="Obat Tersedia"
              value="156"
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
