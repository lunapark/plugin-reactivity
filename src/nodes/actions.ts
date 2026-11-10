import { faBell, faComment, faEyeDropper, faLock, faShareNodes, faSun, faUpRightAndDownLeftFromCenter, faWaveSquare } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { runtimeImport } from "@/nodes/lib";
import type { TToggleMode } from "@/runtime";
import { getFullscreen, notify, pickColor, setFullscreen, setScrollLock, setWakeLock, share, speak, vibrate } from "@/runtime";

const toggleModes = ["toggle", "enter", "exit"];

export const actionNodes = [
    makeLogicNode({
        name: "browser/fullscreen",
        inputs: {},
        outputs: {
            out_fullscreen: LogicType.boolean({ name: "Fullscreen" }),
            out_isSupported: LogicType.boolean({ name: "Is Supported" })
        },
        methods: {
            out_fullscreen() {
                return getFullscreen().isFullscreen.value;
            },
            out_isSupported() {
                return getFullscreen().isSupported.value;
            }
        },
        display: {
            name: "Use Fullscreen",
            altSearch: "full screen presentation immersive",
            config: {
                icon: faUpRightAndDownLeftFromCenter,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the page is fullscreen",
            description: "Returns true while the page is displayed fullscreen, and whether the browser supports it."
        },
        build: {
            generate: ({ key }) => `()=>{return getFullscreen().${ key === "out_isSupported" ? "isSupported" : "isFullscreen" }.value;}`,
            imports: [runtimeImport("getFullscreen")]
        }
    }),
    makeLogicNode({
        name: "browser/setFullscreen",
        inputs: {
            in_exec: LogicType.exec(),
            in_mode: LogicType.string({ name: "Mode", enum: toggleModes, optional: true })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_fullscreen: LogicType.boolean({ name: "Fullscreen" })
        },
        methods: {
            async in_exec() {
                this.out_fullscreen = await setFullscreen((this.in_mode ?? "toggle") as TToggleMode);
                return this.out_exec();
            }
        },
        display: {
            name: "Set Fullscreen",
            altSearch: "full screen enter exit toggle presentation",
            config: {
                icon: faUpRightAndDownLeftFromCenter,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Enter or leave fullscreen",
            description: "Enters, exits or toggles (default) fullscreen for the whole page, then returns whether it is fullscreen. Browsers only allow entering fullscreen from a user action, like a click."
        },
        build: {
            generate: () => `async function(){this.out_fullscreen = await setFullscreen(this.in_mode ?? "toggle"); return this.out_exec();}`,
            imports: [runtimeImport("setFullscreen")]
        }
    }),
    makeLogicNode({
        name: "browser/setWakeLock",
        inputs: {
            in_exec: LogicType.exec(),
            in_active: LogicType.boolean({ name: "Active" })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_active: LogicType.boolean({ name: "Active" })
        },
        methods: {
            async in_exec() {
                this.out_active = await setWakeLock(!!this.in_active);
                return this.out_exec();
            }
        },
        display: {
            name: "Set Wake Lock",
            altSearch: "keep screen awake on sleep dim recipe video",
            config: {
                icon: faSun,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Keep the screen from turning off",
            description: "While active, prevents the device screen from dimming or locking (e.g. for a recipe, a presentation or a timer). Returns whether the lock is active: false when the browser does not support or refuses it. The lock is restored when the page becomes visible again."
        },
        build: {
            generate: () => "async function(){this.out_active = await setWakeLock(!!this.in_active); return this.out_exec();}",
            imports: [runtimeImport("setWakeLock")]
        }
    }),
    makeLogicNode({
        name: "browser/setScrollLock",
        inputs: {
            in_exec: LogicType.exec(),
            in_locked: LogicType.boolean({ name: "Locked" })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            in_exec() {
                setScrollLock(!!this.in_locked);
                return this.out_exec();
            }
        },
        display: {
            name: "Set Scroll Lock",
            altSearch: "disable scroll body overflow modal drawer menu",
            config: {
                icon: faLock,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Stop the page from scrolling",
            description: "Locks or unlocks the page scroll, including touch scrolling. Typical use: while a modal, drawer or mobile menu is open. Has no effect in the editor preview."
        },
        build: {
            generate: () => "function(){setScrollLock(!!this.in_locked); return this.out_exec();}",
            imports: [runtimeImport("setScrollLock")]
        }
    }),
    makeLogicNode({
        name: "browser/share",
        inputs: {
            in_exec: LogicType.exec(),
            in_title: LogicType.string({ name: "Title", optional: true }),
            in_text: LogicType.string({ name: "Text", optional: true }),
            in_url: LogicType.string({ name: "URL", optional: true })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_shared: LogicType.boolean({ name: "Shared" })
        },
        methods: {
            async in_exec() {
                this.out_shared = await share({ text: this.in_text, title: this.in_title, url: this.in_url });
                return this.out_exec();
            }
        },
        display: {
            name: "Share",
            altSearch: "share sheet social send link native mobile",
            config: {
                icon: faShareNodes,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Open the native share sheet",
            description: "Opens the device's share dialog with a title, text and URL. Returns false when sharing is not supported (most desktop browsers) or the user cancelled. Must be called from a user action, like a click."
        },
        build: {
            generate: () => "async function(){this.out_shared = await share({text: this.in_text, title: this.in_title, url: this.in_url}); return this.out_exec();}",
            imports: [runtimeImport("share")]
        }
    }),
    makeLogicNode({
        name: "browser/vibrate",
        inputs: {
            in_exec: LogicType.exec(),
            in_pattern: LogicType.union([LogicType.number(), LogicType.array(LogicType.number())], { name: "Pattern", description: "Duration in milliseconds, or alternating vibration and pause durations" })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            in_exec() {
                vibrate(this.in_pattern ?? 200);
                return this.out_exec();
            }
        },
        display: {
            name: "Vibrate",
            altSearch: "haptic feedback buzz mobile",
            config: {
                icon: faWaveSquare,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Make the device vibrate",
            description: "Vibrates for a duration in milliseconds, or follows a pattern like `[200, 100, 200]` (vibrate, pause, vibrate). Only works on Android browsers; does nothing elsewhere."
        },
        build: {
            generate: () => "function(){vibrate(this.in_pattern ?? 200); return this.out_exec();}",
            imports: [runtimeImport("vibrate")]
        }
    }),
    makeLogicNode({
        name: "browser/notify",
        inputs: {
            in_exec: LogicType.exec(),
            in_title: LogicType.string({ name: "Title" }),
            in_body: LogicType.string({ name: "Body", optional: true }),
            in_icon: LogicType.string({ name: "Icon", description: "Image URL", optional: true })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_shown: LogicType.boolean({ name: "Shown" })
        },
        methods: {
            async in_exec() {
                this.out_shown = await notify(this.in_title ?? "", { body: this.in_body, icon: this.in_icon });
                return this.out_exec();
            }
        },
        display: {
            name: "Show Notification",
            altSearch: "notification alert push desktop permission",
            config: {
                icon: faBell,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Show a system notification",
            description: "Asks for the notification permission the first time, then shows a system notification. Returns false when the user refused or the browser does not support it. This is not a push notification: the page must be open."
        },
        build: {
            generate: () => `async function(){this.out_shown = await notify(this.in_title ?? "", {body: this.in_body, icon: this.in_icon}); return this.out_exec();}`,
            imports: [runtimeImport("notify")]
        }
    }),
    makeLogicNode({
        name: "browser/speak",
        inputs: {
            in_exec: LogicType.exec(),
            in_text: LogicType.string({ name: "Text" }),
            in_lang: LogicType.string({ name: "Language", description: "e.g. `en-US`", optional: true }),
            in_rate: LogicType.number({ name: "Rate", description: "0.1 to 10, 1 by default", optional: true }),
            in_pitch: LogicType.number({ name: "Pitch", description: "0 to 2, 1 by default", optional: true })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_spoken: LogicType.boolean({ name: "Spoken" })
        },
        methods: {
            async in_exec() {
                this.out_spoken = await speak(this.in_text ?? "", { lang: this.in_lang, pitch: this.in_pitch, rate: this.in_rate });
                return this.out_exec();
            }
        },
        display: {
            name: "Speak",
            altSearch: "text to speech tts voice read aloud speech synthesis",
            config: {
                icon: faComment,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Read a text aloud",
            description: "Reads the text with the browser's speech synthesis, then continues once it has finished. Stops any text already being read. Returns false when speech is not supported or failed."
        },
        build: {
            generate: () => `async function(){this.out_spoken = await speak(this.in_text ?? "", {lang: this.in_lang, pitch: this.in_pitch, rate: this.in_rate}); return this.out_exec();}`,
            imports: [runtimeImport("speak")]
        }
    }),
    makeLogicNode({
        name: "browser/pickColor",
        inputs: {
            in_exec: LogicType.exec()
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_color: LogicType.string({ name: "Color", description: "Hex color, empty when cancelled or unsupported" })
        },
        methods: {
            async in_exec() {
                this.out_color = await pickColor();
                return this.out_exec();
            }
        },
        display: {
            name: "Pick Color",
            altSearch: "eye dropper eyedropper color picker screen",
            config: {
                icon: faEyeDropper,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Pick a color anywhere on the screen",
            description: "Opens the browser's eye dropper and returns the picked color as hex (e.g. `#42b883`). Returns an empty string when cancelled or unsupported (only Chromium browsers support it). Must be called from a user action, like a click."
        },
        build: {
            generate: () => "async function(){this.out_color = await pickColor(); return this.out_exec();}",
            imports: [runtimeImport("pickColor")]
        }
    })
];
