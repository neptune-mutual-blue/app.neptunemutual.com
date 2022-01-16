import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";

export default function Identicon({ account }) {
  const ref = useRef();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return (
    <div
      className="flex justify-center items-center h-4 w-4 rounded-full"
      ref={ref}
    />
  );
}
