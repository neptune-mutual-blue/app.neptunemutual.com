export const wrongNetwork = (notify, networkName, walletName, error) => {
  notify({
    type: 'error',
    title: 'Wrong network',
    message: (
      <p>
        Please switch to <strong>{networkName}</strong> in your{' '}
        <strong>{walletName}</strong> wallet
      </p>
    ),
    error: error
  })
}

export const providerError = (notify, error) => {
  notify({
    type: 'error',
    title: 'Provider Error',
    message: 'Could not connect. No provider found',
    error: error
  })
}

export const authError = (notify, error) => {
  notify({
    type: 'error',
    title: 'Authorization Error',
    message: 'Please authorize to access your account',
    error: error
  })
}

export const unidentifiedError = (notify, error) => {
  notify({
    type: 'error',
    title: 'Error',
    message: 'Something went wrong',
    error: error
  })
}
