describe("testing login functionality", () => {
  beforeEach(() => {
    cy.visit("/login")
  })
  it("should login a user when valid data is provided, (#LF1)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username)
      cy.get('input[name="password"]').type(correctUser.password)
      cy.get('button[type="submit"]').click()

      cy.url().should("include", "/protected/home")
    })
  })
  it("should not login when password is empty, (#LF2)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username)
      cy.get('button[type="submit"]').click()

      cy.url().should("include", "/login")
      cy.get("p").contains("Please fill in all fields").should("be.visible")
    })
  })
  it("should not login with invalid password, (#LF3)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username)
      cy.get('input[name="password"]').type(correctUser.password + "1")
      cy.get('button[type="submit"]').click()

      cy.url().should("include", "/login")
      cy.get("p").contains("Invalid credentials").should("be.visible")
    })
  })
  it("should not login with invalid username, (#LF4)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username + "1")
      cy.get('input[name="password"]').type(correctUser.password)
      cy.get('button[type="submit"]').click()

      cy.url().should("include", "/login")
      cy.get("p").contains("Invalid credentials").should("be.visible")
    })
  })
})
