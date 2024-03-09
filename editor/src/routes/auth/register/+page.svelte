<script lang="ts">
    import {cn} from "$lib/utils";
    import * as Form from "$lib/components/ui/form";
    import {superForm} from "sveltekit-superforms";
    import {Input} from "$lib/components/ui/input";

    import type {Infer, SuperValidated} from "sveltekit-superforms";
    import {type RegisterFormSchema, registerStepSchema1, registerStepSchema2} from "$lib/schemas/auth";
    import {zod} from "sveltekit-superforms/adapters";

    export let data: { form: SuperValidated<Infer<RegisterFormSchema>> };

    const steps = [zod(registerStepSchema1), zod(registerStepSchema2)];
    let step = 1;

    $: options.validators = steps[step - 1];

    const form = superForm(data.form, {
        dataType: 'json',
        validationMethod: 'auto',
        async onSubmit({cancel}) {
            if (step == steps.length) return;
            else cancel();
            const result = await validateForm({update: true});
            if (result.valid) step = step + 1;
        },
        async onUpdated({form}) {
            if (form.valid) step = 1;
        },
        async onResult({result}) {

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
        <Form.Field {form} name="email">
            <Form.Control let:attrs>
                <Input {...attrs} placeholder="name@example.com" bind:value={$formData.email}/>
            </Form.Control>
            <Form.FieldErrors/>
        </Form.Field>
        <Form.Button class="inline-flex w-full mt-2">Continue</Form.Button>
    {:else}
        <Form.Field {form} name="name">
            <Form.Control let:attrs>
                <Form.Label>Name</Form.Label>
                <Input {...attrs} bind:value={$formData.name}/>
            </Form.Control>
            <Form.FieldErrors/>
        </Form.Field>
        <Form.Field {form} name="email">
            <Form.Control let:attrs>
                <Form.Label>Email</Form.Label>
                <Input {...attrs} bind:value={$formData.email}/>
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
        <Form.Field {form} name="confirmPassword">
            <Form.Control let:attrs>
                <Form.Label>Confirm Password</Form.Label>
                <Input {...attrs} type="password" bind:value={$formData.confirmPassword}/>
            </Form.Control>
            <Form.FieldErrors/>
        </Form.Field>
        <Form.Button class="inline-flex w-full mt-2">Register</Form.Button>
    {/if}
</form>

