import {applicationDefault, initializeApp} from "firebase-admin/app";
import type {App} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

let app: App | null = null;

export function getFirebaseApp() {
    if (!app) {
        app = initializeApp();
    }
    return app;
}

export function getFirebaseAuth() {
    return getAuth(getFirebaseApp());
}
