import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/dashboard/AdminSidebar/App-sidebar";
import DashboardNavbar from "@/pages/dashboard/AdminSidebar/Dashboard-navbar";
import { Outlet } from "react-router-dom";
function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="transition-all duration-300 border overflow-hidden">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 dark:bg-neutral-950/90 overflow-auto transition-all duration-300">
          <DashboardNavbar />

          <div className="mt-16 p-2 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
