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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [openDoctors, setOpenDoctors] = React.useState(false)
  const [openAppointments, setOpenAppointments] = React.useState(false)

  return (
    <Sidebar {...props} className="bg-white shadow-sm border-none">
      <SidebarHeader className="p-4 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-3">
                <div className="bg-blue-600 text-white flex aspect-square size-10 items-center justify-center rounded-xl font-bold text-xl shadow-md">
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

      <SidebarContent className="py-4  dark:bg-neutral-950">
        <SidebarGroup>
          <SidebarMenu>

            {/* -------- Dashboard -------- */}
            <SidebarMenuItem>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 text-sm bg-gray-200 flex items-center gap-3 rounded-lg px-4 py-2"
                    : "flex text-sm items-center gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800"
                }
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </NavLink>
            </SidebarMenuItem>

            {/* -------- Plans -------- */}
            <SidebarMenuItem>
              <NavLink
                to="/admin/plans"
                className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 text-sm bg-gray-200 flex items-center gap-3 rounded-lg px-4 py-2"
                    : "flex text-sm items-center gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800"
                }
              >
                <CalendarDays className="h-5 w-5" />
                All Plans
              </NavLink>
            </SidebarMenuItem>

            {/* -------- Doctors Dropdown -------- */}
            <SidebarMenuItem>
              <button
                onClick={() => setOpenDoctors(!openDoctors)}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
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
                  <NavLink to="/admin/doctors/doctor-list" className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 text-sm flex bg-gray-200 items-center gap-3 rounded-lg px-4 py-2"
                    : "flex text-sm hover:bg-gray-200 items-centertext-white gap-3 rounded-lg px-4 py-2   dark:bg-black   dark:hover:bg-gray-800"
                }>
                    Doctors List
                  </NavLink>
                  <NavLink to="/admin/doctors/add-doctor" className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 text-sm flex bg-gray-200 items-center gap-3 rounded-lg px-4 py-2"
                    : "flex items-centertext-white gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800 text-sm hover:bg-gray-200"
                }>
                    Add Doctor
                  </NavLink>
                  <NavLink to="/admin/doctors/kyc-verification" className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800  text-sm flex text-white items-center gap-3 rounded-lg px-4 py-2"
                    : "flex text-sm items-centertext-white gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800  hover:bg-gray-200"
                }>
                    KYC Verification
                  </NavLink>
                </div>
              </div>
            </SidebarMenuItem>

            {/* -------- Patients -------- */}
            <SidebarMenuItem>
              <NavLink
                to="/admin/patients"
                className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 flex text-white items-center gap-3 rounded-lg px-4 py-2"
                    : "flex items-centertext-white gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800 text-sm hover:bg-gray-200"
                }
              >
                <Users className="h-5 w-5" />
                Patients
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink
                to="/admin/patients/add-patient"
                className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 flex text-white items-center gap-3 rounded-lg px-4 py-2"
                    : "flex items-centertext-white gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800 text-sm hover:bg-gray-200"
                }
              >
                <Users className="h-5 w-5" />
                Add Patient
              </NavLink>
            </SidebarMenuItem>

            {/* -------- Appointments Dropdown -------- */}
            <SidebarMenuItem>
              <button
                onClick={() => setOpenAppointments(!openAppointments)}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
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
                  <NavLink to="/admin/appointments/all"  className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 bg-gray-200 text-sm flex  items-center gap-3 rounded-lg px-4 py-2"
                    : "flex items-centertext-white text-sm gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800 hover:bg-gray-200"
                }>
                    All Appointments
                  </NavLink>
                  <NavLink to="/admin/appointments/add" className={({ isActive }) =>
                  isActive
                    ? "dark:bg-gray-800 bg-gray-200 text-sm flex  items-center gap-3 rounded-lg px-4 py-2"
                    : "flex items-centertext-white text-sm gap-3 rounded-lg px-4 py-2 dark:hover:bg-gray-800 hover:bg-gray-200"
                }>
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
