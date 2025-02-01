import { describe, it, expect, beforeEach } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import ErrorPage from "app/error"

describe("error page", () => {
  beforeEach(() => {
    cleanup()
  })
  it("should render when empty error is thrown", () => {
    const error = new Error()
    const reset = () => {}
    render(<ErrorPage error={error} reset={reset} />)
    const header = screen.getByRole("heading", { name: "500" })
    const button = screen.getByRole("button", { name: "Reload page" })
    expect(header).toBeDefined()
    expect(button).toBeDefined()
  })
  it("should render when internal error is thrown", () => {
    const error = new Error("Internal")
    const reset = () => {}
    render(<ErrorPage error={error} reset={reset} />)
    const header = screen.getByRole("heading", { name: "500" })
    const button = screen.getByRole("button", { name: "Reload page" })
    expect(header).toBeDefined()
    expect(button).toBeDefined()
  })
})
