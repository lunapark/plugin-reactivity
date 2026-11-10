import { faBoxArchive, faCircleHalfStroke, faFloppyDisk, faPalette } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { runtimeImport } from "@/nodes/lib";
import type { TStorageArea } from "@/runtime";
import { getColorMode, readStorage, setColorMode, writeStorage } from "@/runtime";

const storageInput = () => LogicType.string({ name: "Storage", description: "`local` persists across sessions, `session` is cleared when the tab closes", enum: ["local", "session"], optional: true });
const colorModes = ["auto", "light", "dark"] as const;

export const stateNodes = [
    makeLogicNode({
        name: "storage/get",
        inputs: {
            in_key: LogicType.string({ name: "Key" }),
            in_default: LogicType.unknown({ name: "Default", optional: true }),
            in_storage: storageInput()
        },
        outputs: {
            out_value: LogicType.unknown({ name: "Value", dynamic: ({ inputs }) => inputs.in_default })
        },
        methods: {
            out_value() {
                return readStorage(this.in_key ?? "", (this.in_storage ?? "local") as TStorageArea, this.in_default);
            }
        },
        display: {
            name: "Use Storage",
            altSearch: "localStorage sessionStorage persist save load remember",
            config: {
                icon: faBoxArchive,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Read a value saved in the browser",
            description: "Returns the value stored under the key in `localStorage` (or `sessionStorage`), or the default when nothing is stored. It updates when **Set Storage** writes the key, including from other tabs."
        },
        build: {
            generate: () => `()=>{return readStorage(this.in_key ?? "", this.in_storage ?? "local", this.in_default);}`,
            imports: [runtimeImport("readStorage")]
        }
    }),
    makeLogicNode({
        name: "storage/set",
        inputs: {
            in_exec: LogicType.exec(),
            in_key: LogicType.string({ name: "Key" }),
            in_value: LogicType.unknown({ name: "Value" }),
            in_storage: storageInput()
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            in_exec() {
                writeStorage(this.in_key ?? "", this.in_value, (this.in_storage ?? "local") as TStorageArea);
                return this.out_exec();
            }
        },
        display: {
            name: "Set Storage",
            altSearch: "localStorage sessionStorage persist save remember write",
            config: {
                icon: faFloppyDisk,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Save a value in the browser",
            description: "Stores the value (as JSON) under the key in `localStorage` (or `sessionStorage`). Every **Use Storage** node reading that key updates. Set an empty value to remove it."
        },
        build: {
            generate: () => `function(){writeStorage(this.in_key ?? "", this.in_value, this.in_storage ?? "local"); return this.out_exec();}`,
            imports: [runtimeImport("writeStorage")]
        }
    }),
    makeLogicNode({
        name: "theme/colorMode",
        inputs: {},
        outputs: {
            out_mode: LogicType.string({ name: "Mode", description: "`auto`, `light` or `dark`", enum: [...colorModes] }),
            out_state: LogicType.string({ name: "State", description: "The resolved mode: `light` or `dark`", enum: ["light", "dark"] }),
            out_dark: LogicType.boolean({ name: "Dark" })
        },
        methods: {
            out_mode() {
                return getColorMode().store.value;
            },
            out_state() {
                return getColorMode().state.value;
            },
            out_dark() {
                return getColorMode().state.value === "dark";
            }
        },
        display: {
            name: "Use Color Mode",
            altSearch: "dark mode light theme toggle scheme",
            config: {
                icon: faCircleHalfStroke,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Get the app color mode",
            description: "Returns the color mode chosen with **Set Color Mode** (`auto` follows the system), and the resolved `light` / `dark` state. In the built app, the `dark` or `light` class is applied to `<html>`, which works with Tailwind's `dark:` variant."
        },
        build: {
            generate: ({ key }) => {
                const expressions: Record<string, string> = {
                    out_dark: "getColorMode().state.value === \"dark\"",
                    out_mode: "getColorMode().store.value",
                    out_state: "getColorMode().state.value"
                };
                return `()=>{return ${ expressions[key!] };}`;
            },
            imports: [runtimeImport("getColorMode")]
        }
    }),
    makeLogicNode({
        name: "theme/setColorMode",
        inputs: {
            in_exec: LogicType.exec(),
            in_mode: LogicType.string({ name: "Mode", enum: [...colorModes] })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            in_exec() {
                setColorMode((this.in_mode ?? "auto") as typeof colorModes[number]);
                return this.out_exec();
            }
        },
        display: {
            name: "Set Color Mode",
            altSearch: "dark mode light theme toggle scheme switch",
            config: {
                icon: faPalette,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Switch between light, dark and auto",
            description: "Sets the app color mode and remembers it in `localStorage`. `auto` follows the system preference."
        },
        build: {
            generate: () => `function(){setColorMode(this.in_mode ?? "auto"); return this.out_exec();}`,
            imports: [runtimeImport("setColorMode")]
        }
    })
];
