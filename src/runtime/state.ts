import type { BasicColorSchema } from "@vueuse/core";
import { refDebounced, refThrottled, useColorMode, useCountdown, useIntervalFn, useStorage } from "@vueuse/core";
import type { Ref } from "vue";
import { computed } from "vue";

import { isEditorMode, runInSharedScope, shared } from "./shared";

export type TStorageArea = "local" | "session";

const storages = new Map<string, Ref<unknown>>();

const serializer = {
    read: (raw: string) => {
        try {
            return JSON.parse(raw) as unknown;
        }
        catch {
            return raw;
        }
    },
    write: (value: unknown) => JSON.stringify(value)
};

export function getStorageRef(key: string, area: TStorageArea = "local") {
    const id = `${ area }:${ key }`;
    const existing = storages.get(id);

    if (existing) {
        return existing;
    }

    const storage = area === "session" ? globalThis.sessionStorage : globalThis.localStorage;
    const value = runInSharedScope(() => useStorage<unknown>(key, null, storage, { serializer, writeDefaults: false }));
    storages.set(id, value);

    return value;
}

export function readStorage(key: string, area: TStorageArea = "local", fallback?: unknown) {
    return getStorageRef(key, area).value ?? fallback;
}

export function writeStorage(key: string, value: unknown, area: TStorageArea = "local") {
    getStorageRef(key, area).value = value ?? null;
}

export const getColorMode = shared(() => useColorMode({
    emitAuto: true,
    onChanged: (mode, defaultHandler) => {
        if (!isEditorMode()) {
            defaultHandler(mode);
        }
    }
}));

export function setColorMode(mode: BasicColorSchema) {
    getColorMode().store.value = mode;
}

export function useDebouncedValue<TValue>(source: () => TValue, delay: number) {
    return refDebounced(computed(source), delay);
}

export function useThrottledValue<TValue>(source: () => TValue, delay: number) {
    return refThrottled(computed(source), delay);
}

export function useRunningCountdown(seconds: number, interval: number) {
    const countdown = useCountdown(seconds, { scheduler: (callback) => useIntervalFn(callback, interval, { immediate: false }) });
    countdown.start();

    return countdown;
}
