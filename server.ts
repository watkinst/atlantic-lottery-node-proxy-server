import express, { Request, Response, NextFunction } from 'express'
import axios, { AxiosResponse } from 'axios'
import { IDrawDatesResponseData } from './models/draw-dates-response-data'
import { IDrawData } from './models/draw-data'
import { IDrawDate } from './models/draw-date'

const app = express()
const port = 3001
const urlBase = 'https://dsc.alc.ca/api/winning_numbers'
const validGames = ['HitorMiss', 'DailyGrand', 'Lotto4', 'PokerLotto', 'ShaBam', 'Pik4', 'SalsaBingo', 'LottoMax', 'Lotto649', 'KenoAtlantic', 'Bucko', 'Atlantic49']

class ApiError extends Error{
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

/**
 * Converts Atlantic Lottery API date format to ISO String
 * @param date Atlantic Lottery API date string with format '/Date(1622255399000-0300)/'
 * @returns {string} An ISO formatted date string 'YYY-MM-DDT00:00:00.000Z '
 */
const getDateAsISOString = (date: string): string => {
  const msAndOffsetStrings = date.match(/\d+/g)
  const sign = /-/.test(date) ? -1 : +1

  // The next 3 lines use the non-null assertion operator !
  const msWithoutOffset = +msAndOffsetStrings![0]
  const offsetHoursInMs = +msAndOffsetStrings![1].slice(0,2)*3.6e6
  const offsetMinutesInMs = +msAndOffsetStrings![1].slice(-2)*6e4
  const offsetInMs = sign * (offsetHoursInMs + offsetMinutesInMs)
  const ms = msWithoutOffset + offsetInMs

  return new Date(ms).toISOString()
}

const getFormattedDrawDates = async (game: string): Promise<string[]> => {
  const { data } = await axios.get<IDrawDatesResponseData>(`${urlBase}/draw_dates/${game}`)
  return data.draw_dates.map((drawDate: IDrawDate) => {
    return getDateAsISOString(drawDate.draw_date).slice(0, 10) // returns YYYY-MM-DD
  })
}

const getFormattedDrawData = (drawData: IDrawData): IDrawData => {
  const { draw_date, last_edit_date, next_draw } = drawData
  const formattedDrawData: IDrawData = {
    ...drawData,
    draw_date: getDateAsISOString(draw_date),
    last_edit_date: getDateAsISOString(last_edit_date),
    next_draw: next_draw ? {
      ...next_draw,
      draw_date: getDateAsISOString(next_draw.draw_date)
    } : null
  }

  return formattedDrawData
}

const errorHandler = (error: ApiError,  req: Request, res: Response, next: NextFunction): void => {
  res.header("Content-Type", 'application/json')
        
  const status = error.statusCode || 400
  res.status(status).send(error.message)
}

app.get('/latest', async (req, res, next) => {
  try {
    const latest = await axios.get<IDrawData[]>(`${urlBase}/latest`).then(({ data }) => {
      return data.map(draw => getFormattedDrawData(draw))
    })

    res.send(latest)
  } catch (error) {
    next(error)
  }
})

app.get('/latest/:game', async (req, res, next) => {
  try {
    const game = req.params.game

    if (!validGames.includes(game)) throw new Error(`Invalid game! Please use one of: ${validGames.join(', ')}.`)

    const gameLatest = await axios.get<IDrawData[]>(`${urlBase}/latest/${game}`).then(({ data }) => {
      return data.map(draw => getFormattedDrawData(draw))[0]
    })

    res.send(gameLatest)
  } catch (error) {
    next(error)
  }
})

app.get('/draw_dates/:game', async (req, res, next) => {
  try {
    const game = req.params.game

    if (!validGames.includes(game)) throw new Error(`Invalid game! Please use one of: ${validGames.join(', ')}.`)

    const drawDates = await getFormattedDrawDates(game)

    res.send(drawDates)
  } catch (error) {
    next(error)
  }
})

app.get('/draw/:game/:date', async (req, res, next) => {
  try {
    const game = req.params.game
    const date = req.params.date

    if (!validGames.includes(game)) throw new Error(`Invalid game! Please use one of: ${validGames.join(', ')}.`)

    const drawDates = await getFormattedDrawDates(game)

    if(!drawDates.includes(date)) throw new Error(`Invalid date! Please use one of: ${drawDates.join(', ')}`)

    const drawData = await axios.get<IDrawData[]>(`${urlBase}/draw/${game}/${date}`).then(({ data }) => {
      return data.map(draw => getFormattedDrawData(draw))[0]
    })

    res.send(drawData)
  } catch (error) {
    next(error)
  }
})

app.get('/draws/:game/:count', async (req, res, next) => {
  try {
    const game = req.params.game
    const count = +req.params.count

    if (!validGames.includes(game)) throw new Error(`Invalid game! Please use one of: ${validGames.join(', ')}.`)

    if (!Number.isInteger(count)) throw new Error('Invalid draw count! Please use an integer value.')

    const drawDates = await getFormattedDrawDates(game)

    if (drawDates.length < count) throw new Error(`Invalid draw count! There are ${drawDates.length} ${game} draws available.`)

    // drawDates returns the last 108 draw dates
    const drawDataRequests = drawDates.slice(0, count).map((drawDate: string) => {
      return axios.get<IDrawData[]>(`${urlBase}/draw/${game}/${drawDate}`)
    })

    const drawData = await Promise.all<AxiosResponse<IDrawData[]>>(drawDataRequests).then(responses => {
      const draws = responses.map(({ data }) => data[0])
      return draws.map(draw => getFormattedDrawData(draw))
    })

    res.send(drawData)
  } catch (error) {
    next(error)
  }
})

app.use(errorHandler)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.use((req, res) => {
  const error = new Error('Invalid endpoint!')
  res.statusCode = 404;
  res.send(error.message)
})

app.listen(port, () => console.log(`http://localhost:${port}`))