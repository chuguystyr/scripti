import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    specPattern: [
      "cypress/e2e/signup.cy.ts",
      "cypress/e2e/login.cy.ts",
      "cypress/e2e/accessibility.cy.ts",
      "cypress/e2e/courses.cy.ts",
      "cypress/e2e/tasks.cy.ts",
      "cypress/e2e/schedule.cy.ts",
      "cypress/e2e/account.cy.ts",
    ],
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
