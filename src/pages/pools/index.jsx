import { useRouter } from "next/router";
import { useEffect } from "react";

const Pools = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pools/bond");
  }, [router]);

  return null;
};

export default Pools;
