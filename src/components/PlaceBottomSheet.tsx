import type { Place } from '../features/home/homeSlice'
import '../styles/PlaceBottomSheet.css'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { toggleFavorite } from '../features/home/favoritesSlice'
import { openProviderChat } from '../features/home/uiSlice'
import { useNavigate } from 'react-router-dom'

import '../styles/PlaceBottomSheet.css'
type Props = {
    place: Place | null
    onClose: () => void
    onBookNow: (place: Place) => void
}


export default function PlaceBottomSheet({ place, onClose, onBookNow }: Props) {
    const dispatch = useAppDispatch()
    const favoriteItems = useAppSelector((state) => state.favorites.items)
    const navigate = useNavigate()

    const isFavorite =
        place ? favoriteItems.some((item) => item.id === place.id) : false

    return (
        <>
            <div
                className={`sheet-overlay ${place ? 'sheet-overlay--show' : ''}`}
                onClick={onClose}
            />


            <div className={`place-sheet ${place ? 'place-sheet--show' : ''}`}>
                {place && (
                    <>
                        <div className="place-sheet__grabber" />

                        <div className="place-sheet__top-actions">
                            {/* CHAT */}
                            <button
                                type="button"
                                className="place-sheet__icon-btn"
                                aria-label="Chat"
                                onClick={() => {
                                    if (place) {
                                        dispatch(openProviderChat(place))
                                    }
                                }}
                            >
                                <svg viewBox="0 0 24 24" className="icon-stroke" fill="none">
                                    <path
                                        d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className={`place-sheet__icon-btn ${isFavorite ? 'place-sheet__icon-btn--favorite-active' : ''}`}
                                aria-label="Favorite"
                                onClick={() => {
                                    if (place) {
                                        dispatch(toggleFavorite(place))
                                    }
                                }}
                            >
                                <svg viewBox="0 0 24 24" className="icon-fill">
                                    <path d="M12 21s-7-4.35-9.33-8.42C.26 8.38 2.3 4 6.59 4c2.16 0 3.52 1.14 4.2 2.2C11.47 5.14 12.83 4 14.99 4c4.3 0 6.33 4.38 3.92 8.58C19 16.65 12 21 12 21Z" />
                                </svg>
                            </button>

                            {/* CLOSE */}
                            <button
                                type="button"
                                className="place-sheet__close"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="place-sheet__header">
                            {/* <div className="place-sheet__header-text"> */}
                            <div className="place-sheet__meta-row">
                                <div className="place-sheet__category">{place.category}</div>

                                <span
                                    className={`place-sheet__status place-sheet__status--${place.status ?? 'active'}`}
                                >
                                    {place.status === 'busy' ? 'Busy' : 'Active'}
                                </span>

                                <h2 className="place-sheet__title">{place.name}</h2>
                                <p className="place-sheet__address">{place.address}</p>
                                {place.phone ? (
                                    <p className="place-sheet__address">Phone: {place.phone}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="place-sheet__stats">
                            <div className="place-sheet__stat">
                                <span className="place-sheet__stat-label">Rating</span>
                                <strong className="place-sheet__stat-value">4.8 / 5</strong>
                            </div>

                            <div className="place-sheet__stat">
                                <span className="place-sheet__stat-label">Open Hours</span>
                                <strong className="place-sheet__stat-value">11:00 - 23:00</strong>
                            </div>
                        </div>

                        <p className="place-sheet__text">
                            Placeholder content for now. Later we can connect real service data,
                            booking flow, reviews, prices, and provider details.
                        </p>

                        <div className="place-sheet__actions">
                            <button
                                type="button"
                                className="place-sheet__primary"
                                onClick={() => {
                                    if (place) {
                                        onBookNow(place)
                                    }
                                }}
                            >
                                Book Now
                            </button>

                            <button
                                type="button"
                                className="place-sheet__secondary"
                                onClick={() => {
                                    if (place) {
                                        navigate(`/provider/${place.id}`)
                                    }
                                }}
                            >
                                View Profile
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}