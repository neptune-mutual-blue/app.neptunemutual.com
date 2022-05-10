import React, { useCallback, useEffect, useReducer } from "react";

import { useFetchCovers } from "@/src/hooks/useFetchCovers";

const initValue = {
  loading: false,
  getInfoByKey: (_key) => ({}),
  covers: [],
  updateCoverInfo: (_key, _payload) => {},
};

const initialState = {
  covers: [],
};

const CoversContext = React.createContext(initValue);

export function useCovers() {
  const context = React.useContext(CoversContext);
  if (context === undefined) {
    throw new Error("useCovers must be used within a CoversProvider");
  }
  return context;
}

const ACTIONS = {
  UPDATE_COVER_INFO: "UPDATE_COVER_INFO",
  UPDATE_COVER_LIST: "UPDATE_COVER_LIST",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.UPDATE_COVER_INFO:
      const covers = state.covers.map((cover) => {
        if (cover.key === payload.key) {
          Object.assign(cover, payload.data);
        }

        return cover;
      });

      return { ...state, covers };
    case ACTIONS.UPDATE_COVER_LIST:
      return { ...state, covers: payload };
    default:
      return state;
  }
}

export const CoversProvider = ({ children }) => {
  const { data, loading } = useFetchCovers();
  const [state, dispatch] = useReducer(reducer, initialState);

  const getInfoByKey = useCallback(
    (coverKey) => state.covers.find((x) => x.key === coverKey) || {},
    [state.covers]
  );

  const updateCoverInfo = useCallback((key, data) => {
    dispatch({
      type: ACTIONS.UPDATE_COVER_INFO,
      payload: {
        key,
        data,
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: ACTIONS.UPDATE_COVER_LIST,
      payload: data,
    });
  }, [data]);

  return (
    <CoversContext.Provider
      value={{ covers: state.covers, getInfoByKey, loading, updateCoverInfo }}
    >
      {children}
    </CoversContext.Provider>
  );
};
