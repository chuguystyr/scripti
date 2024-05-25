describe("testing schedule functionality", () => {
  it("should navigate to courses when no course was added, (#SF1)", () => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.get("a").contains("here").click()

    cy.url().should("include", "/courses")
    cy.get("p")
      .contains(
        "Looks like you're first time here.Let's add some courses to use in schedule",
      )
      .should("be.visible")
  })
  it("should add a course to the schedule, (#SF2)", () => {
    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.goToCoursesPage()
    cy.get("button").contains("Add Course").click()
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
      cy.contains("button", /^Add$/).click()
    })

    cy.fixture("users").then(({ correctUser: { username, password } }) => {
      cy.login(username, password)
    })
    cy.get("a").contains("here").click()

    const today = new Date()
    const formattedToday = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`

    cy.get('input[name="from"]').type(formattedToday)

    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const formattedNextWeek = `${String(nextWeek.getDate()).padStart(2, "0")}.${String(nextWeek.getMonth() + 1).padStart(2, "0")}.${nextWeek.getFullYear()}`
    cy.get('input[name="to"]').type(formattedNextWeek)

    const currentDayIndex = today.getDay() || 7
    const dayIndex = currentDayIndex - 1 || 7

    cy.fixture("courses").then(({ validCourse }) => {
      cy.get(`.grid .grid-cols-7:nth-child(3) .border-l input`).type(
        validCourse.title,
      )
      cy.get("li").contains(validCourse.title).click()
      cy.get(`.grid .grid-cols-7:nth-child(3) .border-l select`).select(
        "Lecture",
      )
      cy.get(
        `.grid .grid-cols-7:nth-child(3) .border-l input[name="room"]`,
      ).type("601")
    })

    cy.get("button").contains("Submit").click()
    cy.waitUntil(() => cy.get("h2").contains("Hello,"))
  })
})
