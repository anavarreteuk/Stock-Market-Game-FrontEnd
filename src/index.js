// const items = [1,2,3,2,4,5,6,3,5,6,7,5,5,6,7,1,2,3,2,2,2,1,2]
var items = [254, 45, 212, 365, 2543];

var item = items[Math.floor(Math.random() * items.length)]
console.log(random_item(items));

function random_item(items) {

    return items[Math.floor(Math.random() * items.length)];

}

function rand() {
    return Math.random();
}

Plotly.plot('graph', [{
    y: [1]
}, {
    y: [1]
}]);

var cnt = 0;

var interval = setInterval(function () {

    Plotly.extendTraces('graph', {
        y: [[item], [item]]
    }, [0, 1])
    cnt++
    // console.log(cnt)
    if (cnt === 2) clearInterval(interval);
}, 1000);

// FX Rate Functions
const state = {
    ticks: [],
    difficulty: 'hard',
    levels: {
        easy: 'GBPUSD,EURUSD',
        medium: 'GBPUSD,EURUSD,EURGBP,EURJPY',
        hard: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPJPY,USDJPY'
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
