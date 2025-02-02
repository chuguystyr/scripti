import { defineWorkspace } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineWorkspace([
  {
    test: {
      name: "components & pages",
      environment: "jsdom",
      include: ["**/__tests__/components/**/*.test.tsx"],
    },
    plugins: [react(), tsconfigPaths()],
  },
  {
    test: {
      name: "pages",
      environment: "jsdom",
      include: ["**/__tests__/pages/**/*.test.tsx"],
    },
    plugins: [react(), tsconfigPaths()],
  },
  {
    test: {
      name: "server",
      environment: "node",
      include: ["**/__tests__/server/**/*.test.ts"],
    },
    plugins: [tsconfigPaths()],
  },
])
