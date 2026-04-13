import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { selectAuthInitialized, selectIsAuthenticated } from '../features/auth/selectors'
import { useAppSelector } from '../app/hooks'

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const initialized = useAppSelector(selectAuthInitialized)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)

    if (!initialized) {
        return <div style={{ color: 'white', padding: '24px' }}>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute