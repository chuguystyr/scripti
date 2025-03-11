import { render, screen } from "@testing-library/react"
import NotFoundPage, { metadata } from "app/not-found"
import { describe, expect, test, beforeAll } from "vitest"

describe("NotFoundPage component", () => {
  beforeAll(() => {
    render(<NotFoundPage />)
  })
  test("renders the 404 heading", () => {
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading.textContent).toBe("404")
  })

  test("renders the descriptive message", () => {
    const message = screen.getByText(
      /We're sorry, the page you are looking for cannot be found/i,
    )
    expect(message).toBeDefined()
  })

  test("renders the link with correct href", () => {
    const link: HTMLAnchorElement = screen.getByRole("link", {
      name: /Back to Home/i,
    })
    expect(link).toBeDefined()
    expect(link.href).toContain("/protected/home/0")
  })
})

describe("NotFoundPage metadata", () => {
  test("has the correct title", () => {
    const title = metadata.title
    expect(title).toBe("404 - Page Not Found | Scripti")
  })

  test("has the correct description", () => {
    const description = metadata.description
    expect(description).toContain("cannot be found")
  })

  test("has proper robots meta", () => {
    const robots = metadata.robots
    expect(robots).toBe("noindex, nofollow")
  })

  test("has proper OpenGraph configuration", () => {
    const title = metadata?.openGraph?.title
    const description = metadata?.openGraph?.description
    expect(title).toBeDefined()
    expect(title).toBe("404 - Page Not Found | Scripti")
    expect(description).toBeDefined()
    expect(description).toContain("Oops!")
  })

  test("has proper Twitter configuration", () => {
    const title = metadata?.twitter?.title
    expect(title).toBeDefined()
    expect(title).toBe("404 - Page Not Found | Scripti")
  })
})
