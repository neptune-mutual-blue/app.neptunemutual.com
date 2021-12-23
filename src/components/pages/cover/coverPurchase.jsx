import React from "react"
import { useRouter } from "next/router";

export const CoverPurchase = () => {
  const router = useRouter();
  const { cover_id } = router.query
  
  React.useEffect(() => {
    router.replace(`/cover/${cover_id}/purchase/details`)
  })

  return <div />;
};