import { render, screen, cleanup } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import AccountInfoSection from "components/account/AccountInfoSection"
import User from "models/User"

const props = {
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
}

describe("AccountInfoSection", () => {
  vi.mock("server/protection", () => ({
    protector: vi.fn(),
  }))
  vi.mock("server/db", () => ({
    default: vi.fn(),
  }))
  beforeEach(() => {
    cleanup()
  })

  vi.spyOn(User, "findById").mockReturnValue({
    orFail: () => Promise.resolve(props),
  } as never)

  const renderComponent = async () => {
    const element = await AccountInfoSection({})
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
