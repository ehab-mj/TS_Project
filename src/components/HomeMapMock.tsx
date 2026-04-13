import '../styles/HomeMapMock.css'

type MockPlace = {
    id: number
    name: string
    x: string
    y: string
    featured?: boolean
}

type Props = {
    places: MockPlace[]
    activePlaceId: number | null
    onPinClick: (place: MockPlace) => void
}

export default function HomeMapMock({
    places,
    activePlaceId,
    onPinClick,
}: Props) {
    return (
        <section className="map-mock" aria-label="Map">
            <div className="map-mock__base" />
            <div className="map-mock__grid" />
            <div className="map-mock__roads map-mock__roads--one" />
            <div className="map-mock__roads map-mock__roads--two" />
            <div className="map-mock__roads map-mock__roads--three" />
            <div className="map-mock__roads map-mock__roads--four" />

            <div className="map-mock__labels">
                <span className="label label-1">Lakewood</span>
                <span className="label label-2">Carson Park</span>
                <span className="label label-3">Rossmoor</span>
                <span className="label label-4">Seal Beach</span>
                <span className="label label-5">Cypress</span>
                <span className="label label-6">Los Altos</span>
            </div>

            {places.map((place) => {
                const isActive = place.id === activePlaceId

                return (
                    <button
                        key={place.id}
                        type="button"
                        className={`map-pin ${isActive ? 'map-pin--active' : ''}`}
                        style={{ left: place.x, top: place.y }}
                        onClick={() => onPinClick(place)}
                        aria-label={place.name}
                    >
                        <span className="map-pin__dot" />
                    </button>
                )
            })}
        </section>
    )
}