export const Disclaimer = () => {
  return (
    <p className='mt-6 text-sm leading-5 text-black'>
      By connecting a wallet, you agree to Neptune Mutual
      <a
        className='font-medium text-4E7DD9 hover:text-black hover:underline'
        href='https://docs.neptunemutual.com/usage/terms-of-use'
        target='_blank'
        rel='noreferrer noopener nofollow'
      >
        {' '}
        Terms &amp; Conditions{' '}
      </a>
      and acknowledge that you have read and understand the Neptune Mutual
      <a
        className='font-medium text-4E7DD9 hover:text-black hover:underline'
        href='https://docs.neptunemutual.com/usage/disclaimer'
        target='_blank'
        rel='noreferrer noopener nofollow'
      >
        {' '}
        Protocol Disclaimer
      </a>
      .
    </p>
  )
}
