import { render, screen, cleanup } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import AccountInfoSection from "components/account/AccountInfoSection"

const props = {
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
}

describe("AccountInfoSection", () => {
  beforeEach(() => {
    cleanup()
  })

  const renderComponent = async () => {
    const element = await AccountInfoSection(props)
    return render(element)
  }

  it("renders account info header", async () => {
    await renderComponent()
    expect(screen.getByText("Account info")).toBeDefined()
  })

  it("renders user details correctly", async () => {
    await renderComponent()
    expect(screen.getByText(`Name: ${props.name}`)).toBeDefined()
    expect(screen.getByText(`Username: ${props.username}`)).toBeDefined()
    expect(screen.getByText(`E-mail: ${props.email}`)).toBeDefined()
  })

  it("renders edit link with correct href", async () => {
    await renderComponent()
    const editLink = screen.getByRole("link", {
      name: /edit/i,
    }) as HTMLAnchorElement
    expect(editLink.href).toBe("http://localhost:3000/protected/account/edit")
  })
})
