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

function App() {
 
  return (
    <>
      
        <Routes>
         {/*Auth Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<Signup />} />

          {/* dashboard Routes */}
          <Route path="/" element={
            <ProtectedAuth>
            <DashboardLayout />
            </ProtectedAuth>
            }>
<Route index element={<Admin/>} />
<Route path="/admin/appointments/all" element={<AllAppointments/>} />
<Route path="/admin/plans" element={<AllPlans/>} />
<Route path="/admin/plans/create" element={<CreatePlan/>} />
<Route path="/admin/appointments/add" element={<AddAppointment/>} />
<Route path="/admin/patients" element={<PatientsList/>} />
<Route path="/admin/patients/add-patient" element={<AddPatient/>} />
<Route path="/admin/doctors/doctor-list" element={<DoctorsList/>} />
<Route path="/admin/doctors/add-doctor" element={<AddDoctor/>} />
<Route path="/admin/doctors/kyc-verification" element={<DoctorKycVerification/>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
  
    </>
  );
}

export default App;
