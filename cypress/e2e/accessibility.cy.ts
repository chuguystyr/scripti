describe("testing app's public pages accessibility", () => {
  it("testing main page's accessibility", () => {
    cy.visit("https://scripti-app.vercel.app/")
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing singup page's accessibility", () => {
    cy.visit("https://scripti-app.vercel.app/signup")
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing login page's accessibility", () => {
    cy.visit("https://scripti-app.vercel.app/login")
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
    cy.waitUntil(
      () => cy.get("button").contains("Add Course").should("exist"),
      { timeout: 10000, interval: 1000 },
    )
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing tasks page's accessibility", () => {
    cy.get("a").contains("Tasks").click()
    cy.waitUntil(() => cy.get("button").contains("Add Task").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing account page's accessibility", () => {
    cy.get("a").contains("Account").click()
    cy.waitUntil(() => cy.get("button").contains("Logout").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing setSchedules page's accessibility", () => {
    cy.get("a[href='/protected/setSchedule']").click()
    cy.waitUntil(() => cy.get("input[name='from']").should("exist"), {
      timeout: 10000,
      interval: 1000,
    })
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing setCourse component's accessibility", () => {
    cy.get("a").contains("Courses").click()
    cy.get("button").contains("Add Course").click()
    cy.waitUntil(() => cy.get("form").then(($form) => $form.length > 0))
    cy.injectAxe()
    cy.checkA11y()
  })
  it("testing setTask components's accessibility", () => {
    cy.get("a").contains("Tasks").click()
    cy.get("button").contains("Add Task").click()
    cy.waitUntil(() => cy.get("form").then(($form) => $form.length > 0))
    cy.injectAxe()
    cy.checkA11y()
  })
})
