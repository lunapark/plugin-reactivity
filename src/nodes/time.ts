import { faCalendarDays, faClock, faClockRotateLeft, faHourglassEnd, faStopwatch } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";
import { useDateFormat, useInterval, useIntervalFn, useNow, useTimeAgo, useTimestamp } from "@vueuse/core";

import { instanceDefine, instanceGenerate, instanceImport, runtimeImport, vueuseImport } from "@/nodes/lib";
import { useRunningCountdown } from "@/runtime";

const dateInput = () => LogicType.union([LogicType.interface<Date>("Date"), LogicType.string(), LogicType.number()], { name: "Date" });

export const timeNodes = [
    makeLogicNode({
        name: "time/dateFormat",
        inputs: {
            in_date: dateInput(),
            in_format: LogicType.string({ name: "Format" })
        },
        outputs: {
            out_output: LogicType.string({ name: "Formatted Date" })
        },
        methods: {
            out_output() {
                return useDateFormat(this.in_date, this.in_format).value;
            }
        },
        display: {
            name: "Use Date Format",
            altSearch: "format formatDate",
            config: {
                icon: faCalendarDays,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Show a date in a chosen format",
            description: "Reactively formats a date, date string, or timestamp using the supplied VueUse date format.",
            llm: "`in_format` uses VueUse tokens: `YYYY`, `MM`, `MMM`, `DD`, `ddd`, `HH`, `hh`, `mm`, `ss`, `A`; wrap literal text in `[brackets]` (e.g. `\"DD MMM YYYY [at] HH:mm\"`)."
        },
        build: {
            generate: () => "()=>{return useDateFormat(this.in_date, this.in_format).value;}",
            imports: [vueuseImport("useDateFormat")]
        }
    }),
    makeLogicNode({
        name: "time/interval",
        inputs: {
            in_interval: LogicType.number({ name: "Interval", description: "Interval in milliseconds", optional: true })
        },
        outputs: {
            out_counter: LogicType.number({ name: "Counter" })
        },
        methods: {
            out_counter() {
                const interval = this.in_interval ?? 1000;
                return this.instance([interval], () => useInterval(interval)).value;
            }
        },
        display: {
            name: "Use Interval",
            altSearch: "timer tick counter repeat every",
            config: {
                icon: faStopwatch,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Count up at a regular interval",
            description: "Returns a reactive counter that increments every interval in milliseconds (1000 by default). Use it to refresh values periodically."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{const interval = this.in_interval ?? 1000; return [[instance]]([interval], () => useInterval(interval), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useInterval"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "time/now",
        inputs: {
            in_interval: LogicType.number({ name: "Interval", description: "Interval in milliseconds", optional: true })
        },
        outputs: {
            out_now: LogicType.interface<Date>("Date")
        },
        methods: {
            out_now() {
                const interval = this.in_interval;
                return this.instance([interval], () => useNow(interval ? { scheduler: (callback) => useIntervalFn(callback, interval) } : undefined)).value;
            }
        },
        display: {
            name: "Use Now",
            config: {
                icon: faClock,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Keep the current date and time updated",
            description: "Returns a reactive Date that updates at the optional interval in milliseconds."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{const interval = this.in_interval; return [[instance]]([interval], () => useNow(interval ? {scheduler: (callback) => useIntervalFn(callback, interval)} : undefined), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useNow"), vueuseImport("useIntervalFn"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "time/timeAgo",
        inputs: {
            in_date: dateInput()
        },
        outputs: {
            out_output: LogicType.string({ name: "Time Ago" })
        },
        methods: {
            out_output() {
                return this.instance([], () => useTimeAgo(() => this.in_date)).value;
            }
        },
        display: {
            name: "Use Time Ago",
            config: {
                icon: faClockRotateLeft,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Show how long ago a date was",
            description: "Returns a reactive, human-readable description of the time elapsed since the supplied date."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => useTimeAgo(() => this.in_date), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useTimeAgo"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "time/timestamp",
        inputs: {
            in_interval: LogicType.number({ name: "Interval", description: "Interval in milliseconds. Every frame when empty", optional: true })
        },
        outputs: {
            out_timestamp: LogicType.number({ name: "Timestamp" })
        },
        methods: {
            out_timestamp() {
                const interval = this.in_interval;
                return this.instance([interval], () => useTimestamp(interval ? { scheduler: (callback) => useIntervalFn(callback, interval) } : undefined)).value;
            }
        },
        display: {
            name: "Use Timestamp",
            altSearch: "milliseconds epoch time animation frame elapsed",
            config: {
                icon: faStopwatch,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Keep the current timestamp updated",
            description: "Returns the current time in milliseconds since 1970, updated every animation frame, or at the optional interval in milliseconds. Use it for smooth time-based values; prefer **Use Now** for clocks."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useTimestamp(interval ? {scheduler: (callback) => useIntervalFn(callback, interval)} : undefined)", { out_timestamp: ".value" }, "[interval]", "const interval = this.in_interval; "),
            imports: [vueuseImport("useTimestamp"), vueuseImport("useIntervalFn"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "time/countdown",
        inputs: {
            in_seconds: LogicType.number({ name: "Seconds" }),
            in_interval: LogicType.number({ name: "Interval", description: "Tick interval in milliseconds (1000 by default)", optional: true })
        },
        outputs: {
            out_remaining: LogicType.number({ name: "Remaining" }),
            out_done: LogicType.boolean({ name: "Done" })
        },
        methods: {
            out_remaining() {
                const seconds = this.in_seconds ?? 0;
                const interval = this.in_interval ?? 1000;
                return this.instance([seconds, interval], () => useRunningCountdown(seconds, interval)).remaining.value;
            },
            out_done() {
                const seconds = this.in_seconds ?? 0;
                const interval = this.in_interval ?? 1000;
                return this.instance([seconds, interval], () => useRunningCountdown(seconds, interval)).remaining.value <= 0;
            }
        },
        display: {
            name: "Use Countdown",
            altSearch: "timer countdown remaining seconds decrement",
            config: {
                icon: faHourglassEnd,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Count down from a number of seconds",
            description: "Starts counting down from the given seconds as soon as it is used, one step per interval (1000 ms by default), and returns the remaining value and whether it reached 0. Changing the seconds restarts it."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useRunningCountdown(seconds, interval)", {
                out_done: ".remaining.value <= 0",
                out_remaining: ".remaining.value"
            }, "[seconds, interval]", "const seconds = this.in_seconds ?? 0; const interval = this.in_interval ?? 1000; "),
            imports: [runtimeImport("useRunningCountdown"), instanceImport]
        }
    })
];
