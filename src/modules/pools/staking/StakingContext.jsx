import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";

const initialState = {
  data: [],
};

const REDUCER_ACTIONS = {
  SET: "SET",
  ADD: "ADD",
  UPDATE: "UPDATE",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case REDUCER_ACTIONS.ADD:
      return { ...state, data: [...state.data, ...payload] };
    case REDUCER_ACTIONS.SET:
      return { ...state, data: payload };
    case REDUCER_ACTIONS.UPDATE:
      const data = state.data.map((item) => {
        if (item.id === payload.id) {
          Object.assign(item, payload.data);
        }

        return item;
      });

      return { ...state, data };
    default:
      return state;
  }
}

const StakingContext = createContext({
  data: [],
  loading: true,
  hasMore: false,
  handleShowMore: () => {},
  setData: (_data) => {},
  addData: (_data) => {},
  updateData: (_id, _object) => {},
});

export function StakingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, loading, hasMore, handleShowMore } = useTokenStakingPools();

  /**
   * Set items
   * @param {array} arrayOfItems - array of covers
   */
  const setData = useCallback(
    (arrayOfItems) =>
      dispatch({
        type: REDUCER_ACTIONS.SET,
        payload: arrayOfItems,
      }),
    []
  );

  /**
   * Add items
   * @param {array} arrayOfItems - array of covers
   */
  const addData = useCallback(
    (arrayOfItems) =>
      dispatch({
        type: REDUCER_ACTIONS.ADD,
        payload: arrayOfItems,
      }),
    []
  );

  /**
   * Update item
   * @param {string} id - item unique identification
   * @param {object} data - Properties to edit on the item
   */
  const updateData = useCallback(
    (id, data) =>
      dispatch({
        type: REDUCER_ACTIONS.UPDATE,
        payload: {
          id,
          data,
        },
      }),
    []
  );

  useEffect(() => {
    dispatch({
      type: REDUCER_ACTIONS.SET,
      payload: data.pools,
    });
  }, [data.pools]);

  return (
    <StakingContext.Provider
      value={{
        ...state,
        loading,
        hasMore,
        handleShowMore,
        setData,
        addData,
        updateData,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
}

export const useStaking = () => useContext(StakingContext);

export function withStaking(Component) {
  return function provided() {
    return (
      <StakingProvider>
        <Component />
      </StakingProvider>
    );
  };
}
