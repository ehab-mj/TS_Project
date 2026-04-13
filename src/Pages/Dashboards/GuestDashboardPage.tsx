import { useAppSelector } from '../../app/hooks'
import { selectAuthUser } from '../../features/auth/selectors'
import '../../styles/ProfilePage.css'

export default function GuestDashboardPage() {
  const user = useAppSelector(selectAuthUser)

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-card__top">
          <div className="profile-card__avatar">{user?.displayName?.slice(0, 2).toUpperCase() || 'GU'}</div>
          <div className="profile-card__identity">
            <h1 className="profile-card__name">{user?.displayName ?? 'Guest User'}</h1>
            <p className="profile-card__email">{user?.email ?? 'guest@example.com'}</p>
          </div>
        </div>

        <div className="profile-card__details">
          <article className="profile-detail">
            <div className="profile-detail__left">
              <div className="profile-detail__text">
                <span className="profile-detail__label">Dashboard Type</span>
                <strong className="profile-detail__value">Guest Dashboard</strong>
              </div>
            </div>
          </article>
          <article className="profile-detail">
            <div className="profile-detail__left">
              <div className="profile-detail__text">
                <span className="profile-detail__label">Role</span>
                <strong className="profile-detail__value">{user?.role ?? 'guest'}</strong>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
