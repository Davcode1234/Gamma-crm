export const Config = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  baseURL: import.meta.env.BASE_URL,
  mode: import.meta.env.MODE,
  ssr: import.meta.env.SSR,
} as const;
