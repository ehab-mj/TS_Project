import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser, UserRole } from '../types/auth';

interface FirestoreUserDoc {
    uid: string;
    email: string;
    displayName: string | null;
    role: UserRole;
    createdAt?: unknown;
}

export const createUserProfile = async (user: AppUser): Promise<void> => {
    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: serverTimestamp(),
    });
};

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    const snap = await getDoc(doc(db, 'users', uid));

    if (!snap.exists()) {
        return null;
    }

    const data = snap.data() as FirestoreUserDoc;

    return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName ?? null,
        role: data.role,
    };
};