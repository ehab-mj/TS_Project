import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth'
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import type { AppUser, LoginFormData, RegisterFormData } from '../types/auth'

interface FirestoreUserDoc {
    uid: string
    email: string
    displayName: string
    role: 'guest' | 'provider'
    createdAt: unknown
}

export const registerUserService = async (
    formData: RegisterFormData
): Promise<AppUser> => {
    const { email, password, displayName, role } = formData

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = credential.user

    await updateProfile(firebaseUser, {
        displayName,
    })

    const userDoc: FirestoreUserDoc = {
        uid: firebaseUser.uid,
        email,
        displayName,
        role,
        createdAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', firebaseUser.uid), userDoc)

    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? email,
        displayName,
        role,
    }
}

export const loginUserService = async (
    formData: LoginFormData
): Promise<AppUser> => {
    const { email, password } = formData

    const credential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = credential.user

    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)
    const data = userSnap.data() as Omit<FirestoreUserDoc, 'createdAt'> | undefined

    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? data?.displayName ?? '',
        role: data?.role ?? 'guest',
    }
}

export const logoutUserService = async (): Promise<void> => {
    await signOut(auth)
}