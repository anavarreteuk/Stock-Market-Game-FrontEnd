const body = document.querySelector('body')
const hWorld = document.createElement('h2')
hWorld.innerText= `Helloooo`
const salute = body.appendChild(hWorld)

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