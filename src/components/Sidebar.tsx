import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  UserPlus,
  Stethoscope,
  Pill,
  CreditCard,
  Users,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRole, logout } from "@/lib/auth";

interface SidebarProps {
  role?: string;
}

const Sidebar = ({ role: propRole }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string>(propRole || "");

  // Ambil role dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const r = getRole();
    if (r) setRole(r);
    else if (propRole) setRole(propRole);
  }, [propRole]);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["all"] },
    { title: "Pendaftaran", icon: UserPlus, path: "/pendaftaran", roles: ["resepsionis", "admin"] },
    { title: "Pemeriksaan", icon: Stethoscope, path: "/pemeriksaan", roles: ["dokter", "admin"] },
    { title: "Apotek", icon: Pill, path: "/apotek", roles: ["apoteker", "admin"] },
    { title: "Pembayaran", icon: CreditCard, path: "/pembayaran", roles: ["administrasi", "admin"] },
    { title: "Data Pasien", icon: Users, path: "/data-pasien", roles: ["admin", "dokter"] },
    { title: "Data Obat", icon: Package, path: "/data-obat", roles: ["admin", "apoteker"] },
    { title: "Pengaturan", icon: Settings, path: "/pengaturan", roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.roles.includes("all") || item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-0 lg:w-20" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Klinik Sentosa</h2>
                  <p className="text-xs text-sidebar-foreground/70">Sistem Informasi</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-2 hover:bg-sidebar-accent transition-colors"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {filteredMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;