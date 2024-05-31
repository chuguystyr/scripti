import { describe, it, expect, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"
import Loader from "app/loading"

describe("loading page", () => {
  beforeAll(() => {
    render(<Loader />)
  })
  it("should contain an animated lightbulb emoji", () => {
    const lightbulb = screen.getByText("💡")
    expect(lightbulb).toBeDefined()
    expect(lightbulb.classList.contains("animate-spin")).toBe(true)
  })
  it("should contain an animated app's name", () => {
    const appName = screen.getByText("Scripti")
    expect(appName).toBeDefined()
    expect(appName.classList.contains("animate-pulse")).toBe(true)
  })
})
