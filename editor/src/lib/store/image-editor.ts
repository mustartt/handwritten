import type {ScanBorder} from "$lib/schemas/project-file";
import {writable} from "svelte/store";

type OutputOriginal = {
    type: 'original'
}

type OutputAdaptiveColor = {
    type: 'adaptive_color',
    dilate: number,
    blur: number,
}

type OutputAdaptiveColorThreshold = {
    type: 'adaptive_color_threshold',
    dilate: number,
    blur: number,
    thresholdOffset: number
}

type OutputAdaptiveGrayScale = {
    type: 'adaptive_gray_scale',
    dilate: number,
    blur: number,
}

type OutputAdaptiveBinary = {
    type: 'adaptive_binary',
    size: number,
    c: number,
}

export interface ScanSettings {
    denoise: {
        strength: number,
        strengthColor: number
        radius: number,
    },
    sharpen: {
        amount: number,
        radius: number,
        threshold: number
    },
    exposure: {
        brightness: number,
        contrast: number,
        saturation: number
    },
    applyBorder: boolean;
    outputMode: OutputOriginal
        | OutputAdaptiveColor
        | OutputAdaptiveColorThreshold
        | OutputAdaptiveGrayScale
        | OutputAdaptiveBinary;
}

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
        strength: 0,
        strengthColor: 0,
        radius: 5,
    },
    sharpen: {
        amount: 1,
        radius: 5,
        threshold: 10
    },
    exposure: {
        brightness: 0,
        contrast: 0,
        saturation: 0
    },
    applyBorder: true,
    outputMode: {
        type: 'adaptive_color',
        dilate: 7,
        blur: 21
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

