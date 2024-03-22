<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import {Slider} from "$lib/components/ui/slider";
    import {Switch} from "$lib/components/ui/switch";
    import {Label} from "$lib/components/ui/label";
    import {Separator} from "$lib/components/ui/separator";

    import SuperDebug, {defaults, superForm} from "sveltekit-superforms";
    import {zod} from "sveltekit-superforms/adapters";
    import {defaultScanSettings, settingsSchema} from "$lib/store/image-editor";

    const form = superForm(defaults(defaultScanSettings, zod(settingsSchema)), {
        SPA: true,
        dataType: 'json',
        validators: zod(settingsSchema),
        validationMethod: 'auto',
        async onSubmit(data) {
        },
        async onUpdated(data) {
        },
        async onResult(data) {
        }
    });

    const {form: formData, errors, message, enhance, validateForm, options} = form;
</script>

<div class="w-full h-full p-4 overflow-y-auto">
    <form method="POST" use:enhance class="flex flex-col space-y-2">
        <Form.Fieldset {form} name="outputMode">
            <Form.Legend class="text-2xl pt-6">Output Filter</Form.Legend>
            <Form.Description>Select the desired scanner output mode.</Form.Description>
            <Separator/>
            <RadioGroup.Root
                    bind:value={$formData.outputMode}
                    orientation="horizontal"
                    class="flex space-x-1 overflow-x-auto">
                <Form.Control let:attrs>
                    <Label class="shrink-0 [&:has([data-state=checked])>div]:border-primary">
                        <RadioGroup.Item {...attrs} value="original" class="sr-only"/>
                        <div class="bg-[#ecedef] items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <img class="h-12" src="/images/scan-icon-original.png" alt="icon"/>
                        </div>
                        <span class="block w-full p-2 text-center font-normal">None</span>
                    </Label>
                </Form.Control>
                <Form.Control let:attrs>
                    <Label class="shrink-0 [&:has([data-state=checked])>div]:border-primary">
                        <RadioGroup.Item {...attrs} value="adaptive_color" class="sr-only"/>
                        <div class="bg-[#ecedef] items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <img class="h-12" src="/images/scan-icon-simple.png" alt="icon"/>
                        </div>
                        <span class="block w-full p-2 text-center font-normal">Simple</span>
                    </Label>
                </Form.Control>
                <Form.Control let:attrs>
                    <Label class="shrink-0 [&:has([data-state=checked])>div]:border-primary">
                        <RadioGroup.Item {...attrs} value="adaptive_color_threshold" class="sr-only"/>
                        <div class="bg-[#ecedef] items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <img class="h-12" src="/images/scan-icon-scan.png" alt="icon"/>
                        </div>
                        <span class="block w-full p-2 text-center font-normal">Scan</span>
                    </Label>
                </Form.Control>
                <Form.Control let:attrs>
                    <Label class="shrink-0 [&:has([data-state=checked])>div]:border-primary">
                        <RadioGroup.Item {...attrs} value="adaptive_gray_scale" class="sr-only"/>
                        <div class="bg-[#ecedef] items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <img class="h-12" src="/images/scan-icon-grayscale.png" alt="icon"/>
                        </div>
                        <span class="block w-full p-2 text-center font-normal">Gray</span>
                    </Label>
                </Form.Control>
                <Form.Control let:attrs>
                    <Label class="shrink-0 [&:has([data-state=checked])>div]:border-primary">
                        <RadioGroup.Item {...attrs} value="binary" class="sr-only"/>
                        <div class="bg-[#ecedef] items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <img class="h-12" src="/images/scan-icon-bw.png" alt="icon"/>
                        </div>
                        <span class="block w-full p-2 text-center font-normal">BW</span>
                    </Label>
                </Form.Control>
            </RadioGroup.Root>

            {#if $formData.outputMode !== 'original'}
                <Form.Legend class="text-lg">Advanced Options</Form.Legend>
                <Form.Description>Change the output parameters</Form.Description>
            {/if}

            {#if $formData.outputMode.startsWith('adaptive')}
                <Form.Field {form} name="outputParameters.dilate">
                    <Form.Control let:attrs>
                        <Form.Label class="flex justify-between">
                            <span>Brightness Correction Dilate</span>
                            <span>{$formData.outputParameters.dilate}px</span>
                        </Form.Label>
                        <Slider {...attrs} value={[$formData.outputParameters.dilate]}
                                min={1} max={33} step={2}
                                onValueChange={(value) => {
                                    $formData.outputParameters.dilate = value[0]
                                }}/>
                    </Form.Control>
                </Form.Field>
                <Form.Field {form} name="outputParameters.blur">
                    <Form.Control let:attrs>
                        <Form.Label class="flex justify-between">
                            <span>Brightness Correction Blur</span>
                            <span>{$formData.outputParameters.blur}px</span>
                        </Form.Label>
                        <Slider {...attrs}
                                value={[$formData.outputParameters.blur]}
                                min={1} max={63} step={2}
                                onValueChange={(value) => {
                                    $formData.outputParameters.blur = value[0]
                                }}/>
                    </Form.Control>
                </Form.Field>
            {/if}

            {#if $formData.outputMode === 'adaptive_color_threshold'}
                <Form.Field {form} name="outputParameters.thresholdOffset">
                    <Form.Control let:attrs>
                        <Form.Label class="flex justify-between">
                            <span>Yen Threshold Offset</span>
                            <span>{$formData.outputParameters.thresholdOffset}</span>
                        </Form.Label>
                        <Slider {...attrs} value={[$formData.outputParameters.thresholdOffset]}
                                min={-50} max={50} step={1}
                                onValueChange={(value) => {
                                    $formData.outputParameters.thresholdOffset = value[0]
                                }}/>
                    </Form.Control>
                </Form.Field>
            {/if}

            {#if $formData.outputMode === 'binary'}
                <Form.Field {form} name="outputParameters.size">
                    <Form.Control let:attrs>
                        <Form.Label class="flex justify-between">
                            <span>Adaptive Thresholding Kernel Size</span>
                            <span>{$formData.outputParameters.size}px</span>
                        </Form.Label>
                        <Slider {...attrs}
                                value={[$formData.outputParameters.size]}
                                min={1} max={63} step={2}
                                onValueChange={(value) => {
                                    $formData.outputParameters.size = value[0]
                                }}/>
                    </Form.Control>
                </Form.Field>
                <Form.Field {form} name="outputParameters.c">
                    <Form.Control let:attrs>
                        <Form.Label class="flex justify-between">
                            <span>Adaptive Thresholding C</span>
                            <span>{$formData.outputParameters.c}</span>
                        </Form.Label>
                        <Slider {...attrs}
                                value={[$formData.outputParameters.c]}
                                min={1} max={100} step={1}
                                onValueChange={(value) => {
                                    $formData.outputParameters.c = value[0]
                                }}/>
                    </Form.Control>
                </Form.Field>
            {/if}
            <Form.FieldErrors/>
        </Form.Fieldset>

        <Form.Fieldset {form} name="correctSkew">
            <Form.Legend class="text-2xl pt-6">Correct Perspective</Form.Legend>
            <Form.Description>
                Uses the document bounding box to crop and correct the perspective of the document.
            </Form.Description>
            <Separator/>
            <Form.Field {form} name="correctSkew" class="flex items-center space-x-4">
                <Form.Control let:attrs>
                    <Form.Label class="mt-2">Correct Perspective</Form.Label>
                    <Switch {...attrs} bind:checked={$formData.correctSkew}/>
                </Form.Control>
                <Form.FieldErrors/>
            </Form.Field>
        </Form.Fieldset>


        <Form.Fieldset {form} name="denoise">
            <Form.Legend class="text-2xl pt-6">Denoise</Form.Legend>
            <Form.Description>Remove noise and color noise from the scanned image.</Form.Description>
            <Separator/>
            <Form.Field {form} name="denoise.strength">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Strength</span>
                        <span>{$formData.denoise.strength}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.denoise.strength]}
                            min={0} max={100}
                            onValueChange={(value) => ($formData.denoise.strength = value[0])}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="denoise.strengthColor">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Color Strength</span>
                        <span>{$formData.denoise.strengthColor}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.denoise.strengthColor]}
                            min={0} max={100}
                            onValueChange={(value) => ($formData.denoise.strengthColor = value[0])}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="denoise.radius">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Radius</span>
                        <span>{$formData.denoise.radius}px</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.denoise.radius]}
                            min={0} max={32}
                            onValueChange={(value) => ($formData.denoise.radius = value[0])}/>
                </Form.Control>
            </Form.Field>
        </Form.Fieldset>

        <Form.Fieldset {form} name="sharpen">
            <Form.Legend class="text-2xl pt-6">Sharpen</Form.Legend>
            <Form.Description>Sharpens the scanned image above a threshold.</Form.Description>
            <Separator/>
            <Form.Field {form} name="sharpen.amount">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Amount</span>
                        <span>{$formData.sharpen.amount}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.sharpen.amount]}
                            min={0} max={100}
                            onValueChange={(value) => ($formData.sharpen.amount = value[0])}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="sharpen.threshold">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Threshold</span>
                        <span>{$formData.sharpen.threshold}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.sharpen.threshold]}
                            min={0} max={100}
                            onValueChange={(value) => ($formData.sharpen.threshold = value[0])}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="sharpen.radius">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Radius</span>
                        <span>{$formData.sharpen.radius}px</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.sharpen.radius]}
                            min={0} max={64}
                            onValueChange={(value) => ($formData.sharpen.radius = value[0])}/>
                </Form.Control>
            </Form.Field>
        </Form.Fieldset>

        <Form.Fieldset {form} name="exposure">
            <Form.Legend class="text-2xl pt-6">Exposure</Form.Legend>
            <Form.Description>Adjust the exposure settings, brightness, contrast, and saturation of the scanned image.
            </Form.Description>
            <Separator/>
            <Form.Field {form} name="exposure.brightness">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Brightness</span>
                        <span>{$formData.exposure.brightness}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.exposure.brightness]}
                            min={50} max={150}
                            onValueChange={(value) => ($formData.exposure.brightness = value[0])}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="exposure.contrast">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Contrast</span>
                        <span>{$formData.exposure.contrast}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.exposure.contrast]}
                            min={50} max={150}
                            onValueChange={(value) => ($formData.exposure.contrast = value[0])}/>
                </Form.Control>
            </Form.Field>
            <Form.Field {form} name="exposure.saturation">
                <Form.Control let:attrs>
                    <Form.Label class="py-1 flex justify-between items-center">
                        <span>Saturation</span>
                        <span>{$formData.exposure.saturation}%</span>
                    </Form.Label>
                    <Slider {...attrs} value={[$formData.exposure.saturation]}
                            min={50} max={150}
                            onValueChange={(value) => ($formData.exposure.saturation = value[0])}/>
                </Form.Control>
            </Form.Field>
        </Form.Fieldset>

        <div class="py-16">
            <SuperDebug data={formData}/>
        </div>
    </form>
</div>
