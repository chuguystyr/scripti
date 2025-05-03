import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import CourseCard from "components/courses/CourseCard"
import { ControlForm, CourseType } from "types/Course"

describe("CourseCard", () => {
  vi.mock("next/navigation", () => ({ usePathname: () => "/protected/home" }))
  const mockCourse = {
    _id: "123",
    title: "Test Course",
    type: CourseType.CORE,
    major: "Computer Science",
    controlForm: ControlForm.EXAM,
    teacherLectures: "John Doe",
    lecturesLink: "/lectures",
    teacherPractices: "Jane Doe",
    practicesLink: "/practices",
    notes: "Some notes here",
  }

  it("renders renders all necessary elements", () => {
    render(<CourseCard {...mockCourse} />)
    expect(screen.getByText("Test Course")).toBeDefined()
    expect(screen.getByText("Lectures:")).toBeDefined()
    expect(screen.getByText("John Doe")).toBeDefined()
    expect(screen.getByText("Practices:")).toBeDefined()
    expect(screen.getByText("Jane Doe")).toBeDefined()
    expect(screen.getByText("Notes:")).toBeDefined()
    expect(screen.getAllByText("Some notes here").length).toBe(2)
    expect(screen.getByText("Notes:")).toBeDefined()
    const deleteButton = screen.getByRole("button")
    expect(deleteButton).toBeDefined()
  })
})
