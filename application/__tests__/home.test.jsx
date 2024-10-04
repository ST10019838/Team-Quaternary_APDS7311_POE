import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Home from "../src/app/page";  // Adjust the import if your Home component is in a different path

describe("Home Page", () => {
  it("check for relevant text", () => {
    const { getByText } = render(<Home />);

    expect(getByText("Get started by editing")).toBeInTheDocument();
    expect(
      getByText("Find in-depth information about Next.js features and API.")
    ).toBeInTheDocument();
  });
});