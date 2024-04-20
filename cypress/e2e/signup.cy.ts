describe("testing signup functionality", () => {
  beforeEach(() => {
    cy.visit("https://scripti-app.vercel.app/signup");
  });
  it("should register a new user when valid data is provided (#SF1)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="name"]').type(correctUser.name);
      cy.get('input[name="username"]').type(correctUser.username);
      cy.get('input[name="email"]').type(correctUser.email);
      cy.get('input[name="password"]').type(correctUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/login");
      cy.get("p")
        .contains("Thanks for signing up. Enjoy the app.")
        .should("be.visible");
    });
  });
  it("should not register a new user when any field is empty (#SF2)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="name"]').type(correctUser.name);
      cy.get('input[name="username"]').type(correctUser.username);
      cy.get('input[name="password"]').type(correctUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/signup");
      cy.get("p").contains("Please fill in all fields").should("be.visible");
    });
  });
  it("should not register a new user with username that's already taken (#SF3)", () => {
    cy.fixture("users").then(({ correctUser }) => {
      cy.get('input[name="name"]').type(correctUser.name);
      cy.get('input[name="username"]').type(correctUser.username);
      cy.get('input[name="email"]').type(correctUser.email);
      cy.get('input[name="password"]').type(correctUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/signup");
      cy.get("p")
        .contains("This username is already taken")
        .should("be.visible");
    });
  });
  it("should not register a new user when password is too short (#SF4)", () => {
    cy.fixture("users").then(({ shortPasswordUser }) => {
      cy.get('input[name="name"]').type(shortPasswordUser.name);
      cy.get('input[name="username"]').type(shortPasswordUser.username);
      cy.get('input[name="email"]').type(shortPasswordUser.email);
      cy.get('input[name="password"]').type(shortPasswordUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/signup");
      cy.get("p")
        .contains(
          "Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.",
        )
        .should("be.visible");
    });
  });
  it("should not register a new user when password is too long (#SF5)", () => {
    cy.fixture("users").then(({ longPasswordUser }) => {
      cy.get('input[name="name"]').type(longPasswordUser.name);
      cy.get('input[name="username"]').type(longPasswordUser.username);
      cy.get('input[name="email"]').type(longPasswordUser.email);
      cy.get('input[name="password"]').type(longPasswordUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/signup");
      cy.get("p")
        .contains(
          "Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.",
        )
        .should("be.visible");
    });
  });
  it("should not register a new user when password doesn't contain a special character (#SF6)", () => {
    cy.fixture("users").then(({ noSpecialCharacterPasswordUser }) => {
      cy.get('input[name="name"]').type(noSpecialCharacterPasswordUser.name);
      cy.get('input[name="username"]').type(
        noSpecialCharacterPasswordUser.username,
      );
      cy.get('input[name="email"]').type(noSpecialCharacterPasswordUser.email);
      cy.get('input[name="password"]').type(
        noSpecialCharacterPasswordUser.password,
      );
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/signup");
      cy.get("p")
        .contains(
          "Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.",
        )
        .should("be.visible");
    });
  });
  it("should not register a new user when email is invalid (#SF7)", () => {
    cy.fixture("users").then(({ invalidEmailUser }) => {
      cy.get('input[name="name"]').type(invalidEmailUser.name);
      cy.get('input[name="username"]').type(invalidEmailUser.username);
      cy.get('input[name="email"]').type(invalidEmailUser.email);
      cy.get('input[name="password"]').type(invalidEmailUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/signup");
    });
  });
});
