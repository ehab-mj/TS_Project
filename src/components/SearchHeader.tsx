import '../styles/SearchHeader.css'
import type { PlaceCategory } from '../features/home/homeSlice'
import Logo from '../../public/icons/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { selectAuthUser, selectIsAuthenticated } from '../features/auth/selectors'

type Props = {
    value: string
    onChange: (value: string) => void
    selectedCategory: PlaceCategory
    onOpenCategories: () => void
}

export default function SearchHeader({
    value,
    onChange,
    selectedCategory,
    onOpenCategories,
}: Props) {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const user = useAppSelector(selectAuthUser)

    const handleAuthClick = () => {
        if (isAuthenticated) {
            dispatch(logout())
            navigate('/', { replace: true })
            return
        }

        navigate('/register')
    }

    return (
        <div className="search-header">
            <div className="search-header__desktop-left">
                <div className="search-header__brand">
                    <img src={Logo} alt="Smart Services" className="search-header__logo" />
                </div>

                <div className="search-header__actions">
                    <button
                        className="search-header__chat"
                        aria-label="Chats"
                        type="button"
                        onClick={() => navigate('/chats')}
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

                    <button className="search-header__notify" aria-label="Notifications" type="button">
                        <svg viewBox="0 0 24 24" className="icon-fill">
                            <path d="M12 22a2.7 2.7 0 0 0 2.5-2h-5A2.7 2.7 0 0 0 12 22Zm7-4v-1l-2-2v-4a5 5 0 1 0-10 0v4l-2 2v1h14Z" />
                        </svg>
                    </button>

                    <div className="search-header__right">
                        <button
                            type="button"
                            className={`search-header__em-btn ${isAuthenticated ? 'is-logout' : 'is-register'}`}
                            onClick={handleAuthClick}
                            aria-label={isAuthenticated ? 'Logout' : 'Register'}
                            title={isAuthenticated ? 'Logout' : 'Register'}
                        >
                            {isAuthenticated ? (
                                <>
                                    <svg
                                        className="search-header__icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <path d="M16 17l5-5-5-5" />
                                        <path d="M21 12H9" />
                                    </svg>
                                    <span>Logout</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="search-header__icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </svg>
                                    <span>EM</span>
                                </>
                            )}
                        </button>

                        {isAuthenticated && user ? (
                            <Link to="/profile" className="search-header__profile-link">
                                {user.displayName || 'Profile'}
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="search-header__desktop-center">
                <div className="search-box">
                    <div className="search-box__icon">
                        <svg viewBox="0 0 24 24" className="icon-stroke" fill="none">
                            <path
                                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Search services, categories, or nearby places"
                        className="search-box__input"
                    />

                    <button
                        className="search-box__filter"
                        aria-label="Open categories"
                        type="button"
                        onClick={onOpenCategories}
                    >
                        <svg viewBox="0 0 24 24" className="icon-stroke" fill="none">
                            <path
                                d="M4 6h8M16 6h4M10 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM4 12h4M12 12h8M18 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM4 18h10M18 18h2M14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="search-header__mobile-category">
                <span className="search-header__mobile-category-label">Category:</span>
                <span className="search-header__mobile-category-value">{selectedCategory}</span>
            </div>
        </div>
    )
}
