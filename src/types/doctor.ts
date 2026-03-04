export interface CreateDoctorUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  dob: string;
  gender: string;
  profile_pic: string;
  aadhar: string;
  role: "doctor";
}

export interface CreateDoctorProfilePayload {
  userId: number;
  specialization: string;
  qualification: string;
  experienceYears: number;
  languagesSpoken: string;
  consultationTypes: string[];
  consultationFee: number;
  workStartTime: string;
  workEndTime: string;
  availableDays: string[];
  timezone: string;
  clinicName: string;
  clinicAddress: string;
  teleconsultationAvailable: boolean;
  emergencySupport: boolean;
  registrationNumber: string;
  councilName: string;
  verificationDoc: string;
  govtIdDoc: string;
  bankAccount: string;
  panCard: string;
}

export interface CreateDoctorFlowPayload {
  user: Omit<CreateDoctorUserPayload, "role">;
  profile: Omit<CreateDoctorProfilePayload, "userId">;
}
