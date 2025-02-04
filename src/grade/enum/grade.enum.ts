export enum Grade {
  NORMAL = 'normal',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export const GradeDiscount = {
  [Grade.NORMAL]: 0,
  [Grade.BRONZE]: 0.01,
  [Grade.SILVER]: 0.03,
  [Grade.GOLD]: 0.05
}