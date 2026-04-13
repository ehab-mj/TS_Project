import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import type { Place } from '../features/home/homeSlice'
import PlaceBottomSheet from '../components/PlaceBottomSheet'
import '../styles/FavoritesPage.css'
import { getCategoryIcon } from '../components/RealMap'
import { removeFavorite } from '../features/home/favoritesSlice'

getCategoryIcon

export default function FavoritesPage() {
    const dispatch = useAppDispatch()
    const favoriteItems = useAppSelector((state) => state.favorites.items)
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

    return (
        <section className="favorites-page">
            <div className="favorites-page__header">
                <span className="favorites-page__eyebrow">Favorites</span>
                <h1 className="favorites-page__title">Saved providers</h1>
                <p className="favorites-page__text">
                    Quick access to your favorite service providers.
                </p>
            </div>

            {favoriteItems.length === 0 ? (
                <div className="favorites-empty">
                    <div className="favorites-empty__icon">♥</div>
                    <h2 className="favorites-empty__title">No favorites yet</h2>
                    <p className="favorites-empty__text">
                        Save providers from the map or service card and they will appear here.
                    </p>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favoriteItems.map((item) => (
                        <article
                            key={item.id}
                            className="favorite-card"
                            onClick={() => setSelectedPlace(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setSelectedPlace(item)
                                }
                            }}
                        >
                            <div className="favorite-card__top">
                                <div className="favorite-card__category-icon-wrap">
                                    <img
                                        src={getCategoryIcon(item.category)}
                                        alt={item.category}
                                        className="favorite-card__category-icon"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="favorite-card__remove"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(removeFavorite(item.id))
                                    }}
                                    aria-label={`Remove ${item.name} from favorites`}
                                >
                                    ✕
                                </button>
                            </div>

                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="favorite-card__image"
                                />
                            )}

                            <div className="favorite-card__content">
                                <p className="favorite-card__category">{item.category}</p>
                                <h2 className="favorite-card__title">{item.name}</h2>
                                <p className="favorite-card__address">{item.address}</p>

                                <div className="favorite-card__bottom">
                                    <span
                                        className={`favorite-card__status favorite-card__status--${item.status ?? 'active'}`}
                                    >
                                        {item.status === 'busy' ? 'Busy' : 'Active'}
                                    </span>

                                    <button
                                        type="button"
                                        className="favorite-card__button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedPlace(item)
                                        }}
                                    >
                                        View Provider
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <PlaceBottomSheet
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
                onBookNow={() => { }}
            />
        </section>
    )
}