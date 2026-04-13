import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearAuthError } from '../../features/auth/authSlice'
import { selectAuthError, selectAuthLoading } from '../../features/auth/selectors'
import type { RegisterFormData } from '../../types/auth'
import '../../styles/AuthPage.css'
import { registerUser } from '../../features/auth/authThunks'

const initialForm: RegisterFormData = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'guest',
}

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector(selectAuthLoading)
  const authError = useAppSelector(selectAuthError)
  const [formData, setFormData] = useState<RegisterFormData>(initialForm)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(clearAuthError())
    setError('')

    if (!formData.displayName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill all fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const didRegister = dispatch(registerUser(formData) as never)
    if (didRegister) {
      navigate('/profile', { replace: true })
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="auth-card__eyebrow">Smart Local Services</span>
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Register as a guest or provider.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            placeholder="Display name"
            value={formData.displayName}
            onChange={(event) => setFormData((prev) => ({ ...prev, displayName: event.target.value }))}
          />
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          />
          <select
            className="auth-input"
            value={formData.role}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, role: event.target.value as RegisterFormData['role'] }))
            }
          >
            <option value="guest">Guest</option>
            <option value="provider">Provider</option>
          </select>
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          />

          {(error || authError) && <p className="auth-error">{error || authError}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  )
}
