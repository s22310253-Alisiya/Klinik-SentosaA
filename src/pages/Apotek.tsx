import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Apotek = () => {
  const prescriptions = [
    {
      id: "R001",
      pasien: "Ahmad Subandi",
      dokter: "Dr. Sarah Putri",
      waktu: "10:30",
      status: "pending",
      obat: [
        { nama: "Paracetamol 500mg", jumlah: "10 tablet", stok: 150 },
        { nama: "Amoxicillin 500mg", jumlah: "12 kapsul", stok: 8 },
      ],
    },
    {
      id: "R002",
      pasien: "Siti Rahmawati",
      dokter: "Dr. Sarah Putri",
      waktu: "11:00",
      status: "processing",
      obat: [
        { nama: "Vitamin C 1000mg", jumlah: "15 tablet", stok: 12 },
        { nama: "Antasida", jumlah: "10 tablet", stok: 45 },
      ],
    },
  ];

  const handleConfirm = (id: string) => {
    toast.success(`Resep ${id} telah dikonfirmasi dan siap diambil`);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="apoteker" />
      
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Manajemen Apotek"
            description="Kelola resep dan stok obat"
            icon={Pill}
          />

          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Resep {prescription.id}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Pasien: {prescription.pasien}</span>
                        <span>•</span>
                        <span>Dokter: {prescription.dokter}</span>
                        <span>•</span>
                        <span>{prescription.waktu}</span>
                      </div>
                    </div>
                    <Badge variant={prescription.status === "pending" ? "outline" : "default"}>
                      {prescription.status === "pending" ? "Menunggu" : "Diproses"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Daftar Obat:</p>
                      <div className="space-y-2">
                        {prescription.obat.map((obat, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between rounded-lg border p-3 ${
                              obat.stok < 15 ? "border-destructive/30 bg-destructive/5" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {obat.stok < 15 && (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              )}
                              <div>
                                <p className="font-medium">{obat.nama}</p>
                                <p className="text-sm text-muted-foreground">
                                  Jumlah: {obat.jumlah}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${obat.stok < 15 ? "text-destructive" : "text-success"}`}>
                                Stok: {obat.stok}
                              </p>
                              {obat.stok < 15 && (
                                <p className="text-xs text-destructive">Stok menipis!</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => handleConfirm(prescription.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Konfirmasi Obat Siap
                      </Button>
                      <Button variant="outline">Lihat Detail</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Apotek;
