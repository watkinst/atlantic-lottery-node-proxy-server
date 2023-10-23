import { IPrizePayout } from './prize-payout'

export interface IGuaranteedDraw {
  winning_numbers: string[]
  prize_payouts: IPrizePayout[]
  bonus_number: string
}