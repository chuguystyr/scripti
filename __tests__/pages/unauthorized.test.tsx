import { render, screen } from "@testing-library/react"
import { describe, test, beforeAll, expect } from "vitest"
import Unauthorized from "app/unauthorized"

describe("Unauthorized Component", () => {
  beforeAll(() => {
    render(<Unauthorized />)
  })

  test("renders 401 heading", () => {
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeDefined()
  })

  test("renders access message", () => {
    const message = screen.getByText(
      "You don't have access to this page. Please login to continue.",
    )
    expect(message).toBeDefined()
  })

  test("renders login link with correct href", () => {
    const loginLink: HTMLAnchorElement = screen.getByRole("link", {
      name: /Log in/i,
    })
    expect(loginLink).toBeDefined()
    expect(loginLink.href).toContain("/login")
  })
})
