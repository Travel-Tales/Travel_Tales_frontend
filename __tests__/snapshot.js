import { render } from "@testing-library/react";
import Page from "../src/app/test/page";
it("renders homepage unchanged", () => {
  const { container } = render(<Page />);
  expect(container).toMatchSnapshot();
});
