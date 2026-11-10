import { effectScope } from "vue";

const scope = effectScope(true);
let editor = false;

export function setEditorMode(value: boolean) {
    editor = value;
}

export function isEditorMode() {
    return editor;
}

export function shared<TValue>(factory: () => TValue) {
    let value: TValue | undefined;

    return () => {
        value ??= scope.run(factory)!;
        return value;
    };
}

export function runInSharedScope<TValue>(factory: () => TValue) {
    return scope.run(factory)!;
}
