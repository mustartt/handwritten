<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import {superForm, defaults} from "sveltekit-superforms";
    import {Input} from "$lib/components/ui/input";
    import {signInWithEmailAndPassword} from 'firebase/auth';

    import {
        loginSchema,
    } from "$lib/schemas/auth";
    import {zod} from "sveltekit-superforms/adapters";
    import {auth} from "$lib/firebase.client";
    import {goto} from "$app/navigation";

    const form = superForm(defaults(zod(loginSchema)), {
        SPA: true,
        validators: zod(loginSchema),
        validationMethod: 'auto',
        async onSubmit(data) {
            const result = await validateForm({update: true});
            if (result.valid) {
                const {email, password} = result.data;
                await signInWithEmailAndPassword(auth, email, password);
                await goto('/project');
            }
        },
        async onUpdated(data) {
        },
        async onResult(data) {
        }
    });

    const {form: formData, errors, message, enhance, validateForm, options} = form;

</script>

<div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Login account</h1>
    <p class="text-sm text-muted-foreground">
        Enter your email and password below to login.
    </p>
</div>

<form method="POST" use:enhance>
    <Form.Field {form} name="email">
        <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input {...attrs} placeholder="name@example.com" bind:value={$formData.email}/>
        </Form.Control>
        <Form.FieldErrors/>
    </Form.Field>
    <Form.Field {form} name="password">
        <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input {...attrs} type="password" bind:value={$formData.password}/>
        </Form.Control>
        <Form.FieldErrors/>
    </Form.Field>
    <Form.Button class="inline-flex w-full mt-2">Sign in with email</Form.Button>
</form>

