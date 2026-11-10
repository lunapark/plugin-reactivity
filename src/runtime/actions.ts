import { useFullscreen, useScrollLock, useWakeLock } from "@vueuse/core";

import { isEditorMode, shared } from "./shared";

export type TToggleMode = "enter" | "exit" | "toggle";

export const getFullscreen = shared(() => useFullscreen());
export const getWakeLock = shared(() => useWakeLock());
const getScrollLock = shared(() => useScrollLock(globalThis.document?.body));

export async function setFullscreen(mode: TToggleMode) {
    const fullscreen = getFullscreen();
    await fullscreen[mode]().catch(() => undefined);

    return fullscreen.isFullscreen.value;
}

export async function setWakeLock(active: boolean) {
    const wakeLock = getWakeLock();

    try {
        if (active) {
            await wakeLock.request("screen");
        }
        else {
            await wakeLock.release();
        }
    }
    catch {
        return false;
    }

    return active;
}

export function setScrollLock(locked: boolean) {
    if (!isEditorMode()) {
        getScrollLock().value = locked;
    }
}

export function isScrollLocked() {
    return getScrollLock().value;
}

export async function share(data: ShareData) {
    if (!globalThis.navigator?.share) {
        return false;
    }

    try {
        await navigator.share(data);
        return true;
    }
    catch {
        return false;
    }
}

export function vibrate(pattern: number | Array<number>) {
    return globalThis.navigator?.vibrate?.(pattern) ?? false;
}

export async function notify(title: string, options: NotificationOptions = {}) {
    if (!("Notification" in globalThis)) {
        return false;
    }

    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;

    if (permission !== "granted") {
        return false;
    }

    new Notification(title, options);
    return true;
}

export function speak(text: string, options: { lang?: string; pitch?: number; rate?: number; } = {}) {
    if (!("speechSynthesis" in globalThis)) {
        return Promise.resolve(false);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined)));

    return new Promise<boolean>((resolve) => {
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    });
}

export async function pickColor() {
    const EyeDropper = (globalThis as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string; }>; }; }).EyeDropper;

    if (!EyeDropper) {
        return "";
    }

    try {
        return (await new EyeDropper().open()).sRGBHex;
    }
    catch {
        return "";
    }
}
