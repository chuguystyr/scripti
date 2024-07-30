import { cleanup, render, screen } from "@testing-library/react"
import SearchBar from "components/SearchBar"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("search bar", () => {
  beforeEach(() => {
    cleanup()
  })
  it("should render search bar", () => {
    vi.mock("next/navigation", () => ({
      useSearchParams: vi.fn(),
      usePathname: vi.fn(),
      useRouter: vi.fn(() => ({ replace: vi.fn() })),
    }))
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("Search")
    expect(input).toBeDefined()
  })
})
