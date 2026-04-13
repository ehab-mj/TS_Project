import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import '../Pages/Dashboards/ProviderDashboardPage.css'
import { useAppSelector } from '../app/hooks'

export default function ProviderProfilePage() {
    const { id } = useParams()
    const places = useAppSelector((state) => state.home.places)

    const provider = useMemo(
        () => places.find((p) => String(p.id) === String(id)),
        [places, id]
    )

    if (!provider) {
        return <div style={{ padding: 20 }}>Provider not found</div>
    }

    return (
        <section className="provider-dashboard-page">
            <div className="provider-dashboard-shell">
                <div className="provider-dashboard-inner">

                    {/* HERO */}
                    <div className="provider-dashboard-hero">
                        <div className="provider-dashboard-hero__content">
                            <p className="provider-dashboard-eyebrow">Provider Profile</p>
                            <h1 className="provider-dashboard-title">{provider.name}</h1>
                            <p className="provider-dashboard-subtitle">
                                {provider.category}
                            </p>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="provider-dashboard-stats">
                        <div className="provider-stat-card">
                            <span className="provider-stat-card__label">Status</span>
                            <span className={`provider-stat-card__value ${provider.status === 'busy' ? 'is-busy' : 'is-available'}`}>
                                {provider.status === 'busy' ? 'Busy' : 'Active'}
                            </span>
                        </div>

                        <div className="provider-stat-card">
                            <span className="provider-stat-card__label">City</span>
                            <span className="provider-stat-card__value">
                                {provider.city || 'N/A'}
                            </span>
                        </div>

                        <div className="provider-stat-card">
                            <span className="provider-stat-card__label">Phone</span>
                            <span className="provider-stat-card__value">
                                {provider.phone || 'Not provided'}
                            </span>
                        </div>

                        <div className="provider-stat-card provider-stat-card--accent">
                            <span className="provider-stat-card__label">Category</span>
                            <span className="provider-stat-card__value">
                                {provider.category}
                            </span>
                        </div>
                    </div>

                    {/* MAIN */}
                    <div className="provider-dashboard-main">

                        {/* BIO */}
                        <div className="provider-panel provider-panel--bio">
                            <div className="provider-panel__header">
                                <h2>About</h2>
                            </div>
                            <p className="provider-panel__bio">
                                {provider.bio || 'No bio available yet.'}
                            </p>
                        </div>

                        {/* DETAILS */}
                        <div className="provider-panel">
                            <div className="provider-panel__header">
                                <h2>Details</h2>
                            </div>

                            <div className="provider-summary-list">
                                <div className="provider-summary-item">
                                    <span>Address</span>
                                    <strong>{provider.address}</strong>
                                </div>

                                {provider.locationLink && (
                                    <div className="provider-summary-item">
                                        <span>Location</span>
                                        <a
                                            href={provider.locationLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: '#c0203e' }}
                                        >
                                            Open in Google Maps
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}