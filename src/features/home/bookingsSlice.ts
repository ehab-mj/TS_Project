import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type BookingStatus = 'pending' | 'accepted' | 'denied'

export interface BookingItem {
    id: number
    date: string
    providerId: number
    providerUid: string
    providerName: string
    providerCategory: string
    providerImage?: string
    providerStatus?: 'active' | 'busy'
    status: BookingStatus
}

type BookingsState = {
    items: BookingItem[]
}

const initialState: BookingsState = {
    items: [],
}

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<BookingItem>) => {
            state.items.unshift(action.payload)
        },

        removeBooking: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
        },

        updateBookingStatus: (
            state,
            action: PayloadAction<{ id: number; status: BookingStatus }>
        ) => {
            const booking = state.items.find((item) => item.id === action.payload.id)
            if (booking) {
                booking.status = action.payload.status
            }
        },

        acceptBooking: (state, action: PayloadAction<number>) => {
            const booking = state.items.find((item) => item.id === action.payload)
            if (booking) {
                booking.status = 'accepted'
            }
        },

        denyBooking: (state, action: PayloadAction<number>) => {
            const booking = state.items.find((item) => item.id === action.payload)
            if (booking) {
                booking.status = 'denied'
            }
        },
    },
})

export const {
    addBooking,
    removeBooking,
    updateBookingStatus,
    acceptBooking,
    denyBooking,
} = bookingsSlice.actions

export default bookingsSlice.reducer