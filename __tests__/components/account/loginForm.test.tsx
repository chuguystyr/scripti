import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import LoginForm from "components/account/LoginForm"
import React from "react"
import { LoginFormValidationErrors, NonSpecificErrors } from "types/Utilities"
import * as accountActions from "server/actions/account"

vi.mock("server/actions/account", () => ({
  login: vi.fn(),
}))

describe("login form: general structure", () => {
  beforeAll(async () => {
    render(<LoginForm signedUp={false} />)
  })

  it("should contain app's name and login label", () => {
    const appName = screen.getByRole("heading", { name: /Scripti/i })
    const label = screen.getByRole("heading", { name: /Log in/i })
    expect(appName).toBeDefined()
    expect(label).toBeDefined()
  })

  it("should render form fields", () => {
    const username = screen.getByLabelText(/Username/i)
    const password = screen.getByLabelText(/Password/i)
    expect(username).toBeDefined()
    expect(password).toBeDefined()
  })

  it("should render submit button", () => {
    const button = screen.getByRole("button", { name: /Log in/i })
    expect(button).toBeDefined()
  })

  it("should render link to signup page", () => {
    const link = screen.getByRole("link", { name: /Sign up/i })
    expect(link).toBeDefined()
  })
})
describe("login form: signed up message", () => {
  it("should display message for signed up status", async () => {
    render(<LoginForm signedUp={true} />)
    const message = screen.getByText(/Thanks for signing up. Enjoy the app./i)
    expect(message).toBeDefined()
  })
})
describe("login form: error messages", () => {
  beforeEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  it("should display error message for missing fields", async () => {
    vi.mocked(accountActions.login).mockResolvedValue(
      LoginFormValidationErrors.EMPTY_MANDATORY_FIELD,
    )

    render(<LoginForm signedUp={false} />)
    const username = screen.getByLabelText(/Username/i)
    fireEvent.change(username, { target: { value: "john_smith" } })
    const button = screen.getByRole("button", { name: /Log in/i })
    fireEvent.click(button)
    const message = await screen.findByText(
      LoginFormValidationErrors.EMPTY_MANDATORY_FIELD,
    )
    expect(message).toBeDefined()
    expect(message.classList).toContain("text-red-500")
  })

  it("should display error message for invalid credentials", async () => {
    vi.mocked(accountActions.login).mockResolvedValue(
      LoginFormValidationErrors.INVALID_CREDENTIALS,
    )

    render(<LoginForm signedUp={false} />)
    const username = screen.getByLabelText(/Username/i)
    const password = screen.getByLabelText(/Password/i)
    fireEvent.change(username, { target: { value: "john_smith" } })
    fireEvent.change(password, { target: { value: "password" } })
    const button = screen.getByRole("button", { name: /Log in/i })

    fireEvent.click(button)

    const message = await screen.findByText(
      LoginFormValidationErrors.INVALID_CREDENTIALS,
    )
    expect(message).toBeDefined()
    expect(message.classList).toContain("text-red-500")
  })

  it("should display error message for internal error", async () => {
    vi.mocked(accountActions.login).mockResolvedValue(
      NonSpecificErrors.INTERNAL_ERROR,
    )

    render(<LoginForm signedUp={false} />)
    const username = screen.getByLabelText(/Username/i)
    const password = screen.getByLabelText(/Password/i)
    fireEvent.change(username, { target: { value: "john_smith" } })
    fireEvent.change(password, { target: { value: "password" } })
    const button = screen.getByRole("button", { name: /Log in/i })

    fireEvent.click(button)

    const message = await screen.findByText(NonSpecificErrors.INTERNAL_ERROR)
    expect(message).toBeDefined()
    expect(message.classList).toContain("text-red-500")
  })
})
