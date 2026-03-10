import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  NotificationList,
  notificationSeed,
} from "../DashboardPages/Notification";
import type { NotificationItem } from "../DashboardPages/Notification";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";

const DashboardNavbar = () => {

  const navigate = useNavigate();
  const { toast } = useToast();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(notificationSeed);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    if (!unreadCount) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === item.id ? { ...notification, read: true } : notification
      )
    );
  };

  const logOut= () => {
    localStorage.removeItem("auth");
    toast({
      title: "Logged out",
      description: "You have been signed out of Arogya Healthcare.",
      variant: "info",
    });
    navigate("/login");
  }


  return (
    <nav className="sticky top-0 z-30 h-16 w-full px-4 border-b border-white/10 bg-slate-950/45 backdrop-blur-md flex items-center justify-between">
      
      {/* LEFT SECTION */}
      <div   className="flex items-center gap-4">
        <SidebarTrigger className="flex md:hidden cursor-pointer" />
        <div className="w-84 hidden md:block">
          <Input placeholder="Search..." className="rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center  gap-6">
        {/* Notification */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative rounded-full p-2 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
            <Bell className="w-5 h-5 text-slate-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 rounded-full bg-red-600 px-1.5 py-[2px] text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0 shadow-xl ring-1 ring-white/10 bg-slate-950/95 border border-white/10 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  Notifications
                </p>
                <p className="text-xs text-slate-400">
                  {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={markAllRead}
                disabled={!unreadCount}
                className="text-xs font-medium text-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:text-slate-500"
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto px-4 py-3">
              <NotificationList
                notifications={notifications}
                compact
                onItemClick={handleItemClick}
              />
            </div>
            <div className="border-t border-white/10 px-4 py-2 text-center text-sm text-cyan-300 hover:text-cyan-200">
              View all notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://cdna.artstation.com/p/assets/images/images/040/951/926/large/maddie_creates-jj-ver2.jpg?1630351796"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <span className="font-medium hidden md:block">Dishant</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 bg-slate-950/95 border border-white/10 text-slate-100" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut} className="text-red-600">
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
