export const LOYALTY_POINTS_PER_PKR = 1;
export const LOYALTY_REDEMPTION_BLOCK = 500;
export const LOYALTY_REDEMPTION_VALUE = 50;
export const COD_FEE = 200;

export function calculateLoyaltyDiscount(points: number, maxApplicableTotal: number) {
  const blocks = Math.floor(points / LOYALTY_REDEMPTION_BLOCK);
  if (blocks <= 0) {
    return { pointsUsed: 0, discount: 0 };
  }

  const maxBlocks = Math.floor(maxApplicableTotal / LOYALTY_REDEMPTION_VALUE);
  const appliedBlocks = Math.min(blocks, maxBlocks);
  const pointsUsed = appliedBlocks * LOYALTY_REDEMPTION_BLOCK;
  const discount = appliedBlocks * LOYALTY_REDEMPTION_VALUE;

  return { pointsUsed, discount };
}

export function calculateEarnedPoints(orderTotal: number) {
  return Math.max(0, Math.floor(orderTotal * LOYALTY_POINTS_PER_PKR));
}
