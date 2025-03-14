describe("testing app's public pages accessibility", () => {
  it("testing main page's accessibility", () => {
    cy.visit("/")
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing singup page's accessibility", () => {
    cy.visit("/signup")
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing login page's accessibility", () => {
    cy.visit("/login")
    cy.injectAxe()
    cy.checkA11y()
  })
})

describe("testing app's private pages accessibility", () => {
  beforeEach(() => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
  })
  it("testing home page's accessibility", () => {
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing courses page's accessibility", () => {
    cy.get("a").contains("Courses").click()
    cy.waitUntil(() => cy.get("a").contains("New Course").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing tasks page's accessibility", () => {
    cy.get("a").contains("Tasks").click()
    cy.waitUntil(() => cy.get("a").contains("add").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing account page's accessibility", () => {
    cy.get("a").contains("Account").click()
    cy.waitUntil(() => cy.get("button").contains("Log out").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing setSchedules page's accessibility", () => {
    cy.get("a").contains("here").first().click()
    cy.waitUntil(() => cy.get("input[name='from']").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing setCourse component's accessibility", () => {
    cy.get("a").contains("Courses").click()
    cy.get("a").contains("New Course").click()
    cy.waitUntil(() => cy.get("form").then(($form) => $form.length > 0))
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing setTask components's accessibility", () => {
    cy.get("a").contains("Tasks").click()
    cy.get("a").contains("add").click()
    cy.waitUntil(() => cy.get("form").then(($form) => $form.length > 0))
    cy.injectAxe()
    cy.checkA11y()
  })
})
