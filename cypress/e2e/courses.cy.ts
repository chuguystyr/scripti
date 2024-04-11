describe("testing courses functionality", () => {
  beforeEach(() => {
    cy.login();
    cy.get("a").contains("Courses").click();
  });
  it("should add a new course when all fields are filled, (#CF1)", () => {
    cy.get("button").contains("Add Course").click();
    cy.fixture("courses").then(({ validCourse }) => {
      cy.get('input[name="title"]').type(validCourse.title);
      cy.get('input[name="teacherLectures"]').type(validCourse.teacherLectures);
      cy.get('input[name="teacherPractices"]').type(
        validCourse.teacherPractices,
      );
      cy.get('select[name="controlForm"]').select(validCourse.formOfControl);
      cy.get('input[name="lecturesLink"]').type(validCourse.lecturesLink);
      cy.get('input[name="practicesLink"]').type(validCourse.practicesLink);
      cy.get('input[name="notes"]').type(validCourse.notes);
      cy.contains("button", /^Add$/).click();

      cy.get("h1").contains(validCourse.title).should("exist");
      cy.get("span").contains(validCourse.teacherLectures).should("exist");
      cy.get("span").contains(validCourse.teacherPractices).should("exist");
      cy.get("span").contains(validCourse.formOfControl).should("exist");
      cy.get("a").filter(":contains('Link')").should("have.length", 2);
      cy.get("p").contains(validCourse.notes).should("exist");
    });
  });
  it("should not add a new course when some fields are missing, (#CF2)", () => {
    cy.get("button").contains("Add Course").click();
    cy.fixture("courses").then(({ validCourse }) => {
      cy.get('input[name="teacherLectures"]').type(validCourse.teacherLectures);
      cy.get('input[name="teacherPractices"]').type(
        validCourse.teacherPractices,
      );
      cy.get('select[name="controlForm"]').select(validCourse.formOfControl);
      cy.get('input[name="lecturesLink"]').type(validCourse.lecturesLink);
      cy.get('input[name="practicesLink"]').type(validCourse.practicesLink);
      cy.get('input[name="notes"]').type(validCourse.notes);
      cy.contains("button", /^Add$/).click();

      cy.contains("Please fill in all required fields").should("exist");
    });
  });
  it("should edit an existing course with valid data, (#CF4)", () => {
    cy.get("form").find("button:has(svg)").first().click();
    cy.fixture("courses").then(({ validCourse, editData }) => {
      cy.get('input[name="title"]').clear().type(editData.title);
      cy.get("button[type='submit']").contains("Save").click();

      cy.get("h1").contains(editData.title).should("exist");
      cy.get("span").contains(validCourse.teacherLectures).should("exist");
      cy.get("span").contains(validCourse.teacherPractices).should("exist");
      cy.get("span").contains(validCourse.formOfControl).should("exist");
      cy.get("a").filter(":contains('Link')").should("have.length", 2);
      cy.get("p").contains(validCourse.notes).should("exist");

      cy.get("form").find("button:has(svg)").first().click();
      cy.fixture("courses").then(({ validCourse }) => {
        cy.get('input[name="title"]').clear().type(validCourse.title);
        cy.get("button[type='submit']").contains("Save").click();
      });
    });
  });
  it("should not edit an existing course with missing data, (#CF5)", () => {
    cy.get("form").find("button:has(svg)").first().click();
    cy.fixture("courses").then(() => {
      cy.get('input[name="title"]').clear();
      cy.get('button[type="submit"]').contains("Save").click();

      cy.contains("Please fill in all required fields").should("exist");
    });
  });
  it("should not add a new course with repeating title, (#CF3)", () => {
    cy.get("button").contains("Add Course").click();
    cy.fixture("courses").then(({ validCourse }) => {
      cy.get('input[name="title"]').type(validCourse.title);
      cy.get('input[name="teacherLectures"]').type(validCourse.teacherLectures);
      cy.get('input[name="teacherPractices"]').type(
        validCourse.teacherPractices,
      );
      cy.get('select[name="controlForm"]').select(validCourse.formOfControl);
      cy.get('input[name="lecturesLink"]').type(validCourse.lecturesLink);
      cy.get('input[name="practicesLink"]').type(validCourse.practicesLink);
      cy.get('input[name="notes"]').type(validCourse.notes);
      cy.contains("button", /^Add$/).click();

      cy.get("form").find("button:has(svg)").last().click();
      cy.contains("Course with this name already exists").should("exist");
    });
  });
  it("should delete an existing course, (#CF6)", () => {
    cy.fixture("courses").then(({ validCourse }) => {
      cy.get("form").find("button:has(svg)").last().click();
      cy.contains(new RegExp("^" + validCourse.title + "$", "g")).should(
        "not.exist",
      );
    });
  });
});
