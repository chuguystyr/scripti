import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { vi, beforeEach, describe, expect, it } from "vitest"
import EditAccountInfoForm from "components/account/EditAccountInfoForm"

let mockUseActionStateReturn: unknown[] = [null, vi.fn(), false]

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useActionState: () => mockUseActionStateReturn,
  }
})

describe("EditAccountInfoForm", () => {
  const dummyAction = vi.fn()
  beforeEach(() => {
    mockUseActionStateReturn = [null, dummyAction, false]
    dummyAction.mockReset()
    cleanup()
  })

  it("renders the form with default values", () => {
    vi.spyOn(React, "useActionState").mockReturnValue([
      null,
      dummyAction,
      false,
    ])
    render(
      <EditAccountInfoForm
        name="John Doe"
        username="johndoe"
        email="john@example.com"
      />,
    )

    const inputs = screen.getAllByRole("textbox")
    expect(inputs).toHaveLength(3)
    expect(inputs[0].getAttribute("placeholder")).toBe("Name")
    expect(inputs[0].getAttribute("value")).toBe("John Doe")
    expect(inputs[1].getAttribute("placeholder")).toBe("Username")
    expect(inputs[1].getAttribute("value")).toBe("johndoe")
    expect(inputs[2].getAttribute("placeholder")).toBe("Email")
    expect(inputs[2].getAttribute("value")).toBe("john@example.com")
    expect(screen.getByRole("button").textContent).toBe("Save")
    const button = screen.getByRole("button") as HTMLButtonElement
    expect(button.disabled).toBeFalsy()
  })

  it("displays an error message when message is provided", () => {
    const errorMessage = "Error occurred"
    mockUseActionStateReturn = [errorMessage, dummyAction, false]
    render(
      <EditAccountInfoForm
        name="John Doe"
        username="johndoe"
        email="john@example.com"
      />,
    )

    expect(screen.getByText(errorMessage)).toBeDefined()
  })

  it("disables the submit button and shows 'Submitting...' when pending is true", () => {
    mockUseActionStateReturn = [null, dummyAction, true]
    render(
      <EditAccountInfoForm
        name="John Doe"
        username="johndoe"
        email="john@example.com"
      />,
    )

    const button = screen.getByRole("button") as HTMLButtonElement
    expect(button.textContent).toBe("Submitting...")
    expect(button.disabled).toBeTruthy()
  })
})
