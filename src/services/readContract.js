import { calculateGasMargin } from '@/utils/bn'

export const contractRead = async ({
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

  let estimatedGas = null

  try {
    estimatedGas = await instance.estimateGas[methodName](...args)

    const result = await instance[methodName](...args, {
      gasLimit: estimatedGas ? calculateGasMargin(estimatedGas) : undefined,
      ...overrides
    })

    return result
  } catch (err) {
    console.log(`Could not estimate gas for "${methodName}", args: `, args)

    onError(err)
  }
}
