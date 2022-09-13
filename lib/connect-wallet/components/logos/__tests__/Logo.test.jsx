import AvaxLogo from "@/lib/connect-wallet/components/logos/AvaxLogo";
import BSCLogo from "@/lib/connect-wallet/components/logos/BSCLogo";
import EthLogo from "@/lib/connect-wallet/components/logos/EthLogo";
import Globe from "@/lib/connect-wallet/components/logos/Globe";
import KovanLogo from "@/lib/connect-wallet/components/logos/KovanLogo";
import PolygonLogo from "@/lib/connect-wallet/components/logos/PolygonLogo";
import RopstenLogo from "@/lib/connect-wallet/components/logos/RopstenLogo";
import { render } from "@testing-library/react";

describe("Should display this logos", () => {
  test("AvaxLogo", () => {
    const { getByTestId } = render(<AvaxLogo data-testid="AvaxLogo" />);

    const logo = getByTestId("AvaxLogo");

    expect(logo).toBeInTheDocument();
  });

  test("BSCLogo", () => {
    const { getByTestId } = render(<BSCLogo data-testid="BSCLogo" />);

    const logo = getByTestId("BSCLogo");

    expect(logo).toBeInTheDocument();
  });

  test("EthLogo", () => {
    const { getByTestId } = render(<EthLogo data-testid="EthLogo" />);

    const logo = getByTestId("EthLogo");

    expect(logo).toBeInTheDocument();
  });

  test("Globe", () => {
    const { getByTestId } = render(<Globe data-testid="Globe" />);

    const logo = getByTestId("Globe");

    expect(logo).toBeInTheDocument();
  });

  test("KovanLogo", () => {
    const { getByTestId } = render(<KovanLogo data-testid="KovanLogo" />);

    const logo = getByTestId("KovanLogo");

    expect(logo).toBeInTheDocument();
  });

  test("PolygonLogo", () => {
    const { getByTestId } = render(<PolygonLogo data-testid="PolygonLogo" />);

    const logo = getByTestId("PolygonLogo");

    expect(logo).toBeInTheDocument();
  });

  test("RopstenLogo", () => {
    const { getByTestId } = render(<RopstenLogo data-testid="RopstenLogo" />);

    const logo = getByTestId("RopstenLogo");

    expect(logo).toBeInTheDocument();
  });
});
