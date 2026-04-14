import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addBooking } from '../features/home/bookingsSlice'
import type { Place } from '../features/home/homeSlice'
import '../styles/CalendarPage.css'

type CalendarCategory =
    | 'all'
    | 'plumber'
    | 'electrician'
    | 'ac repair'
    | 'repair service'
    | 'carpenter'
    | 'maintenance'
    | 'locksmith'
    | 'cleaning services'
    | 'painting'
    | 'pest control'
    | 'hvac service'
    | 'tv repair'


const categories: CalendarCategory[] = [
    'all',
    'plumber',
    'electrician',
    'ac repair',
    'repair service',
    'carpenter',
    'maintenance',
    'locksmith',
    'cleaning services',
    'painting',
    'pest control',
    'hvac service',
    'tv repair',
]

function formatDateLabel(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(date)
}

function getCategoryIcon(category: string) {
    const value = category.toLowerCase()

    if (value.includes('plumb')) return '/icons/water-tap.png'
    if (value.includes('electric')) return '/icons/electric.png'
    if (value.includes('ac')) return '/icons/ac.png'
    if (value.includes('air')) return '/icons/ac.png'
    if (value.includes('hvac')) return '/icons/ac.png'
    if (value.includes('carp')) return '/icons/carpentry.png'
    if (value.includes('repair')) return '/icons/repair.png'
    if (value.includes('tv')) return '/icons/tv.png'
    if (value.includes('clean')) return '/icons/cleaning.png'
    if (value.includes('paint')) return '/icons/paint.png'
    if (value.includes('lock')) return '/icons/locksmith.png'
    if (value.includes('pest')) return '/icons/pest-control.png'

    return '/icons/placeholder.png'
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

export default function CalendarPage() {
    const dispatch = useAppDispatch()
    const homeProviders = useAppSelector((state) => state.home.places)

    const providers = useMemo(() => {
        return homeProviders
    }, [homeProviders])

    // const providers = homeProviders

    const bookingItems = useAppSelector((state) => state.bookings.items)

    const days = useMemo(() => getNext7Days(), [])
    const [selectedDate, setSelectedDate] = useState<string>(days[0] ?? '')
    const [selectedCategory, setSelectedCategory] = useState<CalendarCategory | null>(null)

    const filteredProviders = useMemo(() => {
        if (!selectedCategory) return []

        if (selectedCategory === 'all') {
            return providers
        }

        return providers.filter(
            (provider) =>
                provider.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
        )
    }, [providers, selectedCategory])

    const handleBook = (provider: Place) => {
        if (!selectedDate) return

        dispatch(
            addBooking({
                id: Date.now(),
                date: selectedDate,
                providerId: provider.id,
                providerUid: provider.uid ?? '',
                providerName: provider.name,
                providerCategory: provider.category,
                providerImage: provider.image,
                providerStatus: provider.status,
                status: 'pending',
            })
        )
    }

    return (
        <section className="calendar-page">
            <div className="calendar-page__grid">
                <div className="calendar-page__left">
                    <div className="calendar-panel">
                        <div className="calendar-panel__header">
                            <span className="calendar-panel__eyebrow">Calendar</span>
                            <h1 className="calendar-panel__title">Book by day</h1>
                            <p className="calendar-panel__text">
                                Pick a day, choose one category, then book a provider.
                            </p>
                        </div>

                        <div className="calendar-days">
                            {days.map((day) => {
                                const isActive = selectedDate === day

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`calendar-day ${isActive ? 'calendar-day--active' : ''}`}
                                        onClick={() => {
                                            setSelectedDate(day)
                                            setSelectedCategory(null)
                                        }}
                                    >
                                        <span className="calendar-day__label">
                                            {formatDateLabel(day)}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {selectedDate && (
                            <div className="calendar-categories">
                                <div className="calendar-categories__header">
                                    <h2 className="calendar-categories__title">
                                        Choose category
                                    </h2>
                                    <p className="calendar-categories__subtitle">
                                        Only one category can be selected
                                    </p>
                                </div>

                                <div className="calendar-categories__list">
                                    {categories.map((category) => {
                                        const isActive = selectedCategory === category

                                        return (
                                            <button
                                                key={category}
                                                type="button"
                                                className={`calendar-category ${isActive ? 'calendar-category--active' : ''}`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedCategory && (
                            <div className="calendar-providers">
                                <div className="calendar-providers__header">
                                    <h2 className="calendar-providers__title">
                                        Available providers
                                    </h2>
                                    <p className="calendar-providers__subtitle">
                                        {filteredProviders.length} result
                                        {filteredProviders.length === 1 ? '' : 's'}
                                    </p>
                                </div>

                                {filteredProviders.length === 0 ? (
                                    <div className="calendar-empty">
                                        No providers found for this category.
                                    </div>
                                ) : (
                                    <div className="calendar-provider-grid">
                                        {filteredProviders.map((provider) => (
                                            <article
                                                key={provider.id}
                                                className="calendar-provider-card"
                                            >
                                                <div className="calendar-provider-card__top">
                                                    <div className="calendar-provider-card__icon-wrap">
                                                        <img
                                                            src={getCategoryIcon(provider.category)}
                                                            alt={provider.category}
                                                            className="calendar-provider-card__icon"
                                                        />
                                                    </div>

                                                    <span
                                                        className={`calendar-provider-card__status calendar-provider-card__status--${provider.status ?? 'active'}`}
                                                    >
                                                        {provider.status === 'busy' ? 'Busy' : 'Active'}
                                                    </span>
                                                </div>

                                                {provider.image && (
                                                    <img
                                                        src={provider.image}
                                                        alt={provider.name}
                                                        className="calendar-provider-card__image"
                                                    />
                                                )}

                                                <div className="calendar-provider-card__content">
                                                    <p className="calendar-provider-card__category">
                                                        {provider.category}
                                                    </p>
                                                    <h3 className="calendar-provider-card__name">
                                                        {provider.name}
                                                    </h3>
                                                    <p className="calendar-provider-card__address">
                                                        {provider.address}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="calendar-provider-card__book"
                                                        onClick={() => handleBook(provider)}
                                                    >
                                                        Book
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="calendar-page__right">
                    <div className="booking-panel">
                        <div className="booking-panel__header">
                            <span className="booking-panel__eyebrow">Bookings</span>
                            <h2 className="booking-panel__title">Booking list</h2>
                        </div>

                        {bookingItems.length === 0 ? (
                            <div className="booking-empty">
                                No bookings yet. Pick a day, choose a category, and book a provider.
                            </div>
                        ) : (
                            <div className="booking-list">
                                {bookingItems.map((booking) => (
                                    <article key={booking.id} className="booking-item">
                                        <div className="booking-item__top">
                                            <div>
                                                <p className="booking-item__date">
                                                    {formatDateLabel(booking.date)}
                                                </p>
                                                <h3 className="booking-item__name">
                                                    {booking.providerName}
                                                </h3>
                                            </div>

                                            <span className="booking-item__status booking-item__status--pending">
                                                {booking.status}
                                            </span>
                                        </div>

                                        <p className="booking-item__category">
                                            {booking.providerCategory}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}