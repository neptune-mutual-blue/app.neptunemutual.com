import * as api from '../config'

export const validateReferralCode = async (referralCode) => {
  try {
    const response = await fetch(api.REFERRAL_CODE_VALIDATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ referralCode }),
      redirect: 'follow'
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    // status 400 or 401 is a valid request rejection
    // try catch won't work here
    return data?.message.toLowerCase() === 'ok'
  } catch (error) {
    console.error('Could not validate referral code', error)
  }

  return false
}
