describe("testing tasks functionality", () => {
  before(() => {
    cy.login();
    cy.get("button").contains("Tasks").click();
  });
  it("should add a new task when all fields are filled, (#TF1)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(validTask.date);
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("h1").contains(validTask.title).should("exist");
      cy.get("h2")
        .contains(`${validTask.date} | ${validTask.course} | new`)
        .should("exist");
      cy.get("p").contains(validTask.description).should("exist");
    });
  });
  it("should not add a new task when some fields are missing, (#TF2)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type("");
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(validTask.date);
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("h1").contains("").should("not.exist");
      cy.get("p").contains("Please fill in all fields").should("exist");
    });
  });
  it("should not add a new task with repeating title, (#TF3)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(validTask.date);
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.contains("Course with this name already exists").should("exist");
    });
  });
  it("should not add a new task with invalid date, (#TF4)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask, invalidDate }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(invalidDate);
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.contains("Please enter a valid URL").should("exist");
    });
  });
  it("should edit an existing task with valid data, (#TF5)", () => {
    cy.get("form").find("button:has(svg)").first().click();
    cy.fixture("tasks").then(({ editedTitle }) => {
      cy.get('input[name="title"]').clear().type(editedTitle);
      cy.get("button[type='submit']").contains("Save").click();

      cy.get("h1").contains(editedTitle).should("exist");
    });
  });
  it("should not edit an existing course with missing data, (#TF6)", () => {
    cy.get("form").find("button:has(svg)").first().click();
    cy.fixture("tasks").then(() => {
      cy.get('input[name="title"]').clear();
      cy.get('button[type="submit"]').contains("Save").click();

      cy.contains("Please fill in all required fields").should("exist");
    });
  });
  it("should mark existing task as done, (#TF7)", () => {
    cy.get("form").find("button:has(svg)").eq(1).click();

    cy.get("h2").contains("done").should("exist");
  });
  it("should delete an existing course, (#TF8)", () => {
    cy.fixture("courses").then(({ editData }) => {
      cy.get("form").find("button:has(svg)").last().click();

      cy.get("h1").contains(editData.title).should("not.exist");
    });
  });
});
