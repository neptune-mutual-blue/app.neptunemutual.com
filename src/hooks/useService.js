import { useEffect, useState } from "react";

/**
 * @template T
 *
 * @param {() => Promise<T>} callback
 */
export function useService(callback) {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    callback().then(({ data, total }) => {
      setData(data);
      setLoading(false);

      setHasMore(data);
    });
  }, []);

  return {
    data,
    setData,
    hasMore,
    setHasMore,
    loading,
    setLoading,
  };
}
