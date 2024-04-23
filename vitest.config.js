import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      ["**/__tests__/components/**/*.test.{ts,tsx}", "jsdom"],
      ["**/__tests__/pages/**/*.test.{ts,tsx}", "jsdom"],
      ["**/__tests__/server/**.test.{ts,tsx}", "node"],
    ],
  },
})
