export const delay = (value) => {
  return new Promise((resolve) => {
    const time = process.env.NEXT_PUBLIC_TRANSACTION_NOTIFICATION_DELAY
      ? parseInt(process.env.NEXT_PUBLIC_TRANSACTION_NOTIFICATION_DELAY)
      : 5000

    setTimeout(() => { return resolve(value) }, time)
  })
    .catch(error => { return console.error(error) })
}
