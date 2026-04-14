import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { readSession, restoreSession } from '../features/auth/authSlice'
import { selectAuthInitialized } from '../features/auth/selectors'

interface Props {
    children: ReactNode
}

const AuthInitializer = ({ children }: Props) => {
    const dispatch = useAppDispatch()
    const initialized = useAppSelector(selectAuthInitialized)

    useEffect(() => {
        const user = readSession()
        dispatch(restoreSession(user))
    }, [dispatch])

    if (!initialized) {
        return <div style={{ color: 'white', padding: '24px' }}>Loading...</div>
    }

    return <>{children}</>
}

export default AuthInitializer