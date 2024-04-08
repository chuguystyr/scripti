import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DateTime from "components/DateTime";
import * as useDateTimeModule from "hooks/useDataTime";

describe("DateTime component", () => {
  it("should render the formatted date and time", () => {
    const mockUseDateTime = vi.spyOn(useDateTimeModule, "useDateTime");
    mockUseDateTime.mockReturnValue({
      time: "12:00",
      dayMonth: "Friday, January 1",
    });

    render(<DateTime />);
    expect(screen.getByText("Friday, January 1 | 12:00")).toBeDefined();

    mockUseDateTime.mockRestore();
  });
});
