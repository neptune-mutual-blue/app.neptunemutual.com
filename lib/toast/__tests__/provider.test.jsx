import { useToast } from "@/lib/toast/context";
import { ToastProvider } from "@/lib/toast/provider";
import { DEFAULT_VARIANT } from "@/src/config/toast";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";

/**
 * @typedef PushNotif
 * @prop {'pushError'|'pushWarning'|'pushSuccess'|'pushInfo'|'pushLoading'|'push'|'pushCustom'|'remove'} param.action
 * @prop {string} param.id
 * @prop {string} param.message
 * @prop {string} param.title
 * @prop {number} [param.lifetime]
 * @prop {string} [param.type]
 * @prop {JSX.Element} [param.icon]
 * @prop {string} [param.header]
 *
 *
 * @typedef {(data: PushNotif) => any} NotifCB
 *
 * @type {Object.<string, NotifCB>}
 */

/**
 * @type {Object.<string, NotifCB>}
 */
const eventListener = {
  listen: (_data) => {},
  emit: (data) => eventListener.listen(data),
};

function CustomChildren() {
  const toast = useToast();

  useEffect(() => {
    eventListener.listen = (data) => {
      if ("push" === data.action) {
        return toast.push(data.message, data.type, data.lifetime, data.title);
      }

      if ("pushCustom" === data.action) {
        return toast.pushCustom(data);
      }

      if (
        [
          "pushError",
          "pushWarning",
          "pushSuccess",
          "pushInfo",
          "pushLoading",
        ].includes(data.action)
      ) {
        return toast[data.action](data);
      }

      if ("remove" === data.action) {
        return toast.remove(data.id);
      }
    };
  }, [toast]);

  return <p>Testing</p>;
}

function WithProvider() {
  return (
    <ToastProvider variant={DEFAULT_VARIANT}>
      <CustomChildren />
    </ToastProvider>
  );
}

function generateRandomId() {
  return Date.now() + "-" + Math.floor(Math.random() * 10000);
}

describe("ToastProvider", () => {
  test("Should render ToastProvider", () => {
    render(<WithProvider />);

    const container = screen.getByTestId("toast-container");

    expect(container).toBeInTheDocument();
  });

  test("Should render ToastProvider with Push Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "push",
      id: generateRandomId(),
      type: "",
      lifetime: 10,
      title: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.title);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with Push Notification and 30secs timeout", async () => {
    render(<WithProvider />);

    const data = {
      action: "push",
      id: generateRandomId(),
      type: "",
      title: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.title);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushCustom Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushCustom",
      id: generateRandomId(),
      type: "",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.header);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushCustom Notification and 30secs timeout", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushCustom",
      id: generateRandomId(),
      type: "",
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.header);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushError Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushError",
      id: generateRandomId(),
      type: "Error",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.type);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushSuccess Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushSuccess",
      id: generateRandomId(),
      type: "Success",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.type);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });
  test("Should render ToastProvider with PushWarning Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushWarning",
      id: generateRandomId(),
      type: "Warning",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.type);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushInfo Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushInfo",
      id: generateRandomId(),
      type: "Info",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.type);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushLoading Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushLoading",
      id: generateRandomId(),
      type: "Loading",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.type);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test("Should render ToastProvider with PushLoading Notification", async () => {
    render(<WithProvider />);

    const data = {
      action: "pushLoading",
      id: generateRandomId(),
      type: "Loading",
      lifetime: 10,
      header: "Sample Push Title",
      message: "Sample Push message",
    };

    act(() => {
      eventListener.emit(data);
    });

    const title = screen.getByText(data.type);
    const message = screen.getByText(data.message);
    const closeButton = screen.getByText("Close");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(closeButton.parentElement);
    });

    const _title = screen.queryByText(data.type);
    const _message = screen.queryByText(data.message);
    const _closeButton = screen.queryByText("Close");

    expect(_title).not.toBeInTheDocument();
    expect(_message).not.toBeInTheDocument();
    expect(_closeButton).not.toBeInTheDocument();
  });
});
