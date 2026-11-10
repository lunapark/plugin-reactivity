import { faBatteryHalf, faDoorOpen, faLanguage, faLocationDot, faMobileScreenButton, faSignal, faTableCells } from "@fortawesome/pro-solid-svg-icons";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";
import { useBattery, useDevicePixelRatio, useGeolocation, useNetwork, usePageLeave, usePreferredLanguages, useScreenOrientation } from "@vueuse/core";

import { instanceDefine, instanceGenerate, instanceImport, vueuseImport } from "@/nodes/lib";

export const deviceNodes = [
    makeLogicNode({
        name: "browser/network",
        inputs: {},
        outputs: {
            out_effectiveType: LogicType.string({ name: "Effective Type", description: "`slow-2g`, `2g`, `3g`, `4g`, or empty when unknown" }),
            out_type: LogicType.string({ name: "Type", description: "`wifi`, `cellular`, `ethernet`... or empty when unknown" }),
            out_downlink: LogicType.number({ name: "Downlink", description: "Estimated bandwidth in Mb/s" }),
            out_saveData: LogicType.boolean({ name: "Save Data", description: "The user asked to reduce data usage" })
        },
        methods: {
            out_effectiveType() {
                return this.instance([], () => useNetwork()).effectiveType.value ?? "";
            },
            out_type() {
                return this.instance([], () => useNetwork()).type.value ?? "";
            },
            out_downlink() {
                return this.instance([], () => useNetwork()).downlink.value ?? 0;
            },
            out_saveData() {
                return this.instance([], () => useNetwork()).saveData.value ?? false;
            }
        },
        display: {
            name: "Use Network",
            altSearch: "connection bandwidth 4g wifi cellular save data slow",
            config: {
                icon: faSignal,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know the quality of the network connection",
            description: "Returns the connection type, its estimated speed and whether the user enabled data saving. Use it to load lighter content on slow connections. Not supported by every browser (Safari, Firefox): values stay empty."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useNetwork()", {
                out_downlink: ".downlink.value ?? 0",
                out_effectiveType: ".effectiveType.value ?? \"\"",
                out_saveData: ".saveData.value ?? false",
                out_type: ".type.value ?? \"\""
            }),
            imports: [vueuseImport("useNetwork"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/screenOrientation",
        inputs: {},
        outputs: {
            out_orientation: LogicType.string({ name: "Orientation", description: "`portrait-primary`, `portrait-secondary`, `landscape-primary` or `landscape-secondary`" }),
            out_portrait: LogicType.boolean({ name: "Portrait" }),
            out_angle: LogicType.number({ name: "Angle" })
        },
        methods: {
            out_orientation() {
                return this.instance([], () => useScreenOrientation()).orientation.value ?? "";
            },
            out_portrait() {
                return this.instance([], () => useScreenOrientation()).orientation.value?.startsWith("portrait") ?? false;
            },
            out_angle() {
                return this.instance([], () => useScreenOrientation()).angle.value;
            }
        },
        display: {
            name: "Use Screen Orientation",
            altSearch: "portrait landscape rotate mobile device",
            config: {
                icon: faMobileScreenButton,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Know whether the screen is in portrait or landscape",
            description: "Returns the screen orientation type, whether it is portrait, and its rotation angle in degrees."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useScreenOrientation()", {
                out_angle: ".angle.value",
                out_orientation: ".orientation.value ?? \"\"",
                out_portrait: ".orientation.value?.startsWith(\"portrait\") ?? false"
            }),
            imports: [vueuseImport("useScreenOrientation"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/devicePixelRatio",
        inputs: {},
        outputs: {
            out_pixelRatio: LogicType.number({ name: "Pixel Ratio" })
        },
        methods: {
            out_pixelRatio() {
                return this.instance([], () => useDevicePixelRatio()).pixelRatio.value;
            }
        },
        display: {
            name: "Use Device Pixel Ratio",
            altSearch: "retina dpi hidpi zoom density screen",
            config: {
                icon: faTableCells,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Get the screen pixel density",
            description: "Returns the ratio between physical and CSS pixels (2 on most retina screens). It also changes when the user zooms the page."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useDevicePixelRatio()", { out_pixelRatio: ".pixelRatio.value" }),
            imports: [vueuseImport("useDevicePixelRatio"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "browser/preferredLanguages",
        inputs: {},
        outputs: {
            out_language: LogicType.string({ name: "Language", description: "Preferred language, e.g. `en-US`" }),
            out_languages: LogicType.array(LogicType.string(), { name: "Languages" })
        },
        methods: {
            out_language() {
                return this.instance([], () => usePreferredLanguages()).value[0] ?? "";
            },
            out_languages() {
                return [...this.instance([], () => usePreferredLanguages()).value];
            }
        },
        display: {
            name: "Use Preferred Languages",
            altSearch: "locale i18n language translation navigator",
            config: {
                icon: faLanguage,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Get the languages the user prefers",
            description: "Returns the browser's preferred language (e.g. `en-US`) and the full list, in order of preference."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("usePreferredLanguages()", {
                out_language: ".value[0] ?? \"\"",
                out_languages: ".value.slice()"
            }),
            imports: [vueuseImport("usePreferredLanguages"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/battery",
        inputs: {},
        outputs: {
            out_level: LogicType.number({ name: "Level", description: "Between 0 and 1" }),
            out_charging: LogicType.boolean({ name: "Charging" }),
            out_chargingTime: LogicType.number({ name: "Charging Time", description: "Seconds until full" }),
            out_dischargingTime: LogicType.number({ name: "Discharging Time", description: "Seconds until empty" }),
            out_isSupported: LogicType.boolean({ name: "Is Supported" })
        },
        methods: {
            out_level() {
                return this.instance([], () => useBattery()).level.value;
            },
            out_charging() {
                return this.instance([], () => useBattery()).charging.value;
            },
            out_chargingTime() {
                return this.instance([], () => useBattery()).chargingTime.value;
            },
            out_dischargingTime() {
                return this.instance([], () => useBattery()).dischargingTime.value;
            },
            out_isSupported() {
                return this.instance([], () => useBattery()).isSupported.value;
            }
        },
        display: {
            name: "Use Battery",
            altSearch: "battery charge power level device",
            config: {
                icon: faBatteryHalf,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Get the device battery status",
            description: "Returns the battery level (0 to 1), whether it is charging, and the estimated charging and discharging times in seconds. Only supported in Chromium browsers."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useBattery()", {
                out_charging: ".charging.value",
                out_chargingTime: ".chargingTime.value",
                out_dischargingTime: ".dischargingTime.value",
                out_isSupported: ".isSupported.value",
                out_level: ".level.value"
            }),
            imports: [vueuseImport("useBattery"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/geolocation",
        inputs: {},
        outputs: {
            out_latitude: LogicType.number({ name: "Latitude" }),
            out_longitude: LogicType.number({ name: "Longitude" }),
            out_accuracy: LogicType.number({ name: "Accuracy", description: "Accuracy in meters" }),
            out_located: LogicType.boolean({ name: "Located", description: "A position was received" }),
            out_error: LogicType.string({ name: "Error", description: "Empty when there is no error" })
        },
        methods: {
            out_latitude() {
                return this.instance([], () => useGeolocation()).coords.value.latitude;
            },
            out_longitude() {
                return this.instance([], () => useGeolocation()).coords.value.longitude;
            },
            out_accuracy() {
                return this.instance([], () => useGeolocation()).coords.value.accuracy;
            },
            out_located() {
                return this.instance([], () => useGeolocation()).locatedAt.value !== null;
            },
            out_error() {
                return this.instance([], () => useGeolocation()).error.value?.message ?? "";
            }
        },
        display: {
            name: "Use Geolocation",
            altSearch: "location gps position coordinates latitude longitude map",
            config: {
                icon: faLocationDot,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Track the user's position",
            description: "Asks for the location permission, then returns the latitude, longitude and accuracy in meters, updated as the user moves. Check **Located** before using the coordinates (they are `Infinity` until then), and **Error** when the user refused."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("useGeolocation()", {
                out_accuracy: ".coords.value.accuracy",
                out_error: ".error.value?.message ?? \"\"",
                out_latitude: ".coords.value.latitude",
                out_located: ".locatedAt.value !== null",
                out_longitude: ".coords.value.longitude"
            }),
            imports: [vueuseImport("useGeolocation"), instanceImport]
        }
    }),
    makeLogicNode({
        name: "sensors/pageLeave",
        inputs: {},
        outputs: {
            out_left: LogicType.boolean({ name: "Left" })
        },
        methods: {
            out_left() {
                return this.instance([], () => usePageLeave()).value;
            }
        },
        display: {
            name: "Use Page Leave",
            altSearch: "exit intent mouse leave window popup",
            config: {
                icon: faDoorOpen,
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            short: "Detect when the mouse leaves the page",
            description: "Returns true while the mouse is outside the page, e.g. heading to close the tab. Typical use: an exit-intent message."
        },
        build: {
            define: instanceDefine,
            generate: instanceGenerate("usePageLeave()", { out_left: ".value" }),
            imports: [vueuseImport("usePageLeave"), instanceImport]
        }
    })
];
