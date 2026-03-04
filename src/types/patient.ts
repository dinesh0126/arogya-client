export interface CreatePatientUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  dob: string;
  gender: string;
  profile_pic: string;
  aadhar: string;
  role: "patient";
}

export interface CreatePatientProfilePayload {
  userId: number;
  emergency_contact: string;
  preferred_language: string;
  consultation_type: string;
  blood_group: string;
  allergies: string;
  existing_conditions: string;
  medications: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  lifestyle_smoking: boolean;
  lifestyle_alcohol: boolean;
  insurence_provider: string;
  policy_number: string;
  payment_mode: string;
}

export type UpdatePatientProfilePayload = Partial<CreatePatientProfilePayload>;
