describe("testing tasks functionality", () => {
  before(() => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.goToCoursesPage()
    cy.get("a").contains("New Course").click()
    cy.fixture("courses").then(({ validCourse }) => {
      cy.get('input[name="title"]').type(validCourse.title)
      cy.get('input[name="teacherLectures"]').type(validCourse.teacherLectures)
      cy.get('input[name="teacherPractices"]').type(
        validCourse.teacherPractices,
      )
      cy.get('select[name="controlForm"]').select(validCourse.formOfControl)
      cy.get('input[name="lecturesLink"]').type(validCourse.lecturesLink)
      cy.get('input[name="practicesLink"]').type(validCourse.practicesLink)
      cy.get('input[name="notes"]').type(validCourse.notes)
      cy.contains("button", /^Add Course$/).click()
    })
  })
  beforeEach(() => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.goToTasksPage()
  })
  it("should not add a new task with invalid course, (#TF1)", () => {
    cy.get("a").contains("add").click()
    cy.fixture("tasks").then(({ validTask, invalidCourse }) => {
      cy.get('input[name="title"]').type(validTask.title)
      cy.get('input[name="course"]').type(invalidCourse)
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      )
      cy.get('input[name="description"]').type(validTask.description)
      cy.get('button[type="submit"]').contains("Add Task").click()

      cy.get("p").contains("No such course exists").should("be.visible")
    })
  })
  it("should not add a new task when some fields are missing, (#TF2)", () => {
    cy.get("a").contains("add").click()
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="course"]').type(validTask.course)
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      )
      cy.get('input[name="description"]').type(validTask.description)
      cy.get('button[type="submit"]').contains("Add Task").click()

      cy.get("p")
        .contains("Please fill in all required fields")
        .should("be.visible")
    })
  })
  it("should not add a new task with invalid date, (#TF3)", () => {
    cy.get("a").contains("add").click()
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title)
      cy.get('input[name="course"]').type(validTask.course)
      cy.get('input[name="date"]').type(
        new Date(Date.now() - 86400000).toISOString().split("T")[0],
      )
      cy.get('input[name="description"]').type(validTask.description)
      cy.get('button[type="submit"]').contains("Add Task").click()

      cy.get("p")
        .contains("Can't add task that's already overdue")
        .should("be.visible")
    })
  })
  it("should add a new task when all fields are filled, (#TF4)", () => {
    cy.get("a").contains("add").click()
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title)
      cy.get('input[name="course"]').type(validTask.course)
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      )
      cy.get('input[name="description"]').type(validTask.description)
      cy.get('button[type="submit"]').contains("Add Task").click()

      cy.get("h1").contains(validTask.title).should("be.visible")
      cy.get("h2").contains(`| ${validTask.course} | new`).should("be.visible")
      cy.get("p").contains(validTask.description).should("be.visible")
    })
  })
  it("should search for a task by title, (#TF5)", () => {
    cy.fixture("tasks").then(({ validTask: { title } }) => {
      cy.get('input[name="search"]').type(title)
      // FIX THIS LINE
      cy.waitUntil(
        () => cy.url().should("include", title.replaceAll(" ", "+")),
        {
          timeout: 10000,
        },
      )

      cy.get("h1").contains(title).should("be.visible")
    })
  })
  it("should search for a task by title and don't show anything when no task with such title exists, (#TF6)", () => {
    cy.fixture("tasks").then(({ validTask: { title } }) => {
      cy.get('input[name="search"]').type("nonexistent")
      cy.waitUntil(() => cy.url().should("include", "nonexistent"))

      cy.get("h1").contains(title).should("not.exist")
    })
  })
  it("should edit an existing task with valid data, (#TF7)", () => {
    cy.get("a:has(svg)").first().click()
    cy.fixture("tasks").then(({ editedTitle, validTask: { title } }) => {
      cy.get('input[name="title"]').clear().type(editedTitle)
      cy.get("button[type='submit']").contains("Save Changes").click()
      cy.waitUntil(() =>
        cy.get("div.fixed.inset-0").first().should("not.be.visible"),
      )
      cy.get("h1").contains(editedTitle).should("be.visible")

      cy.get("form").find("button:has(svg)").first().click()
      cy.get('input[name="title"]').clear().type(title)
      cy.get("button[type='submit']").contains("Save Changes").click()
    })
  })
  it("should not edit an existing course with missing data, (#TF8)", () => {
    cy.get("a:has(svg)").first().click()
    cy.fixture("tasks").then(() => {
      cy.get('input[name="title"]').clear()
      cy.get('button[type="submit"]').contains("Save Changes").click()

      cy.contains("Please fill in all required fields").should("be.visible")
    })
  })
  it("should mark existing task as done, (#TF9)", () => {
    cy.get("form").find("button:has(svg)").first().click()

    cy.get("h2").contains("done").should("be.visible")
  })
  it("should not add a new task with repeating title, (#TF10)", () => {
    cy.get("a").contains("New Task").click()
    cy.fixture("tasks").then(({ validTask }) => {
      cy.get('input[name="title"]').type(validTask.title)
      cy.get('input[name="course"]').type(validTask.course)
      cy.get('input[name="date"]').type(
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      )
      cy.get('input[name="description"]').type(validTask.description)
      cy.get('button[type="submit"]').contains("Add Task").click()

      cy.get("p")
        .contains("Task with this title and course already exists")
        .should("be.visible")
    })
  })
  it("should delete an existing task, (#TF11)", () => {
    cy.fixture("tasks").then(({ validTask: { title } }) => {
      cy.get("form").find("button:has(svg)").last().click()

      cy.contains(title).should("not.exist")
    })
  })

  after(() => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.goToCoursesPage()
    cy.get("form").find("button:has(svg)").last().click()
  })
})
