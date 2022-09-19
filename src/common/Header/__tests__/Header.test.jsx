import { Header } from "@/common/Header/Header";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { fireEvent, screen } from "@testing-library/react";

describe("Header test", () => {
  const { initialRender } = initiateTest(Header, {}, () => {
    mockFn.useRouter({
      ...testData.router,
      events: {
        on: jest.fn((...args) => args[1]()),
        off: jest.fn(),
        emit: jest.fn(),
      },
    });
    mockFn.useNetwork();
    mockFn.useWeb3React();
    mockFn.useAuth();
  });

  beforeEach(() => {
    initialRender();
  });

  test("should render figure", () => {
    const modals = screen.getByRole("figure");
    expect(modals).toBeInTheDocument();
  });

  test("should render account details modal when clicking on acount", () => {
    const text = screen.getByText(/account details/i);
    fireEvent.click(text);

    const modals = screen.getAllByRole("dialog");
    expect(modals.length).toBe(2);

    const disconnect = screen.getByText(/Disconnect/i);
    fireEvent.click(disconnect);
  });

  test("should display transaction popup", () => {
    const buttons = screen.getAllByRole("button");

    expect(buttons[3]).toHaveTextContent("transaction overview button");
    fireEvent.click(buttons[3]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
});
