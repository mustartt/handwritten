<script lang="ts">
    import {Field, Control, FieldErrors, Button, Label} from "$lib/components/ui/form";
    import {defaults, superForm} from "sveltekit-superforms";
    import {Input} from "$lib/components/ui/input";
    import {z} from 'zod';
    import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';

    import {type RegisterFormSchema, registerStepSchema1, registerStepSchema2} from "$lib/schemas/auth";
    import {zod} from "sveltekit-superforms/adapters";
    import {auth} from "$lib/firebase.client";
    import {Loader2Icon} from "lucide-svelte";
    import {toast} from "svelte-sonner";
    import {goto} from "$app/navigation";

    const steps = [zod(registerStepSchema1), zod(registerStepSchema2)];
    let step = 1;

    $: options.validators = steps[step - 1];

    async function registerNewUser(email: string, password: string) {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    async function sendVerification() {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    }


    let isLoading = false;

    const form = superForm(defaults(zod(registerStepSchema2)), {
        SPA: true,
        validationMethod: 'auto',
        async onSubmit(event) {
            console.log('onsubmit', event);
            if (step == steps.length) {
                isLoading = true;
                return;
            } else {
                event.cancel();
            }
            const result = await validateForm({update: true});
            if (result.valid) step = step + 1;
        },
        async onUpdate({form}) {
            console.log('onupdate', form);
            if (form.valid) {
                const data = form.data as z.infer<RegisterFormSchema>;
                try {
                    await registerNewUser(data.email, data.password);
                } catch (err) {
                    console.warn(err);
                    const errorMessage = (err as any).message || 'An unexpected error has occurred';
                    form.valid = false;
                    form.message = {type: 'error', text: errorMessage};
                }
            }
        },
        async onUpdated({form}) {
            console.log('onupdated', form);
            isLoading = false;
            if (form.valid) {
                await sendVerification();
                toast.info('Verification Email Sent');
                goto('/auth/login');
            }
        },
        async onResult({result}) {
            console.log('result', result);
        }
    });

    const {form: formData, errors, message, enhance, validateForm, options} = form;

</script>

<div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
    <p class="text-sm text-muted-foreground">
        Enter your email below to create your account
    </p>
</div>

<form method="POST" use:enhance>
    {#if step === 1}
        <Field {form} name="email">
            <Control let:attrs>
                <Input {...attrs} placeholder="name@example.com" bind:value={$formData.email}/>
            </Control>
            <FieldErrors/>
        </Field>
        <Button class="inline-flex w-full mt-2">Continue</Button>
    {:else}
        <Field {form} name="name">
            <Control let:attrs>
                <Label>Name</Label>
                <Input {...attrs} bind:value={$formData.name}/>
            </Control>
            <FieldErrors/>
        </Field>
        <Field {form} name="email">
            <Control let:attrs>
                <Label>Email</Label>
                <Input {...attrs} bind:value={$formData.email}/>
            </Control>
            <FieldErrors/>
        </Field>
        <Field {form} name="password">
            <Control let:attrs>
                <Label>Password</Label>
                <Input {...attrs} type="password" bind:value={$formData.password}/>
            </Control>
            <FieldErrors/>
        </Field>
        <Field {form} name="confirmPassword">
            <Control let:attrs>
                <Label>Confirm Password</Label>
                <Input {...attrs} type="password" bind:value={$formData.confirmPassword}/>
            </Control>
            <FieldErrors/>
        </Field>
        {#if $message}
            <div class="text-destructive">
                {$message.text}
            </div>
        {/if}
        <Button class="inline-flex w-full mt-2 justify-center items-center">
            {#if isLoading}
                <Loader2Icon class="size-5 animate-spin mr-2"/>
                Loading
            {:else}
                Register
            {/if}
        </Button>
    {/if}
</form>

