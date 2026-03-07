export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong."
) => {
  const apiError = error as {
    code?: string;
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };

  const apiMessage = apiError?.response?.data?.message;

  if (Array.isArray(apiMessage)) {
    return apiMessage[0] || fallback;
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  if (apiError?.code === "ECONNABORTED") {
    return "Login request timed out. Backend server ya network response nahi de raha.";
  }

  return apiError?.message || fallback;
};
