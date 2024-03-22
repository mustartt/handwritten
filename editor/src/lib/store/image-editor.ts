import type {ScanBorder} from "$lib/schemas/project-file";
import {writable} from "svelte/store";
import {z} from "zod";

export const settingsSchema = z.object({
    denoise: z.object({
        strength: z.number(),
        strengthColor: z.number(),
        radius: z.number(),
    }),
    sharpen: z.object({
        amount: z.number(),
        radius: z.number(),
        threshold: z.number()
    }),
    exposure: z.object({
        brightness: z.number(),
        contrast: z.number(),
        saturation: z.number()
    }),
    correctSkew: z.boolean().default(true),
    outputMode: z.union([
        z.literal('original'),
        z.literal('adaptive_color'),
        z.literal('adaptive_color_threshold'),
        z.literal('adaptive_gray_scale'),
        z.literal('binary')
    ]),
    outputParameters: z.object({
        dilate: z.number(),
        blur: z.number(),
        thresholdOffset: z.number(),
        size: z.number(),
        c: z.number(),
    })
});

export type ScanSettings = z.infer<typeof settingsSchema>;

export type EditorState = {
    id: string;
    projectId: string;
    name: string;
} & (
    {
        isLoading: true;
    } |
    {
        isLoading: false;
        isSaving: boolean;
        isScanning: boolean;
        isExtracting: boolean;
        preview: string | null;
        scan: string | null;
        scanBorder: ScanBorder | null;
        settings: ScanSettings;
    });

export const defaultScanSettings: ScanSettings = {
    denoise: {
        strength: 25,
        strengthColor: 15,
        radius: 7,
    },
    sharpen: {
        amount: 30,
        radius: 7,
        threshold: 30
    },
    exposure: {
        brightness: 100,
        contrast: 100,
        saturation: 100
    },
    correctSkew: true,
    outputMode: 'adaptive_color',
    outputParameters: {
        size: 21,
        c: 15,
        thresholdOffset: 0,
        blur: 21,
        dilate: 7
    }
};

export type EditorStore = ReturnType<typeof createEditorState>;

export function createEditorState(id: string, projectId: string, name: string) {
    const {subscribe, update, set} = writable<EditorState>({
        id, name, projectId,
        isLoading: false,
        isSaving: false,
        isScanning: false,
        isExtracting: false,
        preview: null,
        scan: null,
        scanBorder: null,
        settings: {...defaultScanSettings}
    });

    return {
        subscribe, update, set,
    };
}

