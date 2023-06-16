export const getOne = (...opts) => {
  return opts[getRandomIntInclusive(0, opts.length - 1)]
}

const getRandomIntInclusive = (min, max) => {
  const randomBuffer = new Uint32Array(1)
  const crypto = window.crypto || window.msCrypto

  crypto.getRandomValues(randomBuffer)

  const randomNumber = randomBuffer[0] / (0xffffffff + 1)

  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(randomNumber * (max - min + 1)) + min
}
