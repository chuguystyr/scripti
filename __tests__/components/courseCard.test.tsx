import { describe, it, expect, beforeEach } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import CourseCard from "components/courses/CourseCard"
import mongoose from "mongoose"

const mockCourse = {
  _id: new mongoose.Types.ObjectId(),
  major: "Computer Science",
  title: "Test Course",
  controlForm: "Exam",
  teacherLectures: "John Doe",
  lecturesLink: "https://example.com",
  teacherPractices: "Jane Doe",
  practicesLink: "https://example.com",
  notes: "Some notes about the course",
}

describe("CourseCard component", () => {
  beforeEach(() => {
    cleanup()
  })

  it("should render course details", () => {
    render(<CourseCard {...mockCourse} />)
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
    render(<CourseCard {...mockCourse} />)
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)
  })
})
