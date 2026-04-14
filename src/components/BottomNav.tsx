import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../app/hooks'
import { selectAuthUser } from '../features/auth/selectors'
import '../styles/BottomNav.css'

type NavItem = {
    id: string
    label: string
    to: string
    icon: ReactNode
}

export default function BottomNav() {
    const user = useAppSelector(selectAuthUser)

    const middleItem: NavItem = {
        id: 'calendar',
        label: user?.role === 'provider' ? 'Requests' : 'Calendar',
        to: user?.role === 'provider' ? '/provider-requests' : '/calendar',
        icon: (
            <svg viewBox="0 0 24 24" className="icon-stroke bottom-nav__svg" fill="none" aria-hidden="true">
                <path
                    d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    }

    const navItems: NavItem[] = [
        {
            id: 'home',
            label: 'Home',
            to: '/',
            icon: (
                <svg viewBox="0 0 24 24" className="icon-fill bottom-nav__svg" aria-hidden="true">
                    <path d="M12 3.8 3.5 10.5V20h6v-5h5v5h6v-9.5L12 3.8Z" />
                </svg>
            ),
        },
        middleItem,
        {
            id: 'favorites',
            label: 'Favorites',
            to: '/favorites',
            icon: (
                <svg viewBox="0 0 24 24" className="icon-fill bottom-nav__svg" aria-hidden="true">
                    <path d="M12 21s-7-4.35-9.33-8.42C.26 8.3 2.1 4 6.17 4c2.12 0 3.34 1.15 4.09 2.24C11.01 5.15 12.23 4 14.35 4c4.07 0 5.91 4.3 3.5 8.58C19 16.65 12 21 12 21Z" />
                </svg>
            ),
        },
        {
            id: 'profile',
            label: 'Profile',
            to: '/profile',
            icon: (
                <svg viewBox="0 0 24 24" className="icon-fill bottom-nav__svg" aria-hidden="true">
                    <path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.5 0-8 2.16-8 5v1h16v-1c0-2.84-3.5-5-8-5Z" />
                </svg>
            ),
        },
    ]

    return (
        <nav className="bottom-nav" aria-label="Primary">
            <div className="bottom-nav__brand">
                <div className="bottom-nav__brand-mark">S</div>
                <div className="bottom-nav__brand-text">
                    <strong>Smart Services</strong>
                    <span>Local help nearby</span>
                </div>
            </div>

            <div className="bottom-nav__list">
                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.to}
                        className={({ isActive }) =>
                            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
                        }
                    >
                        <span className="bottom-nav__icon">{item.icon}</span>
                        <span className="bottom-nav__label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}