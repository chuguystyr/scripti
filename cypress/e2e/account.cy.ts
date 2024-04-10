describe("testing account functionality", () => {
  beforeEach(() => {
    cy.login();
    cy.get("button").contains("Account").click();
  });
  it("should edit user's data with valid data, (#AF1)", () => {
    cy.get("button:has(svg)").first().click();
    cy.fixture("user").then(({ editedUser }) => {
      cy.get("input[name='name']").clear().type(editedUser.name);
      cy.get("input[name='email']").clear().type(editedUser.email);
      cy.get("button[type='submit']").contains("Save").click();
    });
  });
  it("should change password to another valid password, (#AF2)", () => {
    cy.fixture("user").then(({ validUser, newPassword }) => {
      cy.get("input[name='oldPassword']").type(validUser.password);
      cy.get("input[name='newPassword']").type(newPassword);
      cy.get("button[type='submit']").contains("Change").click();
    });
    cy.get("button").contains("Logout").click();
    cy.visit("https://scripti-app.vercel.app/login");
    cy.fixture("user").then(({ validUser, newPassword }) => {
      cy.get("input[name='uaername']").type(validUser.username);
      cy.get("input[name='password']").type(newPassword);
      cy.get("button[type='submit']").click();
      cy.url().should("contain", "/protected/home");
    });
  });
  it("should not change password to an invalid password, (#AF3)", () => {
    cy.fixture("user").then(({ validUser, shortPasswordUser, newPassword }) => {
      cy.get("input[name='oldPassword']").type(validUser.password);
      cy.get("input[name='newPassword']").type(shortPasswordUser.password);
      cy.get("button[type='submit']").contains("Change").click();
    });
    cy.url().should("contain", "/protected/account");
  });
  it("should logout user, (#AF4)", () => {
    cy.get("button").contains("Logout").click();
    cy.url().should("eq", "https://scripti-app.vercel.app/");
  });
  it("should delete user's account, (#AF5)", () => {
    cy.get("button").contains("Delete account").click();
    cy.url().should("eq", "https://scripti-app.vercel.app/");
    cy.get("button").contains("Login").click();
    cy.fixture("user").then(({ validUser }) => {
      cy.get("input[name='username']").type(validUser.username);
      cy.get("input[name='password']").type(validUser.password);
      cy.get("button[type='submit']").click();
      cy.get("p").contains("Invalid credentials").should("exist");
    });
  });
});
