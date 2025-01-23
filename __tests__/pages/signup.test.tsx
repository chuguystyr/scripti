import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import Signup from "app/signup/page"

vi.mock("server/actions/account", () => ({
  signUp: () => {},
}))

vi.mock("react-dom", () => {
  return {
    useFormStatus: () => ({
      pending: false,
    }),
  }
})

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
// FIXME: update tests to reflect new error handling logic
describe("signup page: messages", () => {
  beforeEach(() => {
    cleanup()
  })
  it("should display error message for missing fields", async () => {
    render(<Signup />)
    const message = screen.getByText(/Please fill in all fields/i)
    expect(message).toBeDefined()
  })
  it("should display error message for taken username", async () => {
    render(<Signup />)
    const message = screen.getByText(/Username is already taken/i)
    expect(message).toBeDefined()
  })
  it("should display error message for internal error", async () => {
    render(<Signup />)
    const message = screen.getByText(/Something went wrong. Please try again/i)
    expect(message).toBeDefined()
  })
})
