import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

describe("Page", () => {
  it("renders homepage unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });

  it("renders a from", () => {
    render(<Page />);

    const from = screen.getByText("FROM:");

    expect(from).toBeInTheDocument();
  });
});
