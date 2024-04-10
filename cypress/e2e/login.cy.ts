describe("testing login functionality, (#LF1)", () => {
  beforeEach(() => {
    cy.visit("https://scripti-app.vercel.app/login");
  });
  it("should login a user when valid data is provided, (#LF1)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username);
      cy.get('input[name="password"]').type(correctUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/protected/home");
    });
  });
  it("should not login when password is empty, (#LF2)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/login");
      cy.get("p").should("have.text", "Please fill in\nall fields");
    });
  });
  it("should not login with invalid password, (#LF3)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username);
      cy.get('input[name="password"]').type(correctUser.password + "1");
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/login");
      cy.get("p").should("have.text", "Invalid credentials");
    });
  });
  it("should not login with invalid username, (#LF4)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="username"]').type(correctUser.username + "1");
      cy.get('input[name="password"]').type(correctUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/login");
    });
  });
});