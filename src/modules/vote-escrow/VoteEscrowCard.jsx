import React from 'react'

import { classNames } from '@/utils/classnames'

const VoteEscrowCard = ({ children, ...rest }) => {
  const { className } = rest

  return (
    <div className={classNames('rounded-2xl bg-white border-1 border-B0C4DB max-w-[489px] mx-auto', className)}>{children}</div>
  )
}

export default VoteEscrowCard
