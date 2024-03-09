import {derived, writable} from 'svelte/store';


export interface User {
    name: string;
    userID: string;
    picture: string;
    email: string;
}

export interface SessionState {
    isLoading: boolean;
    user: User | null;
}

export const session = writable<SessionState>({
    isLoading: true,
    user: null
});
export const user = derived(session, ($store) => $store.user);
