import { describe, it, expect, beforeEach, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import SetTask from "components/tasks/SetTask"

describe("SetTask component", () => {
  vi.mock("server/actions/tasks", () => ({
    setTask: () => {},
  }))

  vi.mock("react-dom", () => {
    return {
      useFormStatus: () => ({
        pending: false,
      }),
    }
  })

  const mockClose = vi.fn()

  beforeEach(() => {
    cleanup()
    render(<SetTask close={mockClose} searchParams={{}} />)
  })

  it("should render form fields and labels", () => {
    expect(screen.getByLabelText("Title")).toBeDefined()
    expect(screen.getByLabelText("Course")).toBeDefined()
    expect(screen.getByLabelText("Deadline")).toBeDefined()
    expect(screen.getByLabelText("Description")).toBeDefined()
  })

  it("should render the Save button", () => {
    const saveButton = screen.getByRole("button", { name: "Save" })
    expect(saveButton).toBeDefined()
  })
})
