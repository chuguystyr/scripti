/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>
    goToCoursesPage(): Chainable<void>
    goToTasksPage(): Chainable<void>
    goToAccountPage(): Chainable<void>
  }
}

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.visit("/login")
  cy.get('input[name="username"]').type(username)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()

  cy.url().should("contain", "/protected/home")
  cy.get("h2").contains("Hello,").should("be.visible")
})

Cypress.Commands.add("goToCoursesPage", () => {
  cy.get("a").contains("Courses").click()
  cy.waitUntil(() => cy.get("a").contains("New Course").should("be.visible"))
})

Cypress.Commands.add("goToTasksPage", () => {
  cy.get("a").contains("Tasks").click()
  cy.waitUntil(() => {
    return Cypress.$('a:contains("add"), a:contains("New Task")').is(":visible")
  })
})

Cypress.Commands.add("goToAccountPage", () => {
  cy.get("a").contains("Account").click()
  cy.waitUntil(() =>
    cy.get("h1").contains("Account Actions").should("be.visible"),
  )
})
