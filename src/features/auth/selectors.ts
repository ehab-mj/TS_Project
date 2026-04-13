import type { RootState } from '../../app/store'

export const selectAuth = (state: RootState) => state.auth
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user)
export const selectAuthError = (state: RootState) => state.auth.error
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthInitialized = (state: RootState) => state.auth.initialized