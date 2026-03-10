
import { Card } from "@/components/ui/card";
import { Box, Hospital, Pill, Users } from "lucide-react";
import { useState } from "react";
import Overview from "./DashboardPages/Overview";
import Analytics from "./DashboardPages/Analytics";
import Reports from "./DashboardPages/Reports";
import Notification from "./DashboardPages/Notification";
import { useDashboard } from "@/hooks/useDashboard";


const Admin = () => {
  const { data, isLoading } = useDashboard();
    const [activeTab, setActiveTab] = useState("overview");
  const cardData = [
    { title: "Total Users", icon: <Users />, value: data?.users.total, change: "+5.4%",color:"text-green-500" ,symbol:"$"},
    { title: "Appointments", icon: <Box />, value: data?.appointments.total || 0, change: "+2.1%",color:"text-blue-500" ,symbol:"+"},
    { title: "Patients", icon: <Pill />, value: data?.users.patients || 0, change: "+2.1%" ,color:"text-purple-500" ,symbol:"+"},
    { title: "Doctors", icon: <Hospital />, value: data?.users.doctors || 0, change: "+2.1%"  ,color:"text-red-500", symbol:"+"},
  ];

    const tabs = [
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "reports", label: "Reports" },
    { id: "notifications", label: "Notifications" },
  ];


  return (
    <div className="w-full  flex-1">
      <div className="p-2">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-slate-300">Welcome back, Dr. Johnson! Here's what's happening today.</p>
    </div>  
    <div className="md:flex  w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 w-full">
            {cardData.map((card, index) => {
              const user = card.icon;
              return (
                <Card key={index} className="p-8 w-full md:mb-0 md:mr-4">
                  <span className={`${card.color}`}>{user}</span>
                  <p className="text-lg font-medium text-slate-300 mt-2">
                    {card.title}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold"><span>{card.symbol}</span>{isLoading ? "..." : card.value}</p>
                    <p className="text-green-500">{card.change}</p>
                  </div>
                </Card>
              );
            })}
          </div>

 <div className="flex items-center gap-4 mt-4 mb-5 bg-white/5 p-2 shadow rounded-xl w-max border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-2 md:px-5 py-2 rounded-lg text-sm cursor-pointer font-medium transition-all duration-300
              ${activeTab === tab.id
                ? "bg-slate-950/80 border border-white/10 shadow-md scale-105"
                : "text-slate-300 hover:bg-white/5"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
  
      <div className=" rounded">
        {activeTab === "overview" && <Overview />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "reports" && <Reports />}
        {activeTab === "notifications" && <Notification />}
      </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
