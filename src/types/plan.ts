export interface CreatePlanPayload {
  plan_name: string;
  price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  auto_renew: boolean;
  plan_type: string;
}

export interface UpdatePlanPayload extends CreatePlanPayload {}

export interface Plan {
  id: number;
  plan_name: string;
  price: string | number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  auto_renew: boolean;
  plan_type: string;
}

export interface FetchPlansResponse {
  success: boolean;
  plans: Plan[];
}
