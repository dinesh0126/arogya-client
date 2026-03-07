export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong."
) => {
  const apiError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return apiError?.response?.data?.message || apiError?.message || fallback;
};
