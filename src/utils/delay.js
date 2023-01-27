export const delay = (value) => {
  return new Promise((resolve) => {
    const time = process.env.NEXT_PUBLIC_TRANSACTION_NOTIFICATION_DELAY
      ? parseInt(process.env.NEXT_PUBLIC_TRANSACTION_NOTIFICATION_DELAY)
      : 5000

    setTimeout(() => resolve(value), time)
  })
    .catch(error => console.error(error))
}
