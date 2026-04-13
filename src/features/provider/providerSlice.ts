import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ProviderProfile } from '../../types/auth'

const PROVIDER_PROFILE_STORAGE_KEY = 'smart-services-provider-profiles'

interface ProviderState {
    profiles: ProviderProfile[]
}

function readProfiles(): ProviderProfile[] {
    try {
        const raw = localStorage.getItem(PROVIDER_PROFILE_STORAGE_KEY)
        if (!raw) return []
        const parsed: unknown = JSON.parse(raw)
        return Array.isArray(parsed) ? (parsed as ProviderProfile[]) : []
    } catch {
        return []
    }
}

function writeProfiles(profiles: ProviderProfile[]) {
    localStorage.setItem(PROVIDER_PROFILE_STORAGE_KEY, JSON.stringify(profiles))
}

const initialState: ProviderState = {
    profiles: readProfiles(),
}

const providerSlice = createSlice({
    name: 'provider',
    initialState,
    reducers: {
        saveProviderProfile: (state, action: PayloadAction<ProviderProfile>) => {
            const existingIndex = state.profiles.findIndex(
                (profile) => profile.uid === action.payload.uid
            )

            if (existingIndex >= 0) {
                state.profiles[existingIndex] = action.payload
            } else {
                state.profiles.push(action.payload)
            }

            writeProfiles(state.profiles)
        },
    },
})

export const { saveProviderProfile } = providerSlice.actions
export default providerSlice.reducer