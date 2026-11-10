import { actionNodes } from "@/nodes/actions";
import { browserNodes } from "@/nodes/browser";
import { deviceNodes } from "@/nodes/device";
import { getResponsiveNodes } from "@/nodes/responsive";
import { sensorNodes } from "@/nodes/sensors";
import { stateNodes } from "@/nodes/state";
import { timeNodes } from "@/nodes/time";
import { utilNodes } from "@/nodes/utils";
import type { TBreakpointPreset } from "@/runtime";

export function getNodes(preset: TBreakpointPreset) {
    return [
        ...actionNodes,
        ...browserNodes,
        ...deviceNodes,
        ...getResponsiveNodes(preset),
        ...sensorNodes,
        ...stateNodes,
        ...timeNodes,
        ...utilNodes
    ];
}
