import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import ChangePasswordForm from "components/account/ChangePasswordForm"

let mockUseActionStateReturn: unknown[] = [null, vi.fn(), false]

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useActionState: () => mockUseActionStateReturn,
  }
})

describe("ChangePasswordForm", () => {
  const dummyAction = vi.fn()
  beforeEach(() => {
    mockUseActionStateReturn = [null, dummyAction, false]
    dummyAction.mockReset()
    cleanup()
  })

  it("renders form inputs and submit button when not pending with no message", () => {
    vi.spyOn(React, "useActionState").mockReturnValue([
      null,
      dummyAction,
      false,
    ])
    render(<ChangePasswordForm />)
    expect(screen.getByPlaceholderText("Old Password")).toBeDefined()
    expect(screen.getByPlaceholderText("New Password")).toBeDefined()
    const button = screen.getByRole("button") as HTMLButtonElement
    expect(button.disabled).toBeFalsy()
    expect(button.textContent).toBe("Change")
  })

  it("renders form inputs and submit button when not pending with error message", () => {
    const errorMessage = "Something went wrong. Please try again later."
    mockUseActionStateReturn = [errorMessage, dummyAction, false]
    render(<ChangePasswordForm />)
    expect(screen.getByText(errorMessage)).toBeDefined()
    expect(screen.getByPlaceholderText("Old Password")).toBeDefined()
    expect(screen.getByPlaceholderText("New Password")).toBeDefined()
    const button = screen.getByRole("button") as HTMLButtonElement
    expect(button.disabled).toBeFalsy()
    expect(button.textContent).toBe("Change")
  })
})
