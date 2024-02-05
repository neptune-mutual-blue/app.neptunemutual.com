const getPolicyStatus = (coverOrProductData) => {
  try {
    const policyStatus = coverOrProductData.policyStatus[0]

    return {
      disabled: policyStatus.disabled,
      reason: policyStatus.reason
    }
  } catch {
    return {
      disabled: false,
      reason: ''
    }
  }
}

export { getPolicyStatus }
