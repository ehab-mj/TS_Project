import { configureStore } from '@reduxjs/toolkit'
import homeReducer from '../features/home/homeSlice'
import favoritesReducer, {
    setFavorites,
} from '../features/home/favoritesSlice'
import type { Place } from '../features/home/homeSlice'
import uiReducer from '../features/home/uiSlice'
import bookingsReducer from '../features/home/bookingsSlice'
import authReducer, { restoreSession } from '../features/auth/authSlice'
import type { AppUser } from '../types/auth'
import providerReducer from '../features/provider/providerSlice'

const FAVORITES_STORAGE_KEY = 'smart-services-favorites'
const AUTH_STORAGE_KEY = 'smart-services-auth'

function loadFavorites(): Place[] {
    try {
        const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (!raw) return []

        const parsed: unknown = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []

        return parsed as Place[]
    } catch {
        return []
    }
}


function loadAuthUser(): AppUser | null {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY)
        if (!raw) return null

        return JSON.parse(raw) as AppUser
    } catch {
        return null
    }
}

export const store = configureStore({
    reducer: {
        home: homeReducer,
        favorites: favoritesReducer,
        ui: uiReducer,
        bookings: bookingsReducer,
        auth: authReducer,
        provider: providerReducer,
    },
})

store.dispatch(setFavorites(loadFavorites()))
store.dispatch(restoreSession(loadAuthUser()))

store.subscribe(() => {
    try {
        const state = store.getState()
        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(state.favorites.items),
        )
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.auth.user))
    } catch {
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch