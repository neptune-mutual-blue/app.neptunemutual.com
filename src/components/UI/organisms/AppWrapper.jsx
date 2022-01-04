import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { networkId } from "@/src/config/environment";
import { useNotifier } from "@/src/hooks/useNotifier";

export const AppWrapper = ({ children }) => {
  const { notifier } = useNotifier();

  useEagerConnect(networkId, notifier);
  useInactiveListener(networkId, notifier);

  return <>{children}</>;
};
