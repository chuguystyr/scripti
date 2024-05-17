import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const envName = config.env["type-of-environment"] || "local"
      const envType = config.env[envName]
      config.baseUrl = envType.baseUrl
      return config
    },
    env: {
      local: {
        baseUrl: "http://localhost:3000/",
      },
      development: {
        baseUrl: "https://scripti-dev.vercel.app/",
      },
      production: {
        // TODO: replace when production is restored
        baseUrl: "",
      },
    },
  },
})
