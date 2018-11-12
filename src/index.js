const body = document.querySelector('body')
const hWorld = document.createElement('h2')
hWorld.innerText= `Helloooo`
const salute = body.appendChild(hWorld)


let tick = [
    {
        "symbol": "GBPUSD",
        "bid": 1.28508,
        "ask": 1.2851,
        "price": 1.28509,
        "timestamp": 1542044422
    },
    {
        "symbol": "EURUSD",
        "bid": 1.12456,
        "ask": 1.12456,
        "price": 1.12456,
        "timestamp": 1542044422
    },
    {
        "symbol": "EURGBP",
        "bid": 0.87507,
        "ask": 0.87508,
        "price": 0.875075,
        "timestamp": 1542044422
    },
    {
        "symbol": "EURJPY",
        "bid": 127.943,
        "ask": 127.945,
        "price": 127.944,
        "timestamp": 1542044422
    },
    {
        "symbol": "GBPJPY",
        "bid": 127.943,
        "ask": 127.945,
        "price": 127.944,
        "timestamp": 1542044422
    },
    {
        "symbol": "USDJPY",
        "bid": 127.943,
        "ask": 127.945,
        "price": 127.944,
        "timestamp": 1542044422
    }
]


const state = {
    ticks: [],
    difficulty: 'easy',
    levels: {
        easy: 'GBPUSD,EURUSD',
        medium: 'GBPUSD,EURUSD,EURGBP,EURJPY',
        hard: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPJPY,USDJPY'
    }
}

const getURL = () => `https://forex.1forge.com/1.0.3/quotes?pairs=${state.levels[state.difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`

const getTick = () => fetch(getURL()).then(resp => resp.json())
const saveTick = () => getTick().then(tick => state.ticks.push(tick))

// When the program starts, we want to save each instance of our tick data per second (1000 ms) so we use the following:
// setInterval(saveTick, 1000) - When run, this will give us a unique key => 4609
// clearInterval(4609) - We then run this code when we want it to stop running, with the unique key in parens.