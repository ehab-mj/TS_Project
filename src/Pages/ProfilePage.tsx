import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import {
    selectAuthInitialized,
    selectAuthUser,
    selectIsAuthenticated,
} from '../features/auth/selectors'

const ProfilePage = () => {
    const initialized = useAppSelector(selectAuthInitialized)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const user = useAppSelector(selectAuthUser)

    if (!initialized) {
        return <div style={{ color: 'white', padding: '24px' }}>Loading profile...</div>
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    if (user.role === 'provider') {
        return <Navigate to="/provider-dashboard" replace />
    }

    return <Navigate to="/guest-dashboard" replace />
}

export default ProfilePage