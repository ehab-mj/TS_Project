import { Navigate, Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectAuthUser } from '../../features/auth/selectors'
import { selectProviderProfileByUid } from '../../features/provider/ProSelector'
import './ProviderDashboardPage.css'

const ProviderDashboardPage = () => {
  const user = useAppSelector(selectAuthUser)
  const profile = useAppSelector(
    user ? selectProviderProfileByUid(user.uid) : () => null
  )

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile) {
    return <Navigate to="/provider-setup" replace />
  }

  return (
    <div className="provider-dashboard-page">
      <div className="provider-dashboard-shell">
        <div className="provider-dashboard-inner">
          <section className="provider-dashboard-hero">
            <div className="provider-dashboard-hero__content">
              <p className="provider-dashboard-eyebrow">Provider Account</p>
              <h1 className="provider-dashboard-title">
                Welcome back, {user.displayName || 'Provider'}
              </h1>
              <p className="provider-dashboard-subtitle">
                Manage your profile details, service information, and availability from one clean place.
              </p>
            </div>

            <div className="provider-dashboard-hero__actions">
              <Link to="/provider-setup" className="provider-dashboard-edit-btn">
                Edit Profile
              </Link>
            </div>
          </section>

          <section className="provider-dashboard-stats">
            <article className="provider-stat-card provider-stat-card--accent">
              <span className="provider-stat-card__label">Service Category</span>
              <strong className="provider-stat-card__value">{profile.serviceCategory}</strong>
            </article>

            <article className="provider-stat-card">
              <span className="provider-stat-card__label">City</span>
              <strong className="provider-stat-card__value">{profile.city}</strong>
            </article>

            <article className="provider-stat-card">
              <span className="provider-stat-card__label">Phone</span>
              <strong className="provider-stat-card__value">{profile.phone}</strong>
            </article>

            <article className="provider-stat-card">
              <span className="provider-stat-card__label">Availability</span>
              <strong
                className={`provider-stat-card__value ${profile.isAvailable ? 'is-available' : 'is-busy'
                  }`}
              >
                {profile.isAvailable ? 'Available' : 'Busy'}
              </strong>
            </article>
          </section>

          <section className="provider-dashboard-main">
            <article className="provider-panel provider-panel--bio">
              <div className="provider-panel__header">
                <h2>About your service</h2>
              </div>
              <p className="provider-panel__bio">{profile.bio}</p>
            </article>

            <aside className="provider-panel provider-panel--summary">
              <div className="provider-panel__header">
                <h2>Quick summary</h2>
              </div>

              <div className="provider-summary-list">
                <div className="provider-summary-item">
                  <span>Profile owner</span>
                  <strong>{user.displayName || 'Provider'}</strong>
                </div>

                <div className="provider-summary-item">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="provider-summary-item">
                  <span>Role</span>
                  <strong>{user.role}</strong>
                </div>

                <div className="provider-summary-item">
                  <span>Status</span>
                  <strong className={profile.isAvailable ? 'is-available' : 'is-busy'}>
                    {profile.isAvailable ? 'Available for bookings' : 'Currently busy'}
                  </strong>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboardPage