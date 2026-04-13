import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppUser, AuthState, LoginFormData, RegisterFormData } from '../../types/auth'
import { registerUserService, loginUserService } from '../../firebase/authService'

const SESSION_STORAGE_KEY = 'smart-services-session'

function writeSession(user: AppUser | null) {
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

export function readSession(): AppUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppUser
  } catch {
    return null
  }
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true
      state.error = null
    },
    registerSuccess: (state, action: PayloadAction<AppUser>) => {
      state.loading = false
      state.user = action.payload
      state.error = null
      state.initialized = true
      writeSession(action.payload)
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.initialized = true
    },

    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<AppUser>) => {
      state.loading = false
      state.user = action.payload
      state.error = null
      state.initialized = true
      writeSession(action.payload)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.initialized = true
    },

    logout: (state) => {
      state.user = null
      state.loading = false
      state.error = null
      state.initialized = true
      writeSession(null)
    },

    restoreSession: (state, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload
      state.loading = false
      state.error = null
      state.initialized = true
    },

    clearAuthError: (state) => {
      state.error = null
    },
  },
})

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  restoreSession,
  clearAuthError,
} = authSlice.actions

export function registerUser(formData: RegisterFormData) {
  return async (
    dispatch: (
      action:
        | PayloadAction<string>
        | PayloadAction<AppUser>
        | PayloadAction<AppUser | null>
        | ReturnType<typeof registerStart>
    ) => void
  ) => {
    dispatch(registerStart())

    try {
      const user = await registerUserService(formData)
      dispatch(registerSuccess(user))
      return true
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Registration failed'
      dispatch(registerFailure(message))
      return false
    }
  }
}

export function loginUser(formData: LoginFormData) {
  return async (
    dispatch: (
      action:
        | PayloadAction<string>
        | PayloadAction<AppUser>
        | PayloadAction<AppUser | null>
        | ReturnType<typeof loginStart>
    ) => void
  ) => {
    dispatch(loginStart())

    try {
      const user = await loginUserService(formData)
      dispatch(loginSuccess(user))
      return true
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Wrong email or password.'
      dispatch(loginFailure(message))
      return false
    }
  }
}

export default authSlice.reducer