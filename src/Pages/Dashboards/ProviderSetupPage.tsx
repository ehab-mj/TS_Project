import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAuthUser, selectIsAuthenticated } from '../../features/auth/selectors'
import { saveProviderProfile } from '../../features/provider/providerSlice'
import type { ProviderProfile, ServiceCategory } from '../../types/auth'
import './ProviderSetupPage.css'
import { selectProviderProfileByUid } from '../../features/provider/ProSelector'
import { db } from '../../firebase/firebase'

interface FormErrors {
    serviceCategory?: string
    phone?: string
    city?: string
    locationLink?: string
    image?: string
}

const categoryMap: Record<ServiceCategory, string> = {
    electricity: 'electrician',
    plumbing: 'plumber',
    ac: 'ac repair',
    carpentry: 'carpenter',
    cleaning: 'cleaning services',
    painting: 'painting',
    repair: 'repair',
}

function extractLatLngFromGoogleMapsLink(link: string): { lat: number; lng: number } | null {
    const decoded = decodeURIComponent(link)

    const atMatch = decoded.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (atMatch) {
        return {
            lat: Number(atMatch[1]),
            lng: Number(atMatch[2]),
        }
    }

    const qMatch = decoded.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (qMatch) {
        return {
            lat: Number(qMatch[1]),
            lng: Number(qMatch[2]),
        }
    }

    const llMatch = decoded.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (llMatch) {
        return {
            lat: Number(llMatch[1]),
            lng: Number(llMatch[2]),
        }
    }

    return null
}

const initialCoords = null as { lat: number; lng: number } | null

