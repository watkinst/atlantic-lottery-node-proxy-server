import { IAtlanticBreakdown } from './atlantic-breakdown'
import { IRegionBreakdown } from './region-breakdown'

export interface IPrizePayout {
  atlantic_breakdowns: IAtlanticBreakdown[]
  guaranteed_prize_english: string 
  guaranteed_prize_french: string
  guaranteed_prize_type: string
  number_of_prizes: number
  prize_value: number
  region_breakdowns: IRegionBreakdown[]
  type: string
}