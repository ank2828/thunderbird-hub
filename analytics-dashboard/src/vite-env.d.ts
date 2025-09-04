/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_AUTH_ENABLED: string
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_GA_TRACKING_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
