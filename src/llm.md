# Reactivity plugin

Reactive nodes powered by VueUse, all frontend-only. Getter nodes are operation nodes whose outputs update on their own; action nodes have an exec input.

## Getters
- **Browser**: `reactivity/browser/*`: `documentVisibility`, `mediaQuery`, `online`, `network` (connection type, speed, save-data), `preferredDark`, `preferredReducedMotion`, `preferredLanguages`, `screenOrientation`, `devicePixelRatio`, `windowFocus`, `fullscreen`.
- **Responsive**: `reactivity/responsive/breakpoint` compares the window width with a named breakpoint; `reactivity/responsive/currentBreakpoint` returns the active breakpoint name. Names come from the preset in the plugin settings (Tailwind by default: `sm`, `md`, `lg`, `xl`, `2xl`).
- **Sensors**: `reactivity/sensors/*`: `idle`, `magicKey`, `mousePressed`, `pointer`, `windowScroll`, `windowSize`, `pageLeave` (exit intent), `battery`, `geolocation` (asks for permission; check `Located`).
- **Storage**: `reactivity/storage/get` reads a JSON value from `localStorage` / `sessionStorage` with a default. Readers of a key update as soon as it is written, also across tabs.
- **Theme**: `reactivity/theme/colorMode` returns the mode (`auto`, `light`, `dark`) and the resolved state. The built app gets a `dark` / `light` class on `<html>` (Tailwind `dark:` compatible).
- **Time**: `reactivity/time/*`: `dateFormat`, `interval`, `now`, `timeAgo`, `timestamp`, `countdown` (starts as soon as used, restarts when the seconds change).
- **Utils**: `reactivity/utils/debounced` and `reactivity/utils/throttled` delay a changing value (e.g. a search field); `reactivity/utils/previous` returns the value before its last change.

## Actions
- `reactivity/storage/set` writes a storage key; `reactivity/theme/setColorMode` changes the color mode (remembered).
- `reactivity/browser/setFullscreen` (toggle, enter, exit), `setScrollLock` (while a modal or menu is open), `setWakeLock` (keep the screen on).
- `reactivity/sensors/drag` moves an element by dragging: link `event/pointerdown(<handle id>)` (exec and `out_event`) to it. From its `out_move` exec, set two variables from `out_x` and `out_y`, and bind them on the element to move: `:style.transform="'translate(' + dragX + 'px, ' + dragY + 'px)'"`. `out_end` runs on release. It follows the pointer on the whole page, so no capture overlay is needed, and each drag continues from the last offset.
- `reactivity/browser/share` (native share sheet), `notify` (system notification, asks permission), `speak` (text to speech, continues when finished), `vibrate` (Android only), `pickColor` (eye dropper, Chromium only).
- Fullscreen, share and pick color must run from a user action such as a click.

The editor preview does not change its own theme or scroll lock. Prefer these nodes over polling with timers or listening to DOM events by hand.
