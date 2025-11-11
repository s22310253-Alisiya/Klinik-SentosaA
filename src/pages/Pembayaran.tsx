import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Printer } from "lucide-react";
import { toast } from "sonner";

const Pembayaran = () => {
  const pendingPayments = [
    {
      id: "P001",
      pasien: "Ahmad Subandi",
      layanan: "Pemeriksaan Umum",
      biayaLayanan: 50000,
      biayaObat: 45000,
      total: 95000,
      status: "belum",
    },
    {
      id: "P002",
      pasien: "Siti Rahmawati",
      layanan: "Konsultasi",
      biayaLayanan: 75000,
      biayaObat: 30000,
      total: 105000,
      status: "belum",
    },
    {
      id: "P003",
      pasien: "Budi Santoso",
      layanan: "Pemeriksaan Umum",
      biayaLayanan: 50000,
      biayaObat: 60000,
      total: 110000,
      status: "lunas",
    },
  ];

  const handlePayment = (id: string, total: number) => {
    toast.success(`Pembayaran ${id} sebesar Rp ${total.toLocaleString()} berhasil dicatat`);
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="administrasi" />
      
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          <PageHeader
            title="Pembayaran"
            description="Kelola pembayaran pasien dan cetak struk"
            icon={CreditCard}
          />

          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{payment.pasien}</CardTitle>
                      <p className="text-sm text-muted-foreground">ID: {payment.id}</p>
                    </div>
                    <Badge variant={payment.status === "lunas" ? "default" : "destructive"}>
                      {payment.status === "lunas" ? "Lunas" : "Belum Bayar"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Layanan:</span>
                        <span className="font-medium">{payment.layanan}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Biaya Layanan:</span>
                        <span>{formatCurrency(payment.biayaLayanan)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Biaya Obat:</span>
                        <span>{formatCurrency(payment.biayaObat)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Total:</span>
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(payment.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {payment.status === "belum" ? (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handlePayment(payment.id, payment.total)}
                          className="flex-1"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Proses Pembayaran
                        </Button>
                        <Button variant="outline">
                          <Printer className="mr-2 h-4 w-4" />
                          Preview Struk
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full">
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Ulang Struk
                      </Button>
                    )}
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

export default Pembayaran;
