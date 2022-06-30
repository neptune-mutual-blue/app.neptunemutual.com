/**
 * @typedef {string} E_METHODS
 *
 * @enum {E_METHODS}
 */
export const METHODS = {
  UNSTAKING_WITHDRAW: "deposit.withdraw",
  UNSTAKING_DEPOSIT: "deposit.unstaking",
  STAKING_DEPOSIT_TOKEN_APPROVE: "staking_deposit.token_approve",
  STAKING_DEPOSIT_COMPLETE: "staking_deposit.complete",
  RESOLVE_INCIDENT_APPROVE: "report_dispute.token_approve",
  RESOLVE_INCIDENT_COMPLETE: "report_dispute.complete",
  REPORT_DISPUTE_TOKEN_APPROVE: "report_dispute.token_approve",
  REPORT_DISPUTE_COMPLETE: "report_dispute.complete",
  CLAIM_COVER_APPROVE: "claim_cover.approve",
  CLAIM_COVER_COMPLETE: "claim_cover.complete",
  REPORT_INCIDENT_APPROVE: "report_incident.approve",
  REPORT_INCIDENT_COMPLETE: "report_incident.complete",
  POLICY_APPROVE: "policy.approve",
  POLICY_PURCHASE: "policy.purchase",
  BOND_APPROVE: "bond.approve",
  BOND_CREATE: "bond.createBond",
  STAKING_DEPOSIT: "deposit",
  LIQUIDITY_STAKE_APPROVE: "liquidity.stake.approve",
  LIQUIDITY_PROVIDE_APPROVE: "liquidity.provide.approve",
  LIQUIDITY_PROVIDE: "liquidity.provide",
  REPORTING_UNSTAKE: "report_dispute.unstake",
  REPORTING_UNSTAKE_CLAIM: "report_dispute.unstake_claim",
};
