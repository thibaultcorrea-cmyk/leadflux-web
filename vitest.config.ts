import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
    test: {
        environment: "node",
        setupFiles: ["./vitest.setup.ts"],
        include: ["features/**/tests/**/*.test.ts", "features/**/tests/**/*.e2e.ts"],
        exclude: ["node_modules", ".next", "tests/**"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
})
