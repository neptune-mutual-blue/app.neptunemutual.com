export const getGasLimit = async ({
  instance,
  methodName,
  overrides = {},
  args = [],
  onError = console.error
}) => {
  if (!instance) {
    onError(new Error('Instance not found'))

    return
  }

  try {
    const estimatedGas = await instance.estimateGas[methodName](...args, {
      ...overrides
    })

    return estimatedGas
  } catch (err) {
    console.log(`Could not estimate gas for "${methodName}", args: `, args)

    onError(err)
  }
}
