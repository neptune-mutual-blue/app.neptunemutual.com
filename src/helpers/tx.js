const parseError = (instance, errorData) => {
  if (!instance) {
    return
  }

  try {
    const errorDescription = instance.interface.parseError(errorData)

    const message = `${errorDescription.name}(${errorDescription.args.join(', ')})`

    return message
  } catch (error) {
    // swallow
    // console.log('error parsing error')
    // console.error(error)
  }
}

export const getErrorMessage = (_error, instance) => {
  try {
    const error = _error.error || _error
    if (!error || !error.message) {
      return 'Unexpected Error Occurred'
    }

    const message = parseError(instance, error?.data?.data)
    if (message) {
      return message
    }

    if (error?.data?.message) {
      return error.data.message.trim().replace('execution reverted: ', '')
    } else if (error?.data?.originalError?.message) {
      return error.data.originalError.message
        .trim()
        .replace('execution reverted: ', '')
    }

    return error.message.trim().replace('MetaMask Tx Signature: ', '')
  } catch (err) {
    return 'Something went wrong'
  }
}
