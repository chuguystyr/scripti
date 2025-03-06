import { vi, describe, beforeEach, it, expect } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import React from "react"
import DeleteAccountForm from "components/account/DeleteAccountForm"

let mockUseActionStateReturn: unknown[] = [null, vi.fn(), false]

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useActionState: () => mockUseActionStateReturn,
  }
})

describe("DeleteAccountForm", () => {
  const dummyAction = vi.fn()

  beforeEach(() => {
    mockUseActionStateReturn = [null, dummyAction, false]
    dummyAction.mockReset()
    cleanup()
  })

  it("renders with default state", () => {
    render(<DeleteAccountForm />)
    const button = screen.getByRole("button", {
      name: /delete account/i,
    }) as HTMLButtonElement
    expect(button).toBeDefined()
    expect(button.disabled).toBeFalsy()
    expect(
      screen.queryByText(/Something went wrong. Please try again later./),
    ).toBeFalsy()
  })

  it("renders pending state with disabled button", () => {
    mockUseActionStateReturn = [null, dummyAction, true]
    render(<DeleteAccountForm />)
    const button = screen.getByRole("button", {
      name: /deleting\.\.\./i,
    }) as HTMLButtonElement
    expect(button.disabled).toBeTruthy()
  })

  it("displays an error message when provided", () => {
    const errorMessage = "Error deleting account"
    mockUseActionStateReturn = [errorMessage, dummyAction, false]
    render(<DeleteAccountForm />)
    expect(screen.getByText(errorMessage)).toBeDefined()
    const button = screen.getByRole("button", {
      name: /delete account/i,
    }) as HTMLButtonElement
    expect(button.disabled).toBeFalsy()
  })
})
