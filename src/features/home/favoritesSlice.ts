import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Place } from '../home/homeSlice'

type FavoritesState = {
    items: Place[]
}

const initialState: FavoritesState = {
    items: [],
}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<Place>) => {
            const exists = state.items.some((item) => item.id === action.payload.id)
            if (!exists) {
                state.items.push(action.payload)
            }
        },

        removeFavorite: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
        },

        toggleFavorite: (state, action: PayloadAction<Place>) => {
            const exists = state.items.some((item) => item.id === action.payload.id)

            if (exists) {
                state.items = state.items.filter((item) => item.id !== action.payload.id)
            } else {
                state.items.push(action.payload)
            }
        },

        setFavorites: (state, action: PayloadAction<Place[]>) => {
            state.items = action.payload
        },
    },
})

export const { addFavorite, removeFavorite, toggleFavorite, setFavorites } =
    favoritesSlice.actions

export default favoritesSlice.reducer