export default function ProviderSetupPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const user = useAppSelector(selectAuthUser)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)

    const existingProfile = useAppSelector(
        user ? selectProviderProfileByUid(user.uid) : () => null
    )

    const initialForm = useMemo<ProviderProfile | null>(() => {
        if (!user) return null

        return (
            existingProfile ?? {
                uid: user.uid,
                serviceCategory: 'electricity',
                phone: '',
                city: '',
                locationLink: '',
                image: '',
                bio: '',
                isAvailable: true,
            }
        )
    }, [existingProfile, user])

    const [formData, setFormData] = useState<ProviderProfile | null>(initialForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSaving, setIsSaving] = useState(false)
    const [locationCoords, setLocationCoords] = useState(initialCoords)
    const [locationMode, setLocationMode] = useState<'none' | 'current' | 'link'>('none')

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login', { replace: true })
            return
        }

        if (user.role !== 'provider') {
            navigate('/guest-dashboard', { replace: true })
        }
    }, [isAuthenticated, navigate, user])

    useEffect(() => {
        setFormData(initialForm)
    }, [initialForm])

    if (!formData || !user) {
        return null
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        if (!formData.serviceCategory) {
            newErrors.serviceCategory = 'Choose a category'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required'
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required'
        }

        if (!formData.image.trim()) {
            newErrors.image = 'Image is required'
        }

        const hasCurrentLocation = locationMode === 'current' && locationCoords
        const hasValidLink =
            locationMode === 'link' &&
            formData.locationLink.trim() &&
            extractLatLngFromGoogleMapsLink(formData.locationLink.trim())

        if (!hasCurrentLocation && !hasValidLink) {
            newErrors.locationLink = 'Use current location or paste a valid Google Maps link'
        }

        return newErrors
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = event.target

        setFormData((prev) => {
            if (!prev) return prev

            if (type === 'checkbox' && 'checked' in event.target) {
                return {
                    ...prev,
                    [name]: event.target.checked,
                }
            }

            return {
                ...prev,
                [name]: value,
            }
        })

        if (name === 'locationLink') {
            const cleanValue = value.trim()
            setLocationMode(cleanValue ? 'link' : 'none')
            setLocationCoords(extractLatLngFromGoogleMapsLink(cleanValue))
        }

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }))
    }

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrors((prev) => ({
                ...prev,
                locationLink: 'Geolocation is not supported on this device',
            }))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }

                setLocationCoords(coords)
                setLocationMode('current')

                setFormData((prev) =>
                    prev
                        ? {
                            ...prev,
                            locationLink: `https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
                        }
                        : prev
                )

                setErrors((prev) => ({
                    ...prev,
                    locationLink: '',
                }))
            },
            () => {
                setErrors((prev) => ({
                    ...prev,
                    locationLink: 'Could not get your current location',
                }))
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const validationErrors = validateForm()
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        const finalCoords =
            locationMode === 'current'
                ? locationCoords
                : extractLatLngFromGoogleMapsLink(formData.locationLink.trim())

        if (!finalCoords) {
            setErrors((prev) => ({
                ...prev,
                locationLink: 'Could not read location from the link',
            }))
            return
        }

        const cleanProfile: ProviderProfile = {
            ...formData,
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            locationLink: formData.locationLink.trim(),
            image: formData.image.trim(),
            bio: formData.bio?.trim() ?? '',
        }

        const providerDoc = {
            uid: user.uid,
            id: Date.now(),
            name: user.displayName?.trim() || 'Provider',
            category: categoryMap[cleanProfile.serviceCategory],
            address: `${cleanProfile.city}, Israel`,
            city: cleanProfile.city,
            lat: finalCoords.lat,
            lng: finalCoords.lng,
            phone: cleanProfile.phone,
            bio: cleanProfile.bio ?? '',
            locationLink: cleanProfile.locationLink,
            image: cleanProfile.image,
            featured: false,
            status: cleanProfile.isAvailable ? 'active' : 'busy',
            isAvailable: cleanProfile.isAvailable,
            serviceCategory: cleanProfile.serviceCategory,
            email: user.email,
        }

        try {
            setIsSaving(true)
            dispatch(saveProviderProfile(cleanProfile))
            await setDoc(doc(db, 'providers', user.uid), providerDoc)
            navigate('/provider-dashboard', { replace: true })
        } catch (error) {
            console.error('Failed to save provider profile:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="provider-setup-page">
            <div className="provider-setup-inner">
                <div className="provider-setup-shell">
                    <section className="provider-setup-hero">
                        <div className="provider-setup-hero__content">
                            <p className="provider-setup-badge">Provider Setup</p>
                            <h1 className="provider-setup-title">Complete your provider profile</h1>
                            <p className="provider-setup-subtitle">
                                Add your service category, city, phone number, location, image, and optional bio.
                            </p>
                        </div>

                        <div className="provider-setup-hero__summary">
                            <div className="provider-summary-card">
                                <span className="provider-summary-card__label">Account</span>
                                <strong>{user.displayName || 'Provider'}</strong>
                            </div>
                            <div className="provider-summary-card">
                                <span className="provider-summary-card__label">Role</span>
                                <strong>{user.role}</strong>
                            </div>
                        </div>
                    </section>

                    <div className="provider-setup-layout">
                        <form className="provider-setup-card" onSubmit={handleSubmit}>
                            <div className="provider-setup-card__header">
                                <h2>Business details</h2>
                                <p>These details will help your profile look complete and trustworthy.</p>
                            </div>

                            <div className="provider-setup-grid">
                                <div className="provider-setup-field provider-setup-field--full">
                                    <label htmlFor="serviceCategory">Service Category</label>
                                    <select
                                        id="serviceCategory"
                                        name="serviceCategory"
                                        value={formData.serviceCategory}
                                        onChange={handleInputChange}
                                    >
                                        <option value="electricity">Electricity</option>
                                        <option value="plumbing">Plumbing</option>
                                        <option value="ac">AC</option>
                                        <option value="carpentry">Carpentry</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="painting">Painting</option>
                                        <option value="repair">Repair</option>
                                    </select>
                                    {errors.serviceCategory ? <p className="field-error">{errors.serviceCategory}</p> : null}
                                </div>

                                <div className="provider-setup-field">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                    {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
                                </div>

                                <div className="provider-setup-field">
                                    <label htmlFor="city">City</label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                    />
                                    {errors.city ? <p className="field-error">{errors.city}</p> : null}
                                </div>

                                <div className="provider-setup-field provider-setup-field--full">
                                    <label htmlFor="image">Business Image</label>
                                    <input
                                        id="image"
                                        name="image"
                                        type="text"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="Paste image URL"
                                    />
                                    {errors.image ? <p className="field-error">{errors.image}</p> : null}
                                </div>

                                <div className="provider-setup-field provider-setup-field--full">
                                    <label htmlFor="locationLink">Business Location</label>

                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <button
                                            type="button"
                                            className="provider-setup-button"
                                            onClick={handleUseCurrentLocation}
                                        >
                                            Use Current Location
                                        </button>
                                    </div>

                                    <input
                                        id="locationLink"
                                        name="locationLink"
                                        type="text"
                                        value={formData.locationLink}
                                        onChange={handleInputChange}
                                        placeholder="Or paste a Google Maps location link"
                                    />

                                    {locationMode === 'current' && locationCoords ? (
                                        <p className="provider-setup-hint">
                                            Current location selected: {locationCoords.lat.toFixed(5)}, {locationCoords.lng.toFixed(5)}
                                        </p>
                                    ) : null}

                                    {errors.locationLink ? <p className="field-error">{errors.locationLink}</p> : null}
                                </div>

                                <div className="provider-setup-field provider-setup-field--full">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={7}
                                        value={formData.bio ?? ''}
                                        onChange={handleInputChange}
                                        placeholder="Optional: write a short description about your experience and service."
                                    />
                                </div>
                            </div>

                            <div className="provider-setup-actions">
                                <label className="provider-setup-checkbox">
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                    />
                                    <span>Available for bookings</span>
                                </label>

                                <button type="submit" className="provider-setup-button" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>

                        <aside className="provider-setup-sidecard">
                            <h3>Profile preview</h3>
                            <div className="provider-preview-row">
                                <span>Category</span>
                                <strong>{formData.serviceCategory}</strong>
                            </div>
                            <div className="provider-preview-row">
                                <span>City</span>
                                <strong>{formData.city || 'Not added yet'}</strong>
                            </div>
                            <div className="provider-preview-row">
                                <span>Phone</span>
                                <strong>{formData.phone || 'Not added yet'}</strong>
                            </div>
                            <div className="provider-preview-row">
                                <span>Image</span>
                                <strong>{formData.image ? 'Added' : 'Not added yet'}</strong>
                            </div>
                            <div className="provider-preview-row">
                                <span>Location</span>
                                <strong>
                                    {locationMode === 'current'
                                        ? 'Current location selected'
                                        : formData.locationLink || 'Not added yet'}
                                </strong>
                            </div>
                            <div className="provider-preview-row">
                                <span>Status</span>
                                <strong className={formData.isAvailable ? 'is-available' : 'is-busy'}>
                                    {formData.isAvailable ? 'Available' : 'Busy'}
                                </strong>
                            </div>

                            <div className="provider-preview-bio">
                                <span>Bio preview</span>
                                <p>{formData.bio || 'Your bio preview will appear here.'}</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}