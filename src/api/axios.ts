// src/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://aarogya-first-api.onrender.com/api",
  
 
});

// api.interceptors.request.use((config) => {
//   try {
//     const authRaw = localStorage.getItem("auth");
//     if (!authRaw) {
//       return config;
//     }

//     const auth = JSON.parse(authRaw) as { token?: string; role?: string };

//     if (auth.token) {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${auth.token}`;
//       config.headers.token = auth.token;
//       config.headers["x-access-token"] = auth.token;
//     }
//   } catch {
//     // Ignore malformed localStorage auth payload and continue request.
//   }

//   return config;
// });


api.interceptors.request.use((config) => {
  try {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return config;

    const auth = JSON.parse(authRaw) as { token?: string };

    if (auth.token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  } catch {}

  return config;
});