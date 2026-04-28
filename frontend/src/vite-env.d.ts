/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_NODE_ENV: string
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_DEBUG_MODE?: string
  readonly VITE_MAX_IMAGE_SIZE?: string
  readonly VITE_ALLOWED_IMAGE_TYPES?: string
  readonly VITE_STRIPE_PUBLIC_KEY?: string
  readonly VITE_PAYMENT_CURRENCY?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
  readonly VITE_FACEBOOK_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
