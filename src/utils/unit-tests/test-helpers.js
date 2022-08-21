const getControlledPromise = () => {
  let deferred;
  const promise = new Promise((resolve, reject) => {
    deferred = { resolve, reject };
  });

  return { deferred, promise };
};

export { getControlledPromise };
