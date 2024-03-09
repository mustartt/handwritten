import {initializeFirebase} from '$lib/firebase.client';
import {browser} from '$app/environment';

/** @type {import('./$types').LayoutLoad} */
export function load({url}) {
    if (browser) {
        try {
            initializeFirebase();
        } catch (ex) {
            console.error(ex);
        }
    }

    return {
        url: url.pathname
    };
}
