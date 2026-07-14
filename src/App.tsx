import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";

import DashboardLayout from "./layouts/DashboardLayout";
import { LoginForm } from "./pages/login-form";
import ProtectedAuth from "./pages/auth/ProtectedAuth";
import Admin from "./pages/dashboard/Admin";
import AllAppointments from "./pages/dashboard/Appointments/AllAppointments";
import AddAppointment from "./pages/dashboard/Appointments/AddAppointment";
import PatientsList from "./pages/dashboard/Patients/PatientsList";
import AddPatient from "./pages/dashboard/Patients/AddPatient";
import DoctorsList from "./pages/dashboard/Doctors/DoctorsList";
import AddDoctor from "./pages/dashboard/Doctors/AddDoctor";
import DoctorKycVerification from "./pages/dashboard/Doctors/DoctorKycVerification";
import NotFound from "./components/NotFound";
import CreatePlan from "./pages/dashboard/plan/CreatePlan";
import AllPlans from "./pages/dashboard/plan/AllPlans";
import UserManagement from "./pages/dashboard/UserManagement/UserManagement";
import HospitalLayout from "./pages/HospitalLayout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import RatingsPage from "./pages/RatingsPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <>
      <Routes>
        {/*Public hospital pages */}
        <Route path="/" element={<HospitalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="ratings" element={<RatingsPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/*Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<Signup />} />

        {/* dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAuth>
              <DashboardLayout />
            </ProtectedAuth>
          }
        >
          <Route index element={<Admin />} />
          <Route path="appointments/all" element={<AllAppointments />} />
          <Route path="plans" element={<AllPlans />} />
          <Route path="plans/create" element={<CreatePlan />} />
          <Route path="appointments/add" element={<AddAppointment />} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="patients/add-patient" element={<AddPatient />} />
          <Route path="doctors/doctor-list" element={<DoctorsList />} />
          <Route path="doctors/add-doctor" element={<AddDoctor />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route
            path="doctors/kyc-verification"
            element={<DoctorKycVerification />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
