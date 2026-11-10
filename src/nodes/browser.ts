import { faDisplay, faEye, faMoon, faPersonWalking, faWifi, faWindowMaximize } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";
import { useDocumentVisibility, useMediaQuery, useOnline, usePreferredDark, usePreferredReducedMotion, useWindowFocus } from "@vueuse/core";

import { instanceDefine, instanceImport, vueuseImport } from "@/nodes/lib";

export const browserNodes = [
    makeLogicNode({
        name: "browser/documentVisibility",
        inputs: {},
        outputs: {
            out_visible: LogicType.boolean({ name: "Visible" })
        },
        methods: {
            out_visible() {
                return this.instance([], () => useDocumentVisibility()).value === "visible";
            }
        },
        display: {
            name: "Use Document Visibility",
            altSearch: "tab hidden focus background page visible",
            config: {
                icon: faEye,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the page is visible",
            description: "Returns false when the browser tab is hidden or minimized, true when it is visible."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => useDocumentVisibility(), ${ JSON.stringify(id) }).value === "visible";}`,
            imports: [vueuseImport("useDocumentVisibility"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/mediaQuery",
        inputs: {
            in_query: LogicType.string({ name: "Query", description: "CSS media query, e.g. `(min-width: 768px)`" })
        },
        outputs: {
            out_matches: LogicType.boolean({ name: "Matches" })
        },
        methods: {
            out_matches() {
                const query = this.in_query ?? "";
                return this.instance([query], () => useMediaQuery(query)).value;
            }
        },
        display: {
            name: "Use Media Query",
            altSearch: "responsive breakpoint mobile screen css",
            config: {
                icon: faDisplay,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Check whether a CSS media query matches",
            description: "Returns true while the given CSS media query matches, e.g. `(min-width: 768px)` or `(orientation: portrait)`."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{const query = this.in_query ?? ""; return [[instance]]([query], () => useMediaQuery(query), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useMediaQuery"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/online",
        inputs: {},
        outputs: {
            out_online: LogicType.boolean({ name: "Online" })
        },
        methods: {
            out_online() {
                return this.instance([], () => useOnline()).value;
            }
        },
        display: {
            name: "Use Online",
            altSearch: "network offline connection internet",
            config: {
                icon: faWifi,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the browser is online",
            description: "Returns true while the browser has a network connection."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => useOnline(), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useOnline"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/preferredDark",
        inputs: {},
        outputs: {
            out_dark: LogicType.boolean({ name: "Dark" })
        },
        methods: {
            out_dark() {
                return this.instance([], () => usePreferredDark()).value;
            }
        },
        display: {
            name: "Use Preferred Dark",
            altSearch: "dark mode theme color scheme",
            config: {
                icon: faMoon,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the user prefers a dark theme",
            description: "Returns true while the operating system or browser is set to a dark color scheme."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => usePreferredDark(), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("usePreferredDark"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/preferredReducedMotion",
        inputs: {},
        outputs: {
            out_reduced: LogicType.boolean({ name: "Reduced" })
        },
        methods: {
            out_reduced() {
                return this.instance([], () => usePreferredReducedMotion()).value === "reduce";
            }
        },
        display: {
            name: "Use Preferred Reduced Motion",
            altSearch: "accessibility animation a11y prefers-reduced-motion",
            config: {
                icon: faPersonWalking,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the user prefers less motion",
            description: "Returns true while the operating system or browser asks for reduced motion. Use it to skip or simplify animations."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => usePreferredReducedMotion(), ${ JSON.stringify(id) }).value === "reduce";}`,
            imports: [vueuseImport("usePreferredReducedMotion"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/windowFocus",
        inputs: {},
        outputs: {
            out_focused: LogicType.boolean({ name: "Focused" })
        },
        methods: {
            out_focused() {
                return this.instance([], () => useWindowFocus()).value;
            }
        },
        display: {
            name: "Use Window Focus",
            altSearch: "focus blur active window tab",
            config: {
                icon: faWindowMaximize,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the window has focus",
            description: "Returns true while the browser window has focus, false when the user switched to another window or app."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => useWindowFocus(), ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useWindowFocus"), instanceImport]
        }
    })
];
