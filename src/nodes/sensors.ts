import { faArrowPointer, faArrowsUpDown, faBed, faComputerMouse, faKeyboard, faUpRightAndDownLeftFromCenter } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";
import { useIdle, useMagicKeys, useMousePressed, usePointer, useWindowScroll, useWindowSize } from "@vueuse/core";

import { instanceDefine, instanceImport, outputProperty, vueuseImport } from "@/nodes/lib";

export const sensorNodes = [
    makeLogicNode({
        name: "sensors/idle",
        inputs: {
            in_timeout: LogicType.number({ name: "Timeout", description: "Inactivity delay in milliseconds", optional: true })
        },
        outputs: {
            out_idle: LogicType.boolean({ name: "Idle" }),
            out_lastActive: LogicType.number({ name: "Last Active", description: "Timestamp of the last user activity" })
        },
        methods: {
            out_idle() {
                const timeout = this.in_timeout ?? 60000;
                return this.instance([timeout], () => useIdle(timeout)).idle.value;
            },
            out_lastActive() {
                const timeout = this.in_timeout ?? 60000;
                return this.instance([timeout], () => useIdle(timeout)).lastActive.value;
            }
        },
        display: {
            name: "Use Idle",
            altSearch: "inactive afk away activity",
            config: {
                icon: faBed,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Detect when the user stops interacting",
            description: "Returns whether the user has been inactive (no mouse, keyboard, touch or scroll) for the timeout in milliseconds (60000 by default), and the timestamp of the last activity."
        },
        build: {
            define: instanceDefine,
            generate: ({ id, key }) => `()=>{const timeout = this.in_timeout ?? 60000; return [[instance]]([timeout], () => useIdle(timeout), ${ JSON.stringify(id) }).${ outputProperty(key!) }.value;}`,
            imports: [vueuseImport("useIdle"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/magicKey",
        inputs: {
            in_key: LogicType.string({ name: "Key", description: "Key or combination, e.g. `shift`, `a`, `ctrl+s`, `shift+enter`" })
        },
        outputs: {
            out_pressed: LogicType.boolean({ name: "Pressed" })
        },
        methods: {
            out_pressed() {
                const key = this.in_key ?? "";
                return this.instance([key], () => useMagicKeys()[key]).value;
            }
        },
        display: {
            name: "Use Magic Key",
            altSearch: "keyboard shortcut hotkey keydown combination pressed",
            config: {
                icon: faKeyboard,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether a key or shortcut is held down",
            description: "Returns true while the given key or key combination is pressed. Combine keys with `+` or `_` (e.g. `ctrl+s`, `shift+enter`). Key names are case-insensitive and follow `KeyboardEvent.key` / `KeyboardEvent.code`."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{const key = this.in_key ?? ""; return [[instance]]([key], () => useMagicKeys()[key], ${ JSON.stringify(id) }).value;}`,
            imports: [vueuseImport("useMagicKeys"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/mousePressed",
        inputs: {},
        outputs: {
            out_pressed: LogicType.boolean({ name: "Pressed" })
        },
        methods: {
            out_pressed() {
                return this.instance([], () => useMousePressed()).pressed.value;
            }
        },
        display: {
            name: "Use Mouse Pressed",
            altSearch: "click hold button down touch",
            config: {
                icon: faComputerMouse,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the mouse or a finger is pressed",
            description: "Returns true while a mouse button or touch is held down anywhere on the page."
        },
        build: {
            define: instanceDefine,
            generate: ({ id }) => `()=>{return [[instance]]([], () => useMousePressed(), ${ JSON.stringify(id) }).pressed.value;}`,
            imports: [vueuseImport("useMousePressed"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/pointer",
        inputs: {},
        outputs: {
            out_isInside: LogicType.boolean({ name: "Is Inside", description: "Whether the pointer is inside the window" }),
            out_pointerType: LogicType.string({ name: "Pointer Type", description: "`mouse`, `touch`, `pen`, or empty before any interaction" }),
            out_pressure: LogicType.number({ name: "Pressure" }),
            out_x: LogicType.number({ name: "X" }),
            out_y: LogicType.number({ name: "Y" })
        },
        methods: {
            out_isInside() {
                return this.instance([], () => usePointer()).isInside.value;
            },
            out_pointerType() {
                return this.instance([], () => usePointer()).pointerType.value ?? "";
            },
            out_pressure() {
                return this.instance([], () => usePointer()).pressure.value;
            },
            out_x() {
                return this.instance([], () => usePointer()).x.value;
            },
            out_y() {
                return this.instance([], () => usePointer()).y.value;
            }
        },
        display: {
            name: "Use Pointer",
            altSearch: "mouse cursor position coordinates touch pen",
            config: {
                icon: faArrowPointer,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Track the pointer position",
            description: "Returns the reactive position (in page pixels), pressure and type of the mouse, touch or pen pointer, and whether it is inside the window."
        },
        build: {
            define: instanceDefine,
            generate: ({ id, key }) => {
                const fallback = key === "out_pointerType" ? " ?? \"\"" : "";
                return `()=>{return [[instance]]([], () => usePointer(), ${ JSON.stringify(id) }).${ outputProperty(key!) }.value${ fallback };}`;
            },
            imports: [vueuseImport("usePointer"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/windowScroll",
        inputs: {},
        outputs: {
            out_isScrolling: LogicType.boolean({ name: "Is Scrolling" }),
            out_x: LogicType.number({ name: "X" }),
            out_y: LogicType.number({ name: "Y" })
        },
        methods: {
            out_isScrolling() {
                return this.instance([], () => useWindowScroll()).isScrolling.value;
            },
            out_x() {
                return this.instance([], () => useWindowScroll()).x.value;
            },
            out_y() {
                return this.instance([], () => useWindowScroll()).y.value;
            }
        },
        display: {
            name: "Use Window Scroll",
            altSearch: "scroll position offset",
            config: {
                icon: faArrowsUpDown,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Track the page scroll position",
            description: "Returns the reactive horizontal and vertical scroll offset of the window in pixels, and whether it is currently scrolling."
        },
        build: {
            define: instanceDefine,
            generate: ({ id, key }) => `()=>{return [[instance]]([], () => useWindowScroll(), ${ JSON.stringify(id) }).${ outputProperty(key!) }.value;}`,
            imports: [vueuseImport("useWindowScroll"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/windowSize",
        inputs: {},
        outputs: {
            out_height: LogicType.number({ name: "Height" }),
            out_width: LogicType.number({ name: "Width" })
        },
        methods: {
            out_height() {
                return this.instance([], () => useWindowSize()).height.value;
            },
            out_width() {
                return this.instance([], () => useWindowSize()).width.value;
            }
        },
        display: {
            name: "Use Window Size",
            altSearch: "viewport dimensions width height resize responsive",
            config: {
                icon: faUpRightAndDownLeftFromCenter,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Track the window size",
            description: "Returns the reactive inner width and height of the browser window in pixels."
        },
        build: {
            define: instanceDefine,
            generate: ({ id, key }) => `()=>{return [[instance]]([], () => useWindowSize(), ${ JSON.stringify(id) }).${ outputProperty(key!) }.value;}`,
            imports: [vueuseImport("useWindowSize"), instanceImport]
        }
    })
];
