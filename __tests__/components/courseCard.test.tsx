import { describe, it, expect, beforeEach, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import CourseCard from "components/courses/CourseCard"
import mongoose from "mongoose"

const mockCourse = {
  _id: new mongoose.Types.ObjectId(),
  title: "Test Course",
  controlForm: "Exam",
  teacherLectures: "John Doe",
  lecturesLink: "/lectures",
  teacherPractices: "Jane Doe",
  practicesLink: "/practices",
  notes: "Some notes about the course",
}

vi.mock("server/actions/courses", () => ({
  deleteCourse: () => {},
  openEditCourse: () => {},
  closeEditCourse: () => {},
  editCourse: () => {},
}))

vi.mock("react-dom", () => {
  return {
    useFormStatus: () => ({
      pending: false,
    }),
  }
})

describe("CourseCard component", () => {
  beforeEach(() => {
    cleanup()
  })

  it("should render course details", () => {
    render(<CourseCard course={mockCourse} searchParams={{}} />)
    expect(screen.getByText(mockCourse.title)).toBeDefined()
    expect(screen.getByText(mockCourse.controlForm)).toBeDefined()
    expect(screen.getByText(mockCourse.teacherLectures)).toBeDefined()
    expect(screen.getByText(mockCourse.teacherPractices)).toBeDefined()
    expect(screen.getByText("Lectures")).toBeDefined()
    expect(screen.getByText("Practices")).toBeDefined()
    expect(screen.getByText("Notes")).toBeDefined()
    expect(screen.getByText(mockCourse.notes)).toBeDefined()
  })

  it("should render edit and delete buttons when not in edit mode", () => {
    render(<CourseCard course={mockCourse} searchParams={{}} />)
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)
  })

  it("should render edit form when in edit mode", () => {
    render(<CourseCard course={mockCourse} searchParams={{ edit: "true" }} />)
    expect(screen.getByDisplayValue(mockCourse.title)).toBeDefined()
    expect(screen.getByDisplayValue(mockCourse.teacherLectures)).toBeDefined()
    expect(screen.getByDisplayValue(mockCourse.teacherPractices)).toBeDefined()
    expect(screen.getByDisplayValue(mockCourse.notes)).toBeDefined()
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)
  })
})
