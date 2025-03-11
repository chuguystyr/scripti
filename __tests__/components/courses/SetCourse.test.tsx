import React from "react"
import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import SetCourse from "components/courses/SetCourse"
import { ControlForm, CourseType } from "types/Course"
describe("SetCourse", () => {
  afterEach(() => {
    cleanup()
  })
  it('renders "Add Course" when no course prop is provided', () => {
    render(<SetCourse major="Computer Science" />)
    expect(screen.getByText("Add Course")).toBeDefined()
  })

  it('renders "Save Changes" when a course prop is provided', () => {
    render(
      <SetCourse
        course={{
          _id: "123",
          title: "Test Course",
          controlForm: ControlForm.EXAM,
          type: CourseType.CORE,
          major: "Computer Science",
          teacherLectures: "",
          lecturesLink: "",
          teacherPractices: "",
          practicesLink: "",
          notes: "",
        }}
      />,
    )
    expect(screen.getByText("Save Changes")).toBeDefined()
  })

  it("displays default title in edit mode", () => {
    render(
      <SetCourse
        course={{
          _id: "123",
          title: "Test Course",
          controlForm: ControlForm.EXAM,
          type: CourseType.CORE,
          major: "Computer Science",
          teacherLectures: "",
          lecturesLink: "",
          teacherPractices: "",
          practicesLink: "",
          notes: "",
        }}
      />,
    )
    const titleInput = screen.getAllByRole("textbox")[0] as HTMLInputElement
    expect(titleInput.value).toBe("Test Course")
  })
})
