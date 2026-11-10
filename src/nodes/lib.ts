import packageDefinition from "../../package.json" with { type: "json" };

export const RUNTIME_TARGET = `${ packageDefinition.name }/runtime`;

export const instanceDefine = [{
    id: () => "instance",
    values: () => "const [[instance]] = useInstances();"
}];

export function runtimeImport(name: string) {
    return { name, target: RUNTIME_TARGET };
}

export function vueuseImport(name: string) {
    return { name, target: "@vueuse/core" };
}

export const instanceImport = runtimeImport("useInstances");

export function instanceGenerate(factory: string, accessors: Record<string, string>, deps = "[]", prelude = "") {
    return ({ id, key }: { id?: string; key?: string; }) => `()=>{${ prelude }return [[instance]](${ deps }, () => ${ factory }, ${ JSON.stringify(id) })${ accessors[key!] };}`;
}

export function outputProperty(key: string) {
    return key.replace(/^out_/, "");
}
