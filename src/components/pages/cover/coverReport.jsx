import React from "react"
import { useRouter } from "next/router";

export const CoverReport = () => {
  const router = useRouter();
  const { cover_id } = router.query
  
  React.useEffect(() => {
    router.replace(`/cover/${cover_id}/report/details`)
  })

  return <div>{cover_id}</div>;
};