import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
    setPlaces,
    setSearch,
    setSelectedPlace,
    setUserLocation,
    type Place,
} from '../features/home/homeSlice'
import SearchHeader from '../components/SearchHeader'
import CategoryFilterBar from '../components/CategoryFilterBar'
import RealMap from '../components/RealMap'
import PlaceBottomSheet from '../components/PlaceBottomSheet'
import '../styles/HomeScreen.css'
import { addBooking } from '../features/home/bookingsSlice'
import BookingDaySheet from '../components/BookingDaySheet'
import { getProviders } from '../services/ProvidersService'

export default function HomeScreen() {
    const dispatch = useAppDispatch()
    const { places, selectedPlace, search, userLocation, selectedCategory } = useAppSelector(
        (state) => state.home,
    )
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
    const [bookingPlace, setBookingPlace] = useState<Place | null>(null)

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const firebaseProviders = await getProviders()

                if (!navigator.geolocation) {
                    dispatch(setUserLocation({ lat: 32.923, lng: 35.081 }))
                    dispatch(setPlaces(firebaseProviders))
                    return
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude
                        const lng = position.coords.longitude

                        dispatch(setUserLocation({ lat, lng }))
                        dispatch(setPlaces(firebaseProviders))
                    },
                    (error) => {
                        console.error('Location error:', error.message)

                        dispatch(setUserLocation({ lat: 32.923, lng: 35.081 }))
                        dispatch(setPlaces(firebaseProviders))
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    },
                )
            } catch (error) {
                console.error('Failed to load providers:', error)
            }
        }

        loadProviders()
    }, [dispatch])

    const filteredPlaces = useMemo(() => {
        const q = search.trim().toLowerCase()

        return places.filter((place) => {
            const placeCategory = String(place.category ?? '').toLowerCase()

            const matchesCategory =
                selectedCategory === 'all' || placeCategory === selectedCategory

            const matchesSearch =
                !q ||
                place.name.toLowerCase().includes(q) ||
                placeCategory.includes(q) ||
                String(place.address ?? '').toLowerCase().includes(q)

            return matchesCategory && matchesSearch
        })
    }, [places, search, selectedCategory])

    const focusCurrentLocation = async () => {
        if (!navigator.geolocation) return

        try {
            const firebaseProviders = await getProviders()

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude

                    dispatch(setUserLocation({ lat, lng }))
                    dispatch(setPlaces(firebaseProviders))
                },
                (error) => {
                    console.error('Location error:', error.message)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                },
            )
        } catch (error) {
            console.error('Failed to refresh providers:', error)
        }
    }

    const handleConfirmBooking = (date: string, place: Place) => {
        dispatch(
            addBooking({
                id: Date.now(),
                date,
                providerId: place.id,
                providerUid: place.uid ?? '',
                providerName: place.name,
                providerCategory: place.category,
                providerImage: place.image,
                providerStatus: place.status,
                status: 'pending',
            })
        )

        setBookingPlace(null)
        dispatch(setSelectedPlace(null))
    }

    return (
        <main className="home-screen">
            <div className="home-screen__bg-glow" />
            <div className="home-screen__overlay" />

            <div className="home-screen__desktop-shell">
                <SearchHeader
                    value={search}
                    onChange={(value) => dispatch(setSearch(value))}
                    selectedCategory={selectedCategory}
                    onOpenCategories={() => setIsMobileCategoriesOpen(true)}
                />

                <CategoryFilterBar
                    mobileOpen={isMobileCategoriesOpen}
                    onCloseMobile={() => setIsMobileCategoriesOpen(false)}
                />

                <RealMap
                    places={filteredPlaces}
                    userLocation={userLocation}
                    activePlaceId={selectedPlace?.id ?? null}
                    onMarkerClick={(place) => dispatch(setSelectedPlace(place))}
                />

                <button
                    type="button"
                    className="target-button"
                    aria-label="Go to current location"
                    onClick={focusCurrentLocation}
                >
                    <svg viewBox="0 0 24 24" className="icon-stroke" fill="none">
                        <path
                            d="M12 4v2M12 18v2M4 12h2M18 12h2M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7ZM12 6.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <BookingDaySheet
                place={bookingPlace}
                onClose={() => setBookingPlace(null)}
                onConfirm={handleConfirmBooking}
            />

            <PlaceBottomSheet
                place={selectedPlace}
                onClose={() => dispatch(setSelectedPlace(null))}
                onBookNow={(place) => setBookingPlace(place)}
            />
        </main>
    )
}