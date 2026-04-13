import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type PlaceCategory =
    | 'all'
    | 'plumber'
    | 'electrician'
    | 'ac repair'
    | 'repair service'
    | 'appliance-repair'
    | 'carpenter'
    | 'maintenance'
    | 'locksmith'
    | 'cleaning services'
    | 'painting'
    | 'pest control'
    | 'hvac service'
    | 'tv repair'
// 'electrician' | 'plumber' | 'ac repair' | 'carpenter' | 'cleaning services'

export interface Place {
    id: number
    name: string
    category: string
    address: string
    lat: number
    lng: number
    image?: string
    featured?: boolean
    status?: 'active' | 'busy'
    phone?: string
    bio?: string
    city?: string
    locationLink?: string
}


type UserLocation = {
    lat: number
    lng: number
}

type HomeState = {
    places: Place[]
    selectedPlace: Place | null
    search: string
    selectedCategory: PlaceCategory
    userLocation: UserLocation | null
}

const initialState: HomeState = {
    places: [],
    selectedPlace: null,
    search: '',
    selectedCategory: 'all',
    userLocation: null,
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setPlaces: (state, action: PayloadAction<Place[]>) => {
            state.places = action.payload
        },
        setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
            state.selectedPlace = action.payload
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setUserLocation: (state, action: PayloadAction<UserLocation | null>) => {
            state.userLocation = action.payload
        },
        setSelectedCategory: (state, action: PayloadAction<PlaceCategory>) => {
            state.selectedCategory = action.payload
        },
    },
})

export const {
    setPlaces,
    setSelectedPlace,
    setSearch,
    setUserLocation,
    setSelectedCategory,
} = homeSlice.actions

export default homeSlice.reducer