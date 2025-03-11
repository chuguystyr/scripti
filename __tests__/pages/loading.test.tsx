import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Loader, { metadata } from "app/loading"

describe("Loader component", () => {
  it("renders the loader icon and text", () => {
    render(<Loader />)
    const icon = screen.getByText("💡")
    const text = screen.getByText("Scripti")
    expect(icon).toBeDefined()
    expect(text).toBeDefined()
  })
})

describe("Metadata export", () => {
  it("exports correct metadata", () => {
    expect(metadata.title).toBe("Loading... | Scripti")
    expect(metadata.description).toBe(
      "Please wait while we prepare your content.",
    )
    expect(metadata.robots).toBe("noindex, nofollow")
  })
})
