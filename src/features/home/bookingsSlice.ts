import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingItem {
    id: number
    date: string
    providerId: number
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
    },
})

export const { addBooking, removeBooking, updateBookingStatus } = bookingsSlice.actions
export default bookingsSlice.reducer