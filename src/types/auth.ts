// Login request
export interface LoginPayload {
  email: string;
  password: string;
}

// Signup request
export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  phone_code: string;
  password: string;
  dob: string;
  gender: string;
  aadhar: string;
}

// User response (adjust as per backend)
export interface User {
  id: number;
  name: string;
  email: string;
}

// Login response
export interface AuthResponse {
  token: string;
  user: User;
}
