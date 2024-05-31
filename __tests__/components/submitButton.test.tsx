import { describe, it, expect, vi, afterEach } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import SubmitButton from "components/SubmitButton"
import * as ReactDOM from "react-dom"

vi.mock("react-dom", () => {
  return {
    useFormStatus: vi.fn(() => ({ pending: false })),
  }
})

describe("SubmitButton component", () => {
  afterEach(() => {
    cleanup()
  })

  it("should render the button with the provided text when pending is false", () => {
    render(<SubmitButton text="Submit" />)
    const button = screen.getByRole("button")
    expect(button).toBeDefined()
    expect(button.textContent).toBe("Submit")
  })

  it('should display "Submitting..." and be disabled when pending is true', () => {
    vi.mocked(ReactDOM).useFormStatus.mockReturnValue({
      pending: true,
      data: new FormData(),
      method: "POST",
      action: "",
    })
    render(<SubmitButton text="Submit" />)
    const button = screen.getByRole("button")
    expect(button).toBeDefined()
    expect(button.textContent).toBe("Submitting...")
    expect(button.attributes.getNamedItem("disabled")).toBeDefined()
  })
})
