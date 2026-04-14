import { useMemo } from 'react'
import { acceptBooking, denyBooking } from '../features/home/bookingsSlice'
import { selectAuthUser } from '../features/auth/selectors'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import '../styles/RequestsPage.css'

function formatDateLabel(dateString: string) {
    const date = new Date(dateString)

    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(date)
}

export default function RequestsPage() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectAuthUser)
    const bookings = useAppSelector((state) => state.bookings.items)

    const providerRequests = useMemo(() => {
        if (!user) return []
        return bookings.filter((booking) => booking.providerUid === user.uid)
    }, [bookings, user])

    return (
        <section className="requests-page">
            <div className="requests-page__header">
                <span className="requests-page__eyebrow">Provider</span>
                <h1 className="requests-page__title">Requests</h1>
                <p className="requests-page__text">
                    Review incoming booking requests from users.
                </p>
            </div>

            {providerRequests.length === 0 ? (
                <div className="requests-empty">
                    <h2 className="requests-empty__title">No requests yet</h2>
                    <p className="requests-empty__text">
                        New provider booking requests will appear here.
                    </p>
                </div>
            ) : (
                <div className="requests-list">
                    {providerRequests.map((request) => (
                        <article key={request.id} className="request-card">
                            <div className="request-card__top">
                                <div>
                                    <p className="request-card__date">
                                        {formatDateLabel(request.date)}
                                    </p>
                                    <h2 className="request-card__name">
                                        {request.providerName}
                                    </h2>
                                </div>

                                <span
                                    className={`request-card__status request-card__status--${request.status}`}
                                >
                                    {request.status}
                                </span>
                            </div>

                            <p className="request-card__category">
                                {request.providerCategory}
                            </p>

                            {request.providerImage ? (
                                <img
                                    src={request.providerImage}
                                    alt={request.providerName}
                                    className="request-card__image"
                                />
                            ) : null}

                            {request.status === 'pending' ? (
                                <div className="request-card__actions">
                                    <button
                                        type="button"
                                        className="request-card__accept"
                                        onClick={() => dispatch(acceptBooking(request.id))}
                                    >
                                        Accept
                                    </button>

                                    <button
                                        type="button"
                                        className="request-card__deny"
                                        onClick={() => dispatch(denyBooking(request.id))}
                                    >
                                        Deny
                                    </button>
                                </div>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}