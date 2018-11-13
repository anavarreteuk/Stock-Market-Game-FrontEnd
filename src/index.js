// ### Plotly Chart
var items = [1, 2, 3, 2, 4, 5, 6, 3, 5, 6, 7, 5, 5, 6, 7, 1, 2, 3, 2, 2, 2, 1, 2]
var items2 = [10, 15, 12, 11, 14];


function rand() {
    return items[Math.floor(Math.random() * items.length)];;
}

Plotly.plot('graph', [{
    y: [1].map(rand)
}, {
    y: [1].map(rand)
}]);

var cnt = 0;

var interval = setInterval(function () {

    Plotly.extendTraces('graph', {
        y: [[rand()], [rand()]]
    }, [0, 1])
    cnt++
    if (cnt === 10) clearInterval(interval);
}, 1000);
// ### End of Chart Code

// FX Rate Functions
const state = {
    ticks: [],
    difficulty: 'normal',
    levels: {
        normal: 'GBPUSD,EURUSD,EURGBP,EURJPY'
    }
}

// Call to external API for live FX prices.
const getURL = () => `https://forex.1forge.com/1.0.3/quotes?pairs=${state.levels[state.difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
const getTick = () => fetch(getURL()).then(resp => resp.json())
const saveTick = () => getTick().then(tick => state.ticks.push(...tick))

// Post request from our JS front end our to our Ruby DB.
const postData = priceData =>
    fetch('http://localhost:3000/api/v1/price_datas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ price_data: priceData })
    }).then(resp => resp.json())

// setInterval(saveTick, 1000) - Run to start generating the data and storing to our 'state.ticks' array.
// clearInterval(x) - Run this code to stop 'saveTick' running, using the unique key in parens.

// Initially we were going to use the following, but Ruby was too slow at handling our requests:
// state.ticks.forEach(tick => console.log(tick))

// Here we iterate through our promises adding them to our DB
// .then ensures Ruby is only passed the next request once response is received.
let counter = 0
const loop = () => {
    if (counter < state.ticks.length) {
        postData(state.ticks[counter])
            .then(response => {
                counter += 1;
                loop();
            })
    }
}

loop()

// The following are for calling pre-existing stored data from the DB rather than external API.
const fetchDataFromDB = () => 
    fetch('http://localhost:3000/api/v1/price_datas')
        .then(resp => resp.json())

// This is our empty object which will be filled with our price data.
const bidAskArrays = {}

// This function creates dynamic objects for our prices, with symbol names and bid/asl prices.
const constructBidArrays = ticks => {
    ticks.forEach(tick => {

        if (bidAskArrays[tick.symbol + 'BID'] === undefined) {
            bidAskArrays[tick.symbol + 'BID'] = []
        }
        if (bidAskArrays[tick.symbol + 'ASK'] === undefined) {
            bidAskArrays[tick.symbol + 'ASK'] = []
        }

        bidAskArrays[tick.symbol + 'BID'].push(tick.bid)
        bidAskArrays[tick.symbol + 'ASK'].push(tick.ask)
    })
}

// Calls on DB data, pushes to state.ticks array, creates objects in bidAskarray.
const callPriceDataFromDB = () =>
    fetchDataFromDB()
        .then(prices => {
            prices.forEach(price => state.ticks.push(price))
            constructBidArrays(state.ticks)
            // renderCharts()
        })

