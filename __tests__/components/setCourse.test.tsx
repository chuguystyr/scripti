import { describe, it, expect, beforeEach, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import SetCourse from "components/SetCourse"

vi.mock("server/actions/courses", () => ({
  setCourse: () => {},
}))

vi.mock("react-dom", () => {
  return {
    useFormStatus: () => ({
      pending: false,
    }),
  }
})

describe("SetCourse component", () => {
  const mockClose = vi.fn(() => {
    throw new Error("Imitating never returning function")
  })
  beforeEach(() => {
    cleanup()
    render(<SetCourse close={mockClose} searchParams={{}}/>)
  })
  it("should render form fields and labels", () => {
    const title = screen.getByLabelText("Title")
    const formOfControl = screen.getByLabelText("Form of control")
    const teacherLectures = screen.getByLabelText("Teacher Lectures")
    const lecturesLink = screen.getByLabelText("Lectures Link")
    const teacherPractices = screen.getByLabelText("Teacher Practices")
    const practicesLink = screen.getByLabelText("Practices Link")
    const notes = screen.getByLabelText("Notes")
    expect(title).toBeDefined()
    expect(formOfControl).toBeDefined()
    expect(teacherLectures).toBeDefined()
    expect(lecturesLink).toBeDefined()
    expect(teacherPractices).toBeDefined()
    expect(practicesLink).toBeDefined()
    expect(notes).toBeDefined()
  })
  it("should render the Add button", () => {
    const addButton = screen.getByRole("button", { name: "Add" })
    expect(addButton).toBeDefined()
  })
  it("should render the Close button", () => {
    const closeButton = screen.getByRole("button", { name: "Close" })
    expect(closeButton).toBeDefined()
  })
})
