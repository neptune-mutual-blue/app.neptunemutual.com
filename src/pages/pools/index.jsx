import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Pools() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pools/bond");
  }, [router]);

  return null;
}
