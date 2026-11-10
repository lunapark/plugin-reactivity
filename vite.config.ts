import path from "path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

import packageDefinition from "./package.json" with { type: "json" };

const entries = {
    editor: { index: "src/index.ts" },
    runtime: { runtime: "src/runtime/index.ts" }
};

const externals = {
    editor: ["vue"],
    runtime: Object.keys(packageDefinition.peerDependencies)
};

export default defineConfig(({ mode }) => {
    const target = mode === "runtime" ? "runtime" : "editor";

    const config: UserConfig = {
        build: {
            emptyOutDir: target === "editor",
            lib: {
                name: packageDefinition.name,
                entry: entries[target],
                formats: ["es"]
            },
            rolldownOptions: {
                external: externals[target]
            }
        },
        preview: {
            allowedHosts: [
                "localhost",
                "127.0.0.1",
                "https://luna-park.app"
            ],
            host: "127.0.0.1",
            port: 2084
        },
        resolve: {
            alias: {
                "@": path.resolve(import.meta.dirname, "src")
            }
        }
    };

    return config;
});
