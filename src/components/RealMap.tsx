import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import L, { type LatLngTuple } from 'leaflet'
import type { Place } from '../features/home/homeSlice'
import '../styles/RealMap.css'

type Props = {
    places: Place[]
    userLocation: { lat: number; lng: number } | null
    activePlaceId: number | null
    onMarkerClick: (place: Place) => void
}

type RecenterMapProps = {
    userLocation: { lat: number; lng: number } | null
}

function RecenterMap({ userLocation }: RecenterMapProps) {
    const map = useMap()

    useEffect(() => {
        if (!userLocation) return

        map.setView([userLocation.lat, userLocation.lng], 14, {
            animate: true,
        })
    }, [userLocation, map])

    return null
}

export function getCategoryIcon(category: string) {
    const value = category.toLowerCase()

    if (value.includes('plumb')) return '/icons/water-tap.png'
    if (value.includes('electric')) return '/icons/electric.png'
    if (value.includes('ac')) return '/icons/ac.png'
    if (value.includes('carp')) return '/icons/saw.png'
    if (value.includes('repair')) return '/icons/repair.png'
    if (value.includes('clean')) return '/icons/clean.png'
    if (value.includes('paint')) return '/icons/paint.png'
    if (value.includes('lock')) return '/icons/locksmith.png'

    return '/icons/placeholder.png'
}

function createServiceMarkerIcon(category: string, isActive: boolean) {
    const icon = getCategoryIcon(category)

    return L.divIcon({
        className: 'custom-service-marker',
        html: `
            <div class="service-marker-badge ${isActive ? 'service-marker-badge--active' : ''}">
                <img src="${icon}" class="service-marker-badge__image" alt="" />
            </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
    })
}

export default function RealMap({
    places,
    userLocation,
    activePlaceId,
    onMarkerClick,
}: Props) {
    const defaultCenter: LatLngTuple = [32.9285, 35.0827]

    const userLocationIcon = useMemo(
        () =>
            L.divIcon({
                className: 'custom-user-location-marker',
                html: `
                    <div class="user-location-marker">
                        <div class="user-location-marker__pulse"></div>
                        <div class="user-location-marker__dot"></div>
                    </div>
                `,
                iconSize: [26, 26],
                iconAnchor: [13, 13],
            }),
        [],
    )

    return (
        <div className="real-map-wrapper">
            <MapContainer
                center={defaultCenter}
                zoom={15}
                minZoom={10}
                zoomControl={false}
                attributionControl={false}
                className="real-map"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                />

                <ZoomControl position="bottomright" />
                <RecenterMap userLocation={userLocation} />

                {places.map((place) => {
                    const isActive = place.id === activePlaceId
                    const markerPosition: LatLngTuple = [place.lat, place.lng]

                    return (
                        <Marker
                            key={place.id}
                            position={markerPosition}
                            icon={createServiceMarkerIcon(place.category, isActive)}
                            eventHandlers={{
                                click: () => onMarkerClick(place),
                            }}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -28]}
                                opacity={1}
                                className="service-tooltip"
                            >
                                <div className="service-tooltip-card">
                                    {place.image && (
                                        <img
                                            src={place.image}
                                            alt={place.name}
                                            className="service-tooltip-card__image"
                                        />
                                    )}

                                    <div className="service-tooltip-card__content">
                                        <p className="service-tooltip-card__category">{place.category}</p>
                                        <h3 className="service-tooltip-card__title">{place.name}</h3>
                                        <p className="service-tooltip-card__address">{place.address}</p>
                                    </div>
                                </div>
                            </Tooltip>
                        </Marker>
                    )
                })}

                {userLocation && (
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={userLocationIcon}
                    >
                        <Tooltip
                            direction="top"
                            offset={[0, -18]}
                            opacity={1}
                            className="service-tooltip"
                        >
                            <div className="service-tooltip-card service-tooltip-card--user">
                                <div className="service-tooltip-card__content">
                                    <p className="service-tooltip-card__category">Current Location</p>
                                    <h3 className="service-tooltip-card__title">You are here</h3>
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}