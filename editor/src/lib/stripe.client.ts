import {firestore, getCurrentUser} from "$lib/firebase.client";
import {addDoc, collection, onSnapshot, query, where, getDocs, type Unsubscribe} from "firebase/firestore";

export async function createCheckoutSession(priceId: string, successUrl?: string, cancelUrl?: string): Promise<string> {
    let checkoutSessionData = {
        price: priceId,
        success_url: successUrl || window.location.origin,
        cancel_url: cancelUrl || window.location.origin
    };

    const user = await getCurrentUser();
    if (!user) {
        throw new Error("not authenticated");
    }

    const checkoutSessionRef = await addDoc(
        collection(firestore, `customers/${user.uid}/checkout_sessions`),
        checkoutSessionData
    );

    let unsub: Unsubscribe | undefined;
    try {
        return await new Promise((resolve, reject) => {
            unsub = onSnapshot(checkoutSessionRef, (snap) => {
                const {error, url} = snap.data() as any;
                if (error) {
                    reject(error);
                }
                if (url) {
                    resolve(url as string);
                }
            });
        });
    } catch (err) {
        console.error(err);
        throw new Error('Create Session Failed', {cause: err});
    } finally {
        if (unsub) {
            unsub();
        }
    }
}

export async function getActiveSubscriptions() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("not authenticated");
    }
    const q = query(
        collection(firestore, 'customers', user.uid, 'subscriptions'),
        where('status', 'in', ['trialing', 'active'])
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}
