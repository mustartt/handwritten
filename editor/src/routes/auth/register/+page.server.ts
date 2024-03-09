import {superValidate} from 'sveltekit-superforms/server';
import {zod} from 'sveltekit-superforms/adapters';
import {fail, redirect} from '@sveltejs/kit';
import {registerStepSchema2} from "$lib/schemas/auth";
import {} from "firebase-admin/auth";
import {getFirebaseApp, getFirebaseAuth} from "$lib/firebase.server";

export const load = async () => {
    const form = await superValidate(zod(registerStepSchema2));
    return {form};
};

export const actions = {
    default: async ({request}) => {
        const form = await superValidate(request, zod(registerStepSchema2));
        if (!form.valid) return fail(400, {form});

        const data = form.data;

        try {
            await getFirebaseAuth().createUser({
                displayName: data.name,
                email: data.email,
                password: data.password,
                emailVerified: false,
                disabled: false,
            });

            return redirect(303, '/auth/login');
        } catch (err) {
            console.error(err);
            return fail(400, {form});
        }
    }
};
