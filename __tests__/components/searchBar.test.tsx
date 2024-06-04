import { cleanup, render, screen } from "@testing-library/react"
import SearchBar from "components/SearchBar"
import { beforeEach, describe, expect } from "vitest"

describe("search bar", () => {
  beforeEach(() => {
    cleanup()
  })
  it("should render search bar", () => {
    render(<SearchBar />)
    const input = screen.getByRole("input", { name: "search" })
    expect(input).toBeDefined()
  })
})
