import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCG31mPrsmTFzQUI0VzF2tQ-EdKjRvMt4c",
    authDomain: "localservices-3c23c.firebaseapp.com",
    projectId: "localservices-3c23c",
    storageBucket: "localservices-3c23c.firebasestorage.app",
    messagingSenderId: "343784988919",
    appId: "1:343784988919:web:8c98ba0b7b36a2035373f2",
    measurementId: "G-8YQ1JJ5XZ0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const enableAuthPersistence = async (): Promise<void> => {
    await setPersistence(auth, browserLocalPersistence);
};