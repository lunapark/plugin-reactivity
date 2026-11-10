import { faClockRotateLeft, faGauge, faHourglassHalf } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";
import { usePrevious } from "@vueuse/core";

import { instanceDefine, instanceImport, runtimeImport, vueuseImport } from "@/nodes/lib";
import { useDebouncedValue, useThrottledValue } from "@/runtime";

export const utilNodes = [
    makeLogicNode({
        name: "utils/debounced",
        inputs: {
            in_value: LogicType.unknown({ name: "Value" }),
            in_delay: LogicType.number({ name: "Delay", description: "Delay in milliseconds", optional: true })
        },
        outputs: {
            out_value: LogicType.unknown({ name: "Debounced", dynamic: ({ inputs }) => inputs.in_value })
        },
        methods: {
            out_value() {
                const delay = this.in_delay ?? 200;
                return this.instance([delay], () => useDebouncedValue(() => this.in_value, delay)).value;
            }
        },
        display: {
            name: "Use Debounced",
            altSearch: "debounce delay search input wait settle",
            config: {
                icon: faHourglassHalf,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Wait until a value stops changing",
            description: "Returns the value once it has stopped changing for the delay in milliseconds (200 by default). Typical use: run a search only after the user stops typing."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{const delay = this.in_delay ?? 200; return [[instance]]([delay], () => useDebouncedValue(() => this.in_value, delay), ${ JSON.stringify(id) }).value;}`,
            imports: [runtimeImport("useDebouncedValue"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "utils/throttled",
        inputs: {
            in_value: LogicType.unknown({ name: "Value" }),
            in_delay: LogicType.number({ name: "Delay", description: "Delay in milliseconds", optional: true })
        },
        outputs: {
            out_value: LogicType.unknown({ name: "Throttled", dynamic: ({ inputs }) => inputs.in_value })
        },
        methods: {
            out_value() {
                const delay = this.in_delay ?? 200;
                return this.instance([delay], () => useThrottledValue(() => this.in_value, delay)).value;
            }
        },
        display: {
            name: "Use Throttled",
            altSearch: "throttle rate limit scroll resize",
            config: {
                icon: faGauge,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Update a value at most once per delay",
            description: "Returns the value, updated at most once every delay in milliseconds (200 by default). Typical use: limit work done on scroll or pointer moves."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{const delay = this.in_delay ?? 200; return [[instance]]([delay], () => useThrottledValue(() => this.in_value, delay), ${ JSON.stringify(id) }).value;}`,
            imports: [runtimeImport("useThrottledValue"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "utils/previous",
        inputs: {
            in_value: LogicType.unknown({ name: "Value" })
        },
        outputs: {
            out_previous: LogicType.unknown({ name: "Previous", dynamic: ({ inputs }) => inputs.in_value })
        },
        methods: {
            out_previous() {
                return this.instance([], () => usePrevious(() => this.in_value)).value;
            }
        },
        display: {
            name: "Use Previous",
            altSearch: "old last before change history",
            config: {
                icon: faClockRotateLeft,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Get the value before its last change",
            description: "Returns what the value was before it last changed, or nothing until it changes once. Typical use: compare old and new values, or animate in the direction of a change."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => usePrevious(() => this.in_value), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("usePrevious"), instanceImport]
        }
    })
];
