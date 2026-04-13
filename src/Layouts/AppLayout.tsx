import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import '../styles/AppLayout.css'
import ChatPanel from '../components/ChatPanel'

export default function AppLayout() {
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    return (
        <main className={`app-layout ${isHomePage ? 'app-layout--home' : ''}`}>
            <div className="app-layout__content">
                <Outlet />
            </div>

            <BottomNav />
            <ChatPanel />
        </main>
    )
}