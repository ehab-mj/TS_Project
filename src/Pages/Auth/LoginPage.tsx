import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearAuthError, loginUser } from '../../features/auth/authSlice'
import { selectAuthError, selectAuthLoading } from '../../features/auth/selectors'
import type { LoginFormData } from '../../types/auth'
import '../../styles/AuthPage.css'

const initialForm: LoginFormData = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector(selectAuthLoading)
  const authError = useAppSelector(selectAuthError)
  const [formData, setFormData] = useState<LoginFormData>(initialForm)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(clearAuthError())
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    const resultAction = await dispatch(loginUser(formData))

    if ((resultAction as any).type === 'auth/loginUser/fulfilled') {
      navigate('/profile', { replace: true })
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="auth-card__eyebrow">Smart Local Services</span>
        <h1 className="auth-card__title">Login</h1>
        <p className="auth-card__subtitle">Welcome back. Continue to your dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          />

          {(error || authError) && <p className="auth-error">{error || authError}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-card__footer">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  )
}
