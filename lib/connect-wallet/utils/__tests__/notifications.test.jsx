import { NetworkNames } from "@/lib/connect-wallet/config/chains";
import { ConnectorNames } from "@/lib/connect-wallet/config/connectors";
import * as notifications from "../notifications";

const notify = jest.fn(({ title, message }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
});

describe("Notifications", () => {
  test("Wrong Network", () => {
    notifications.wrongNetwork(
      notify,
      NetworkNames[80001],
      ConnectorNames.BSC,
      ""
    );

    expect(notify).toBeCalled();
  });

  test("Provider Error", () => {
    notifications.providerError(notify, "");

    expect(notify).toBeCalled();
  });

  test("Auth Error", () => {
    notifications.authError(notify, "");

    expect(notify).toBeCalled();
  });

  test("Unidentified Error", () => {
    notifications.unidentifiedError(notify, "");

    expect(notify).toBeCalled();
  });
});
