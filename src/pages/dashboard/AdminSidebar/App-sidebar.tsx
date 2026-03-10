import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  ChevronDown,
} from "lucide-react"

import { NavLink } from "react-router-dom"

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-white/10 text-sm text-white flex items-center gap-3 rounded-lg px-4 py-2"
    : "flex text-sm items-center gap-3 rounded-lg px-4 py-2 text-slate-200 hover:bg-white/5"

const subNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-white/10 text-sm text-white flex items-center gap-3 rounded-lg px-4 py-2"
    : "flex text-sm items-center gap-3 rounded-lg px-4 py-2 text-slate-200 hover:bg-white/5"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [openDoctors, setOpenDoctors] = React.useState(false)
  const [openPatients, setOpenPatients] = React.useState(false)
  const [openPlans, setOpenPlans] = React.useState(false)
  const [openAppointments, setOpenAppointments] = React.useState(false)

  return (
    <Sidebar
      {...props}
      className="bg-slate-950/45 text-slate-100 shadow-sm border-none"
    >
      <SidebarHeader className="p-4 border-b border-white/10 bg-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-3">
                <div className="bg-card border border-white/10 text-cyan-200 flex aspect-square size-10 items-center justify-center rounded-xl font-bold text-xl shadow-sm">
                  A
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-lg">Aarogya</span>
                  {/* <span className="text-sm text-gray-500">Dashboard</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu>

            {/* -------- Dashboard -------- */}
            <SidebarMenuItem>
              <NavLink
                to="/"
                className={navLinkClassName}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </NavLink>
            </SidebarMenuItem>

            {/* -------- Plan Management Dropdown -------- */}
            <SidebarMenuItem>
              <button
                onClick={() => setOpenPlans(!openPlans)}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5" />
                  <span className=" text-sm">Plan Management</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                    openPlans ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  openPlans ? "max-h-28 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-2 py-1">
                  <NavLink to="/admin/plans" className={subNavLinkClassName}>
                    All Plans
                  </NavLink>
                  <NavLink to="/admin/plans/create" className={subNavLinkClassName}>
                    Create Plan
                  </NavLink>
                </div>
              </div>
            </SidebarMenuItem>

            {/* -------- Doctors Dropdown -------- */}
            <SidebarMenuItem>
              <button
                onClick={() => setOpenDoctors(!openDoctors)}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5" />
                  <span className=" text-sm">Doctors</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                    openDoctors ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDoctors ? "max-h-56 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-2 py-1">
                  <NavLink to="/admin/doctors/doctor-list" className={subNavLinkClassName}>
                    Doctors List
                  </NavLink>
                  <NavLink to="/admin/doctors/add-doctor" className={subNavLinkClassName}>
                    Add Doctor
                  </NavLink>
                  <NavLink to="/admin/doctors/kyc-verification" className={subNavLinkClassName}>
                    KYC Verification
                  </NavLink>
                </div>
              </div>
            </SidebarMenuItem>

            {/* -------- Patients Dropdown -------- */}
            <SidebarMenuItem>
              <button
                onClick={() => setOpenPatients(!openPatients)}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <span className=" text-sm">Patients</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                    openPatients ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  openPatients ? "max-h-28 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-2 py-1">
                  <NavLink to="/admin/patients" className={subNavLinkClassName}>
                    Patients List
                  </NavLink>
                  <NavLink to="/admin/patients/add-patient" className={subNavLinkClassName}>
                    Add Patient
                  </NavLink>
                </div>
              </div>
            </SidebarMenuItem>

            {/* -------- User Management -------- */}
            <SidebarMenuItem>
              <NavLink to="/admin/user-management" className={navLinkClassName}>
                <Users className="h-5 w-5" />
                User Management
              </NavLink>
            </SidebarMenuItem>

            {/* -------- Appointments Dropdown -------- */}
            <SidebarMenuItem>
              <button
                onClick={() => setOpenAppointments(!openAppointments)}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-sm ">Appointments</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                    openAppointments ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  openAppointments ? "max-h-28 opacity-100 " : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-2   py-1">
                  <NavLink to="/admin/appointments/all" className={subNavLinkClassName}>
                    All Appointments
                  </NavLink>
                  <NavLink to="/admin/appointments/add" className={subNavLinkClassName}>
                    Add Appointment
                  </NavLink>
                </div>
              </div>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
