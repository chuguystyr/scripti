import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import Signup from "components/account/SignUpForm"
import * as accountActions from "server/actions/account"
import { SignUpFormValidationErrors } from "types/Utilities"

vi.mock("server/actions/account", () => ({
  signUp: vi.fn(),
}))

describe("signup page: general structure", () => {
  beforeAll(() => render(<Signup />))
  it("should contain app's name and signup label", () => {
    const heading = screen.getByRole("heading", { name: /Scripti/i })
    const label = screen.getByRole("heading", { name: /Sign up/i })
    expect(heading).toBeDefined()
    expect(label).toBeDefined()
  })
  it("should render form fields", () => {
    const name = screen.getByLabelText(/Name/)
    const username = screen.getByLabelText(/Username/i)
    const email = screen.getByLabelText(/Email/i)
    const password = screen.getByLabelText(/Password/i)
    expect(name).toBeDefined()
    expect(username).toBeDefined()
    expect(email).toBeDefined()
    expect(password).toBeDefined()
  })
  it("should render submit button", () => {
    const button = screen.getByRole("button", { name: /Sign up/i })
    expect(button).toBeDefined()
  })
  it("should render link to login page", () => {
    const link = screen.getByRole("link", { name: /Log in/i })
    expect(link).toBeDefined()
  })
})

describe("signup page: messages", () => {
  beforeEach(() => {
    cleanup()
    vi.resetAllMocks()
  })
  it("should display error message for missing fields", async () => {
    vi.mocked(accountActions.signUp).mockResolvedValue({
      error: SignUpFormValidationErrors.EMPTY_MANDATORY_FIELD,
      currentState: new FormData(),
    })
    render(<Signup />)
    const button = screen.getByRole("button", { name: /Sign up/i })
    fireEvent.click(button)
    const message = await screen.findByText(
      SignUpFormValidationErrors.EMPTY_MANDATORY_FIELD,
    )
    expect(message).toBeDefined()
  })
  it("should display error message for taken username", async () => {
    vi.mocked(accountActions.signUp).mockResolvedValue({
      error: SignUpFormValidationErrors.USERNAME_TAKEN,
      currentState: new FormData(),
    })
    render(<Signup />)
    const button = screen.getByRole("button", { name: /Sign up/i })
    fireEvent.click(button)
    const message = await screen.findByText(
      SignUpFormValidationErrors.USERNAME_TAKEN,
    )
    expect(message).toBeDefined()
  })
  it("should display error message for internal error", async () => {
    vi.mocked(accountActions.signUp).mockResolvedValue({
      error: SignUpFormValidationErrors.INTERNAL_ERROR,
      currentState: new FormData(),
    })
    render(<Signup />)
    const button = screen.getByRole("button", { name: /Sign up/i })
    fireEvent.click(button)
    const message = await screen.findByText(
      SignUpFormValidationErrors.INTERNAL_ERROR,
    )
    expect(message).toBeDefined()
  })
})
