import { render, screen } from "@testing-library/react"
import { describe, it, expect, beforeAll } from "vitest"
import Main from "app/page"

describe("main page: general structure", () => {
  beforeAll(() => {
    render(<Main />)
  })
  it("should have a logo and h1 header", () => {
    const image = screen.getByRole("img")
    const heading = screen.getByRole("heading", { level: 1 })

    expect(image).not.toBeNull()
    expect(heading).not.toBeNull()
  })
  it("should have login, signup and get started buttons", () => {
    const links = screen.getAllByRole("link")

    expect(links).not.toBeNull()
    expect(links).toHaveLength(3)
    expect(
      links.every(
        (link) => link.textContent === "Login" || "Sign Up" || "Get started",
      ),
    ).toBeTruthy()
  })
})
