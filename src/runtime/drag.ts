type TDragStart = {
    clientX: number;
    clientY: number;
    preventDefault?: () => void;
};

export function startDrag(event: TDragStart, fromX: number, fromY: number, onMove: (x: number, y: number) => unknown, onEnd: () => unknown) {
    event.preventDefault?.();

    const originX = event.clientX - fromX;
    const originY = event.clientY - fromY;

    function move(moveEvent: PointerEvent) {
        onMove(moveEvent.clientX - originX, moveEvent.clientY - originY);
    }

    function end() {
        stop();
        onEnd();
    }

    function stop() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);

    return stop;
}
