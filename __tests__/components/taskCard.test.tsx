import { describe, it, expect, beforeEach, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import TaskCard from "components/TaskCard"
import mongoose from "mongoose"

const mockTask = {
  _id: new mongoose.Types.ObjectId(),
  userId: new mongoose.Types.ObjectId(),
  title: "Test Task",
  deadline: new Date(),
  course: "Test Course",
  status: "new",
  description: "Test Description",
}

vi.mock("server/actions/tasks", () => ({
  editTask: () => {},
  deleteTask: () => {},
  checkTask: () => {},
}))

describe("TaskCard component", () => {
  const mockSetEditable = vi.fn()
  const mockResetEditable = vi.fn()
  beforeEach(() => {
    cleanup()
    render(
      <TaskCard
        task={mockTask}
        setEditable={mockSetEditable}
        resetEditable={mockResetEditable}
        searchParams={{}}
      />,
    )
  })

  it("should render task details", () => {
    expect(screen.getByText(mockTask.title)).toBeDefined()
    expect(
      screen.getByText(
        new Date(mockTask.deadline).toLocaleString("ua-UK", {
          day: "2-digit",
          month: "2-digit",
        }),
      ),
    ).toBeDefined()
    expect(screen.getByText(mockTask.course)).toBeDefined()
    expect(screen.getByText(mockTask.status)).toBeDefined()
    expect(screen.getByText(mockTask.description)).toBeDefined()
  })

  it("should render three buttons", () => {
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })
})
