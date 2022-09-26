import InfoIcon from "@/lib/toast/components/icons/InfoIcon";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import ToastMessage from "../message";

describe("ToastMessage", () => {
  const defaultProps = {
    id: Date.now(),
    message: "Sample Message",
    type: "", // custom
    header: "Custom Header",
    icon: <InfoIcon className="w-6 h-6 text-FA5C2F" aria-hidden="true" />,
    title: "",
    onRemove: jest.fn(),
    lifetime: true,
  };
  const { initialRender, rerenderFn } = initiateTest(
    ToastMessage,
    defaultProps
  );

  test("Should render ToastMessage with custom type and header as title", () => {
    const props = {
      ...defaultProps,
      onRemove: jest.fn(),
    };
    initialRender(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(defaultProps.header);
    const message = screen.getByText(defaultProps.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);

    expect(props.onRemove).toBeCalled();
  });

  test("Should render ToastMessage with custom type with title", () => {
    const props = {
      ...defaultProps,
      title: "Using Title",
      onRemove: jest.fn(),
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.title);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);

    expect(props.onRemove).toBeCalled();
  });

  test("Should render ToastMessage with Info Type", async () => {
    const props = {
      ...defaultProps,
      type: "Info",
      onRemove: jest.fn(() => {}),
      lifetime: 10,
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.type);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    await waitFor(() => expect(props.onRemove).toBeCalled());
  });

  test("Should render ToastMessage with Info Type", () => {
    const props = {
      ...defaultProps,
      type: "Info",
      onRemove: jest.fn(),
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.type);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);

    expect(props.onRemove).toBeCalled();
  });

  test("Should render ToastMessage with Error Type", () => {
    const props = {
      ...defaultProps,
      type: "Error",
      onRemove: jest.fn(),
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.type);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);

    expect(props.onRemove).toBeCalled();
  });

  test("Should render ToastMessage with Warning Type", () => {
    const props = {
      ...defaultProps,
      type: "Warning",
      onRemove: jest.fn(),
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.type);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);

    expect(props.onRemove).toBeCalled();
  });

  test("Should render ToastMessage with Success Type", () => {
    const props = {
      ...defaultProps,
      type: "Success",
      onRemove: jest.fn(),
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.type);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);

    expect(props.onRemove).toBeCalled();
  });

  test("Should render ToastMessage with Loading Type", () => {
    const props = {
      ...defaultProps,
      type: "Loading",
      onRemove: undefined,
    };
    rerenderFn(props);

    const toastMessage = screen.getByTestId("toast-message");
    const title = screen.getByText(props.type);
    const message = screen.getByText(props.message);
    const closeButton = screen.getByText("Close");

    expect(toastMessage).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton.parentElement).toBeInTheDocument();
    expect(closeButton.parentElement.tagName).toEqual("BUTTON");

    fireEvent.click(closeButton.parentElement);
  });
});
