export type CreateUserRole = "doctor" | "patient";

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  dob: string;
  gender: string;
  profile_pic: string;
  aadhar: string;
  role: CreateUserRole;
}

