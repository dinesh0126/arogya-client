import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/dashboard/AdminSidebar/App-sidebar";
import DashboardNavbar from "@/pages/dashboard/AdminSidebar/Dashboard-navbar";
import { Outlet } from "react-router-dom";
function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="transition-all duration-300 border border-white/10 overflow-hidden">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto transition-all duration-300 text-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.12),_transparent_26%),linear-gradient(145deg,#020817_0%,#0f172a_45%,#10243a_100%)]">
          <DashboardNavbar />

          <div className="p-2 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
