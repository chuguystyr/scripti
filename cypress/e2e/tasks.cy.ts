describe("testing tasks functionality", () => {
  beforeEach(() => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password);
    });
    cy.goToTasksPage();
  });
  it("should not add a new task with invalid course, (#TF1)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask, invalidCourse }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(invalidCourse);
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      );
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("p").contains("No such course exists").should("be.visible");
    });
  });
  it("should not add a new task when some fields are missing, (#TF2)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      );
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("p").contains("Please fill in all fields").should("be.visible");
    });
  });
  it("should not add a new task with invalid date, (#TF3)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(
        new Date(Date.now() - 86400000).toISOString().split("T")[0],
      );
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("p")
        .contains("Can't add task that's already overdue")
        .should("be.visible");
    });
  });
  it("should add a new task when all fields are filled, (#TF4)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      );
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("h1").contains(validTask.title).should("be.visible");
      cy.get("h2").contains(`| ${validTask.course} | new`).should("be.visible");
      cy.get("p").contains(validTask.description).should("be.visible");
    });
  });
  it("should not add a new task with repeating title, (#TF5)", () => {
    cy.get("button").contains("Add Task").click();
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title);
      cy.get('input[name="course"]').type(validTask.course);
      cy.get('input[name="date"]').type(new Date().toISOString().split("T")[0]);
      cy.get('input[name="description"]').type(validTask.description);
      cy.get('button[type="submit"]').contains("Save").click();

      cy.get("p")
        .contains("Task with this title already exists")
        .should("be.visible");
    });

    cy.get("form").find("button:has(svg)").last().click();
  });
  it("should edit an existing task with valid data, (#TF5)", () => {
    cy.get("form").find("button:has(svg)").first().click();
    cy.fixture("tasks").then(({ editedTitle }) => {
      cy.get('input[name="title"]').clear().type(editedTitle);
      cy.get("button[type='submit']").contains("Save").click();

      cy.get("h1").contains(editedTitle).should("be.visible");
    });
  });
  it("should not edit an existing course with missing data, (#TF6)", () => {
    cy.get("form").find("button:has(svg)").first().click();
    cy.fixture("tasks").then(() => {
      cy.get('input[name="title"]').clear();
      cy.get('button[type="submit"]').contains("Save").click();

      cy.contains("Please fill in all required fields").should("be.visible");
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
