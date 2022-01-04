import { showOrHideActiveReporting } from "./activereporting.service.mock";
import { useState, useEffect } from "react";

export const useNoOfArray = () => {
  const [show, setShow] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchshow() {
      const response = await showOrHideActiveReporting();

      if (!ignore) setShow(response);
    }

    fetchshow();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    show,
  };
};
