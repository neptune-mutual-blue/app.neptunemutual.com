const { useState, useEffect } = require("react");

export const useDelayedValueUpdate = ({
  value,
  duration,
  valueUpdateFunction,
} = {}) => {
  const [newValue, setNewValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const _newValue = valueUpdateFunction
        ? valueUpdateFunction(value)
        : value;
      setNewValue(_newValue);
    }, duration ?? 500);
    return () => clearTimeout(timeout);
  }, [value]);

  return newValue;
};
