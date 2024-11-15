import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for initial list to render
  await screen.findByText(/lorem testum 1/g);

  // Navigate to the new question form
  fireEvent.click(screen.queryByText("New Question"));

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Prompt:/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1:/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2:/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3:/), {
    target: { value: "Test Answer 3" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4:/), {
    target: { value: "Test Answer 4" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer:/), {
    target: { value: "1" },
  });

  // Submit the form
  fireEvent.submit(screen.getByText(/Add Question/));

  // Return to the question list to verify the new question appears
  fireEvent.click(screen.getByText(/View Questions/));

  expect(await screen.findByText(/Test Prompt/)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer:/)[0], {
    target: { value: "3" },
  });

  expect(screen.queryAllByLabelText(/Correct Answer:/)[0].value).toBe("3");

  rerender(<App />);

  expect(screen.queryAllByLabelText(/Correct Answer:/)[0].value).toBe("3");
});
