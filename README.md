# atlantic-lottery-node-proxy-server
A node proxy server for the Canadian Atlantic Lottery API

## Motivation
Creating a way to access the Atlantic Lottery API from within an application making requests through a browser. This node proxy server sets the **Access-Control-Allow-Origin** header to "*" in order to prevent CORS errors when accessing the API. It also provides a simplified API for hitting the more verbose Atlantic Lottery API endpoints.

## Installation
1. Clone the repository to your local machine
1. cd into the cloned directory and execute `npm install` in a terminal

## Usage
Execute `npm start` in a terminal to start the server. Preface each of the endpoints below with `localhost:3001` when running the server locally. Note that attempting to hit an endpoint not listed below will return an **Invalid endpoint!** error message.

There are 5 simplified endpoints available:

1. `/latest` 
     - Returns latest results for all games

1. `/latest/:game`
     - Returns latest results for a specifc game
     - Currently, valid `:game` values include: HitorMiss, DailyGrand, Lotto4, PokerLotto, ShaBam, Pik4, SalsaBingo, LottoMax, Lotto649, KenoAtlantic, Bucko, Atlantic49
     - Using an invalid game value will return an error message showing the list of valid game values

1. `/draw_dates/:game`
      - Returns limited list of valid previous draw dates for a specific game

1. `/draw/:game/:date`
      - Returns latest results for a specifc game and draw date
      - Date must be formatted as `YYYY-MM-DD`
      - Using an invalid date will return an error message showing the available valid dates

1. `/draws/:game/:count`
      - Returns results for a specific number of draws for a specifc game
      - Count should be an integer value and represents the number of draws to return results for
      - Using an invalid count value will return an error message requesting that an integer value be used

## License
MIT License

Copyright (c) 2023 Trevor Watkinson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.