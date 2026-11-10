import type { TEnv } from "@luna-park/plugin";
import { EInjectionKey, LogicType, makePlugin } from "@luna-park/plugin";

import llm from "@/llm.md?raw";
import icon from "@/logo.svg";
import { getNodes } from "@/nodes";
import type { TBreakpointPreset } from "@/runtime";
import { breakpointPresets, configureReactivity, setEditorMode } from "@/runtime";

import packageDefinition from "../package.json" with { type: "json" };

const configSchema = LogicType.object({
    breakpoints: LogicType.string({
        name: "Breakpoints",
        default: "tailwind",
        description: "Breakpoint preset used by the responsive nodes.",
        enum: Object.keys(breakpointPresets)
    })
});

type TConfig = TEnv<typeof configSchema>["config"];

function getConfig(config: TConfig) {
    return { breakpoints: (config.breakpoints ?? "tailwind") as TBreakpointPreset };
}

function applyConfig({ config }: TEnv<typeof configSchema>) {
    setEditorMode(true);
    configureReactivity(getConfig(config));
}

export default makePlugin({
    id: "reactivity",
    name: "Reactivity",
    description: "Reactive browser, sensor, time and state nodes powered by VueUse.",
    icon,
    llm,
    config: configSchema,
    lifecycle: {
        mount: applyConfig,
        update: applyConfig
    },
    editor: {
        nodes: ({ config }) => getNodes(getConfig(config).breakpoints)
    },
    build: {
        frontImports: [
            { name: packageDefinition.name, version: packageDefinition.version },
            { name: "@vueuse/core", version: packageDefinition.peerDependencies["@vueuse/core"] }
        ],
        injections: ({ config }) => ({
            [EInjectionKey.AppSetup]: `
import { configureReactivity } from "${ packageDefinition.name }/runtime";
configureReactivity(${ JSON.stringify(getConfig(config)) });
`
        })
    }
});
