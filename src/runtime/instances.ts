import type { EffectScope } from "vue";
import { effectScope, getCurrentScope } from "vue";

type TInstance = {
    deps: Array<unknown>;
    scope: EffectScope;
    value: unknown;
};

export function useInstances() {
    const scope = getCurrentScope() ?? effectScope(true);
    const instances = new Map<string, TInstance>();

    return function <TValue>(deps: Array<unknown>, factory: () => TValue, key: string): TValue {
        const instance = instances.get(key);

        if (instance && instance.deps.length === deps.length && instance.deps.every((dep, index) => Object.is(dep, deps[index]))) {
            return instance.value as TValue;
        }

        instance?.scope.stop();

        if (!scope.active) {
            const snapshotScope = effectScope(true);
            const value = snapshotScope.run(factory) as TValue;
            snapshotScope.stop();
            return value;
        }

        const instanceScope = scope.run(() => effectScope())!;
        const value = instanceScope.run(factory) as TValue;
        instances.set(key, { deps, scope: instanceScope, value });

        return value;
    };
}
