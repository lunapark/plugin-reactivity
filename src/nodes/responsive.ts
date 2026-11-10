import { faMobileScreen, faRulerHorizontal } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { instanceDefine, instanceImport, outputProperty, runtimeImport } from "@/nodes/lib";
import type { TBreakpointPreset } from "@/runtime";
import { getBreakpointNames, getBreakpointPreset, useBreakpoint, useBreakpointPreset } from "@/runtime";

export function getResponsiveNodes(preset: TBreakpointPreset) {
    const names = getBreakpointNames(preset);

    return [
        makeLogicNode({
            name: "responsive/breakpoint",
            inputs: {
                in_breakpoint: LogicType.string({ name: "Breakpoint", enum: names })
            },
            outputs: {
                out_greaterOrEqual: LogicType.boolean({ name: "Greater or Equal", description: "The window is at least as wide as the breakpoint" }),
                out_smaller: LogicType.boolean({ name: "Smaller", description: "The window is narrower than the breakpoint" })
            },
            methods: {
                out_greaterOrEqual() {
                    const breakpoint = this.in_breakpoint ?? "";
                    return this.instance([getBreakpointPreset(), breakpoint], () => useBreakpoint(breakpoint)).greaterOrEqual.value;
                },
                out_smaller() {
                    const breakpoint = this.in_breakpoint ?? "";
                    return this.instance([getBreakpointPreset(), breakpoint], () => useBreakpoint(breakpoint)).smaller.value;
                }
            },
            display: {
                name: "Use Breakpoint",
                altSearch: "responsive mobile tablet desktop screen width sm md lg xl",
                config: {
                    icon: faRulerHorizontal,
                    scope: ELogicScope.Frontend
                }
            },
            documentation: {
                short: "Compare the window width with a breakpoint",
                description: `Returns whether the window is at least as wide as the breakpoint, or narrower. Breakpoints come from the preset chosen in the Reactivity plugin settings (currently: ${ names.map((name) => `\`${ name }\``).join(", ") }).`
            },
            build: {
                define: instanceDefine,
                generate: ({ id, key }) => `()=>{const breakpoint = this.in_breakpoint ?? ""; return [[instance]]([getBreakpointPreset(), breakpoint], () => useBreakpoint(breakpoint), ${ JSON.stringify(id) }).${ outputProperty(key!) }.value;}`,
                imports: [runtimeImport("useBreakpoint"), runtimeImport("getBreakpointPreset"), instanceImport]
            }
        }),
        makeLogicNode({
            name: "responsive/currentBreakpoint",
            inputs: {},
            outputs: {
                out_current: LogicType.string({ name: "Current" })
            },
            methods: {
                out_current() {
                    return this.instance([getBreakpointPreset()], () => useBreakpointPreset().active()).value;
                }
            },
            display: {
                name: "Use Current Breakpoint",
                altSearch: "responsive mobile tablet desktop screen width active",
                config: {
                    icon: faMobileScreen,
                    scope: ELogicScope.Frontend
                }
            },
            documentation: {
                short: "Get the name of the active breakpoint",
                description: `Returns the largest breakpoint the window is wider than, or an empty string below the smallest one. Breakpoints come from the preset chosen in the Reactivity plugin settings (currently: ${ names.map((name) => `\`${ name }\``).join(", ") }).`
            },
            build: {
                define: instanceDefine,
                generate: ({ id }) => `()=>{return [[instance]]([getBreakpointPreset()], () => useBreakpointPreset().active(), ${ JSON.stringify(id) }).value;}`,
                imports: [runtimeImport("useBreakpointPreset"), runtimeImport("getBreakpointPreset"), instanceImport]
            }
        })
    ];
}
