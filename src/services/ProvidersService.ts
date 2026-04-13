import { collection, getDocs } from 'firebase/firestore'
import type { Place } from '../features/home/homeSlice'
import { db } from '../firebase/firebase'

export async function getProviders(): Promise<Place[]> {
    const snapshot = await getDocs(collection(db, 'providers'))

    const providers: Place[] = snapshot.docs.map((doc, index) => {
        const data = doc.data() as Record<string, unknown>

        const status: 'active' | 'busy' =
            data.status === 'busy' ? 'busy' : 'active'

        const city = typeof data.city === 'string' ? data.city : ''

        return {
            id: typeof data.id === 'number' ? data.id : index + 1,
            uid: typeof data.uid === 'string' ? data.uid : '',
            name: typeof data.name === 'string' ? data.name : 'Unknown Provider',
            category:
                typeof data.category === 'string' ? data.category : 'maintenance',
            address:
                typeof data.address === 'string'
                    ? data.address
                    : city
                        ? `${city}, Israel`
                        : 'No address',
            lat: typeof data.lat === 'number' ? data.lat : 32.923,
            lng: typeof data.lng === 'number' ? data.lng : 35.081,
            image: typeof data.image === 'string' ? data.image : '',
            featured:
                typeof data.featured === 'boolean' ? data.featured : false,
            status,
            phone: typeof data.phone === 'string' ? data.phone : '',
            bio: typeof data.bio === 'string' ? data.bio : '',
            city,
            locationLink: typeof data.locationLink === 'string' ? data.locationLink : '',
        }
    })

    return providers
}