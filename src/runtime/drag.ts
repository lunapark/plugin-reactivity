import { useEventListener } from "@vueuse/core";
import { onScopeDispose, ref } from "vue";

type TDragStart = {
    clientX: number;
    clientY: number;
    preventDefault?: () => void;
};

export function useDrag() {
    const x = ref(0);
    const y = ref(0);
    const isDragging = ref(false);
    let stop: (() => void) | undefined;

    function start(event: TDragStart) {
        stop?.();
        event.preventDefault?.();

        const originX = event.clientX - x.value;
        const originY = event.clientY - y.value;
        isDragging.value = true;

        const cleanups = [
            useEventListener(window, "pointermove", (moveEvent) => {
                x.value = moveEvent.clientX - originX;
                y.value = moveEvent.clientY - originY;
            }),
            useEventListener(window, ["pointerup", "pointercancel"], () => {
                isDragging.value = false;
                stop?.();
            })
        ];

        stop = () => {
            cleanups.forEach((cleanup) => cleanup());
            stop = undefined;
        };
    }

    onScopeDispose(() => stop?.());

    return { isDragging, start, x, y };
}
