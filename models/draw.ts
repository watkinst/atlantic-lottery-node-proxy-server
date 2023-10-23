import { IPrizePayout } from './prize-payout'

export interface IDraw {
  providerdrawId: string
  bonus_number: string
  prize_payouts: IPrizePayout[]
  tag: string
  tag_prize_payouts: IPrizePayout[]
  winning_numbers: string[]
}