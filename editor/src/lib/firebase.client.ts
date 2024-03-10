import {initializeApp} from "firebase/app";
import {getAnalytics, type Analytics} from "firebase/analytics";
import {connectAuthEmulator, getAuth, type Auth, type User, onAuthStateChanged, type Unsubscribe} from 'firebase/auth';
import type {FirebaseApp} from 'firebase/app';
import {connectStorageEmulator, getStorage, type FirebaseStorage} from 'firebase/storage';
import {connectFirestoreEmulator, getFirestore, type Firestore} from 'firebase/firestore';
import {connectFunctionsEmulator, getFunctions, type Functions} from 'firebase/functions';
import {browser} from "$app/environment";

const firebaseConfig = {
    apiKey: "AIzaSyB_G6IAcmY84x-ynDP4C_eloi71O3Nxd5M",
    authDomain: "hand-written-prod.firebaseapp.com",
    projectId: "hand-written-prod",
    storageBucket: "hand-written-prod.appspot.com",
    messagingSenderId: "38157552520",
    appId: "1:38157552520:web:d9ddb9ab42fbeae7f4483d",
    measurementId: "G-RFBS1HHTP5",
    useEmulator: false
};

export let app: FirebaseApp;
export let auth: Auth;
export let analytics: Analytics;
export let firestore: Firestore;
export let storage: FirebaseStorage;
export let functions: Functions;


export function initializeFirebase() {
    if (!browser) {
        throw new Error("Can't use the Firebase client on the server.");
    }
    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        analytics = getAnalytics(app);
        firestore = getFirestore(app);
        storage = getStorage(app);
        functions = getFunctions(app);

        if (firebaseConfig.useEmulator) {
            connectAuthEmulator(auth, "http://127.0.0.1:9099");
            connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
            connectStorageEmulator(storage, "127.0.0.1", 9199);
            connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        }
    }
}

export async function getCurrentUser() {
    let unsub: Unsubscribe;
    const result = await new Promise((resolve) => {
        unsub = onAuthStateChanged(auth, (user) => {
            resolve(user);
        })
    });
    if (unsub!) {
        unsub();
    }
    return result as User | null;
}