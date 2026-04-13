export type UserRole = 'guest' | 'provider'

export interface AppUser {
  uid: string
  email: string
  displayName: string | null
  role: UserRole
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  displayName: string
  role: UserRole
}

export interface AuthState {
  user: AppUser | null
  loading: boolean
  error: string | null
  initialized: boolean
}

export type ServiceCategory =
  | 'electricity'
  | 'plumbing'
  | 'ac'
  | 'carpentry'
  | 'cleaning'
  | 'painting'

export interface ProviderProfile {
  uid: string
  serviceCategory: ServiceCategory
  phone: string
  city: string
  locationLink: string
  bio?: string
  isAvailable: boolean
}