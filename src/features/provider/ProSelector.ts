import type { RootState } from '../../app/store'

export const selectProviderProfiles = (state: RootState) => state.provider.profiles

export const selectProviderProfileByUid = (uid: string) => (state: RootState) =>
    state.provider.profiles.find((profile) => profile.uid === uid) ?? null