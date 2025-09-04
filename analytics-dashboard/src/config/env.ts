export const env = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  auth: {
    enabled: import.meta.env.VITE_AUTH_ENABLED === 'true',
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },
  external: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
    gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
  },
} as const

export type EnvConfig = typeof env