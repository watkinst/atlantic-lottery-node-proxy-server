import { IDraw } from './draw'
import { INextDraw } from './next-draw'
import { IPromotionalDraw } from './promotional-draw'
import { IGuaranteedDraw } from './guaranteed-draw'

export interface IDrawData {
  draw: IDraw
  draw_date: string
  game: string
  guaranteed_draws: IGuaranteedDraw[]
  last_edit_date: string
  next_draw: INextDraw | null
  promotional_draws: IPromotionalDraw[]
  standard_balls: number
  jackpot_balls: number
  jackpot_ball_drawn: boolean
}