// // src/api/axios.ts
// import axios from "axios";

// const DEFAULT_API_BASE_URL = "https://aarogya-first-api.onrender.com/api";
// const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// export const api = axios.create({
//   baseURL: configuredBaseUrl || (import.meta.env.DEV ? "/api" : DEFAULT_API_BASE_URL),
//   timeout: 15000,
// });

// // api.interceptors.request.use((config) => {
// //   try {
// //     const authRaw = localStorage.getItem("auth");
// //     if (!authRaw) {
// //       return config;
// //     }

// //     const auth = JSON.parse(authRaw) as { token?: string; role?: string };

// //     if (auth.token) {
// //       config.headers = config.headers ?? {};
// //       config.headers.Authorization = `Bearer ${auth.token}`;
// //       config.headers.token = auth.token;
// //       config.headers["x-access-token"] = auth.token;
// //     }
// //   } catch {
// //     // Ignore malformed localStorage auth payload and continue request.
// //   }

// //   return config;
// // });


// api.interceptors.request.use((config) => {
//   try {
//     const authRaw = localStorage.getItem("auth");
//     if (!authRaw) return config;

//     const auth = JSON.parse(authRaw) as { token?: string };

//     if (auth.token) {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${auth.token}`;
//     }
//   } catch {}

//   return config;
// });


import axios from "axios";

const DEFAULT_API_BASE_URL = "https://aarogya-first-api.vercel.app/api"
//"https://aarogya-first-api.onrender.com/api";

// agar .env me VITE_API_BASE_URL diya hoga to wahi use hoga
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const api = axios.create({
  baseURL: configuredBaseUrl || DEFAULT_API_BASE_URL,
  timeout: 15000,
});

// Request interceptor (token attach karne ke liye)
api.interceptors.request.use(
  (config) => {
    try {
      const authRaw = localStorage.getItem("auth");

      if (!authRaw) return config;

      const auth = JSON.parse(authRaw) as { token?: string };

      if (auth.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch (error) {
      console.error("Token parse error:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);