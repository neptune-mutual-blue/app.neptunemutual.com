import React from "react"
import { useRouter } from "next/router";

export const CoverClaim = () => {
  const router = useRouter();
  const { cover_id } = router.query
  
  React.useEffect(() => {
    router.replace(`/cover/${cover_id}/claim/details`)
  })

  return <div>{cover_id}</div>;
};