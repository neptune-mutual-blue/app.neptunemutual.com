import React from 'react'

import { classNames } from '@/utils/classnames'

const GovernanceCard = ({ children, ...rest }) => {
  const { className } = rest

  return (
    <div className={classNames('rounded-2xl bg-white border-1 border-B0C4DB', className)}>{children}</div>
  )
}

export default GovernanceCard
