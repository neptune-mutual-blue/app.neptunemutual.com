import React from "react"
import { useRouter } from "next/router";

export const CoverId = () => {
  const router = useRouter();
  const { cover_id } = router.query

  React.useEffect(() => {
    router.replace(`${cover_id}/options`)
  })

  return <div />;
};