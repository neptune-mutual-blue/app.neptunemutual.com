export const getErrorMessage = (_error) => {
  try {
    let error = _error.error || _error;
    if (!error || !error.message) {
      return "Unexpected Error Occured";
    }

    if (error?.data?.originalError?.message) {
      return error.data.originalError.message
        .trim()
        .replace("execution reverted: ", "");
    }

    return error.message.trim().replace("MetaMask Tx Signature: ", "");
  } catch (err) {
    return "Something went wrong";
  }
};
