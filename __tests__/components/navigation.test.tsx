import { describe, it, expect, beforeEach } from "vitest"
import { cleanup, render, screen, fireEvent } from "@testing-library/react"
import Navigation from "components/Navigation"

describe("Navigation component", () => {
  beforeEach(() => {
    cleanup()
  })

  it("should render the logo", () => {
    render(<Navigation />)
    const logo = screen.getByAltText("logo")
    expect(logo).toBeDefined()
  })

  it("should render menu items", () => {
    render(<Navigation />)
    const menus = screen.getAllByRole("list")
    expect(menus).toHaveLength(2)
    expect(menus.every((menu) => menu.children.length === 3)).toBeTruthy()
  })

  it("should toggle mobile menu visibility", () => {
    render(<Navigation />)
    const menuButton = screen.getByText("Menu")
    expect(menuButton).toBeDefined()
    fireEvent.click(menuButton)
    const closeMenuButton = screen.getByText("Close")
    expect(closeMenuButton).toBeDefined()
    fireEvent.click(closeMenuButton)
    expect(menuButton).toBeDefined()
  })
})
