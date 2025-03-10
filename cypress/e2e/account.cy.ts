import {
  ChangePasswordValidationErrors,
  SuccessMessages,
} from "types/Utilities"

describe("testing account functionality", () => {
  it("should edit user's data with valid data, (#AF1)", () => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.goToAccountPage()

    cy.get("a:has(svg)").first().click()
    cy.fixture("users").then(({ editedUser }) => {
      cy.get("input[name='name']").clear().type(editedUser.name)
      cy.get("input[name='email']").clear().type(editedUser.email)
      cy.get("button[type='submit']").contains("Save").click()

      cy.get("p").contains(editedUser.name).should("be.visible")
      cy.get("p").contains(editedUser.email).should("be.visible")
    })
  })
  it("should not change password when the incorrect old password is provided, (#AF2)", () => {
    cy.fixture("users").then(
      ({ correctUser: { username, password }, newPassword }) => {
        cy.login(username, password)
        cy.goToAccountPage()
        cy.get("a").contains("Change Password").click()

        cy.get("input[name='oldPassword']").type(`${password + "a"}`)
        cy.get("input[name='newPassword']").type(newPassword)
        cy.get("button[type='submit']").contains("Change").click()
      },
    )

    cy.url().should("contain", "/protected/account")
    cy.get("p")
      .contains(ChangePasswordValidationErrors.INVALID_OLD_PASSWORD)
      .should("be.visible")
  })
  it("should not change password to an invalid password, (#AF3)", () => {
    cy.fixture("users").then(
      ({ correctUser: { username, password }, shortPasswordUser }) => {
        cy.login(username, password)
        cy.goToAccountPage()

        cy.get("a").contains("Change Password").click()
        cy.get("input[name='oldPassword']").type(password)
        cy.get("input[name='newPassword']").type(shortPasswordUser.password)
        cy.get("button[type='submit']").contains("Change").click()
      },
    )

    cy.url().should("contain", "/protected/account")
    cy.get("p")
      .contains(
        "Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.",
      )
      .should("be.visible")
  })
  it("should change password to another valid password, (#AF4)", () => {
    cy.fixture("users").then(
      ({ correctUser: { username, password }, newPassword }) => {
        cy.login(username, password)
        cy.goToAccountPage()

        cy.get("a").contains("Change Password").click()
        cy.get("input[name='oldPassword']").type(password)
        cy.get("input[name='newPassword']").type(newPassword)
        cy.get("button[type='submit']").contains("Change").click()

        cy.get("p")
          .contains(SuccessMessages.PASSWORD_CHANGED)
          .should("be.visible")
        cy.get("button:has(svg)").click()
        cy.get("button").contains("Log out").click()
        cy.login(username, newPassword)
      },
    )
  })
  it("should logout user, (#AF5)", () => {
    const baseUrl = Cypress.env("baseUrl")
    console.log("Base URL:", baseUrl) // Debugging line
    cy.fixture("users").then(({ correctUser: { username }, newPassword }) => {
      cy.login(username, newPassword)
      cy.goToAccountPage()
    })
    cy.get("button").contains("Log out").click()
    cy.url().should("eq", Cypress.config("baseUrl"))
  })
  it("should delete user's account, (#AF6)", () => {
    cy.fixture("users").then(({ correctUser: { username }, newPassword }) => {
      cy.login(username, newPassword)
      cy.goToAccountPage()
      cy.get("button").contains("Delete account").click()

      cy.url().should("eq", Cypress.config("baseUrl"))
      cy.visit("/login")
      cy.get("input[name='username']").type(username)
      cy.get("input[name='password']").type(newPassword)
      cy.get("button[type='submit']").contains("Log in").click()
      cy.get("p").contains("Invalid credentials").should("be.visible")
    })
  })
})
