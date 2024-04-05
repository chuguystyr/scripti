import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Login from "app/login/page";

vi.mock("server/actions/account", () => ({
  login: () => {},
}));

vi.mock("react-dom", () => {
  return {
    useFormStatus: () => ({
      pending: false,
    }),
  };
});

describe("login page: general structure", () => {
  beforeAll(() => {
    render(<Login />);
  });

  it("should contain app's name and login label", () => {
    const appName = screen.getByRole("heading", { name: /Scripti/i });
    const label = screen.getByRole("heading", { name: /Log in/i });
    expect(appName).toBeDefined();
    expect(label).toBeDefined();
  });

  it("should render form fields", () => {
    const username = screen.getByLabelText(/Username/i);
    const password = screen.getByLabelText(/Password/i);
    expect(username).toBeDefined();
    expect(password).toBeDefined();
  });

  it("should render submit button", () => {
    const button = screen.getByRole("button", { name: /Log in/i });
    expect(button).toBeDefined();
  });

  it("should render link to signup page", () => {
    const link = screen.getByRole("link", { name: /Sign up/i });
    expect(link).toBeDefined();
  });
});

describe("login page: messages", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should display error message for missing fields", () => {
    render(<Login searchParams={{ error: "fields" }} />);
    const message = screen.getByText(/Please fill in all fields/i);
    expect(message).toBeDefined();
  });

  it("should display error message for invalid credentials", () => {
    render(<Login searchParams={{ error: "credentials" }} />);
    const message = screen.getByText(/Invalid credentials/i);
    expect(message).toBeDefined();
  });

  it("should display error message for internal error", () => {
    render(<Login searchParams={{ error: "internal" }} />);
    const message = screen.getByText(/Something went wrong. Please try again/i);
    expect(message).toBeDefined();
  });

  it("should display success message for signed up status", () => {
    render(<Login searchParams={{ status: "signed up" }} />);
    const message = screen.getByText(/Thanks for signing up. Enjoy the app./i);
    expect(message).toBeDefined();
  });
});
