import {
    breakpointsAntDesign,
    breakpointsBootstrapV5,
    breakpointsElement,
    breakpointsQuasar,
    breakpointsTailwind,
    breakpointsVuetifyV3,
    useBreakpoints
} from "@vueuse/core";
import { reactive } from "vue";

export const breakpointPresets: Record<TBreakpointPreset, Record<string, number>> = {
    antDesign: breakpointsAntDesign,
    bootstrap: breakpointsBootstrapV5,
    element: breakpointsElement,
    quasar: breakpointsQuasar,
    tailwind: breakpointsTailwind,
    vuetify: breakpointsVuetifyV3
};

export type TBreakpointPreset = "antDesign" | "bootstrap" | "element" | "quasar" | "tailwind" | "vuetify";

export type TReactivityConfig = {
    breakpoints: TBreakpointPreset;
};

const config = reactive<TReactivityConfig>({ breakpoints: "tailwind" });

export function configureReactivity(next: Partial<TReactivityConfig>) {
    Object.assign(config, next);
}

export function getBreakpointPreset() {
    return config.breakpoints;
}

export function getBreakpointNames(preset: TBreakpointPreset) {
    return Object.keys(breakpointPresets[preset] ?? breakpointsTailwind);
}

export function useBreakpointPreset() {
    return useBreakpoints(breakpointPresets[config.breakpoints] ?? breakpointsTailwind);
}

export function useBreakpoint(name: string) {
    const breakpoints = useBreakpointPreset();

    return {
        greaterOrEqual: breakpoints.greaterOrEqual(name),
        smaller: breakpoints.smaller(name)
    };
}
