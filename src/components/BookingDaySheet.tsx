import { useMemo, useState } from 'react'
import type { Place } from '../features/home/homeSlice'
import '../styles/BookingDaySheet.css'

type Props = {
    place: Place | null
    onClose: () => void
    onConfirm: (date: string, place: Place) => void
}

function getNext7Days() {
    const result: string[] = []
    const today = new Date()

    for (let i = 0; i < 7; i += 1) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        result.push(date.toISOString().slice(0, 10))
    }

    return result
}

function formatDateLabel(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(date)
}

export default function BookingDaySheet({ place, onClose, onConfirm }: Props) {
    const days = useMemo(() => getNext7Days(), [])
    const [selectedDate, setSelectedDate] = useState<string>(days[0] ?? '')

    if (!place) return null

    return (
        <>
            <div
                className={`booking-day-overlay ${place ? 'booking-day-overlay--show' : ''}`}
                onClick={onClose}
            />

            <div className={`booking-day-sheet ${place ? 'booking-day-sheet--show' : ''}`}>
                <div className="booking-day-sheet__grabber" />

                <div className="booking-day-sheet__header">
                    <div>
                        <p className="booking-day-sheet__eyebrow">Book by day</p>
                        <h2 className="booking-day-sheet__title">{place.name}</h2>
                    </div>

                    <button
                        type="button"
                        className="booking-day-sheet__close"
                        onClick={onClose}
                        aria-label="Close booking day sheet"
                    >
                        ✕
                    </button>
                </div>

                <p className="booking-day-sheet__text">
                    Choose a day for your booking, then confirm to add it to your booking list.
                </p>

                <div className="booking-day-sheet__days">
                    {days.map((day) => {
                        const isActive = selectedDate === day

                        return (
                            <button
                                key={day}
                                type="button"
                                className={`booking-day-sheet__day ${isActive ? 'booking-day-sheet__day--active' : ''}`}
                                onClick={() => setSelectedDate(day)}
                            >
                                {formatDateLabel(day)}
                            </button>
                        )
                    })}
                </div>

                <button
                    type="button"
                    className="booking-day-sheet__confirm"
                    onClick={() => onConfirm(selectedDate, place)}
                >
                    Confirm Booking
                </button>
            </div>
        </>
    )
}