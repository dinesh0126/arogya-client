import { Navigate } from "react-router-dom";


interface ProtectedAuthProps{
    children: React.ReactNode;
}


const ProtectedAuth: React.FC<ProtectedAuthProps> = ({ children}) => {
    const auth = JSON.parse(localStorage.getItem("auth") || ("{}"));

    if(!auth.isAuth || auth.role !== "admin"){
        return <Navigate to='/login' replace/>
    }
  return (
    <div>

      {children}
    </div>
  )
}

export default ProtectedAuth
