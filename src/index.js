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
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            price_data: priceData
        })
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

// This function creates dynamic objects for our prices, with symbol names and bid/ask prices.
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

function createPlot(plotName, plotData, layout) {
    Plotly.plot(plotName, plotData, layout);
}

function buy(cnt) {
    Plotly.extendTraces('graph1', {
        y: [
            [bidAskArrays.GBPUSDASK[cnt]]
        ],
        x: [
            [new Date(Date(state.ticks[cnt])).toLocaleTimeString()]
        ]
    }, [2])
}

function sell(cnt) {
    Plotly.extendTraces('graph1', {
        y: [
            [bidAskArrays.GBPUSDBID[cnt]]
        ],
        x: [
            [new Date(Date(state.ticks[cnt])).toLocaleTimeString()]
        ]
    }, [3])
}

callPriceDataFromDB()
    .then(() => {
        // ### Plotly Chart
        let GBPUSDbid = bidAskArrays.GBPUSDBID
        let GBPUSDask = bidAskArrays.GBPUSDASK
        let EURUSDbid = bidAskArrays.EURUSDBID
        let EURUSDask = bidAskArrays.EURUSDASK
        let EURGBPbid = bidAskArrays.EURGBPBID
        let EURGBPask = bidAskArrays.EURGBPASK
        let EURJPYbid = bidAskArrays.EURJPYBID
        let EURJPYask = bidAskArrays.EURJPYASK

        // GBPUSD price data arrays
        function chartBid1(indexEl) {
            return GBPUSDbid[indexEl];
        }

        function chartAsk1(indexEl) {
            return GBPUSDask[indexEl];
        } // EURUSD price data arrays
        function chartBid2(indexEl) {
            return EURUSDbid[indexEl];
        }

        function chartAsk2(indexEl) {
            return EURUSDask[indexEl];
        } // EURGBP price data arrays
        function chartBid3(indexEl) {
            return EURGBPbid[indexEl];
        }

        function chartAsk3(indexEl) {
            return EURGBPask[indexEl];
        } // EURJPY price data arrays
        function chartBid4(indexEl) {
            return EURJPYbid[indexEl];
        }

        function chartAsk4(indexEl) {
            return EURJPYask[indexEl];
        }

        // GBPUSD Starting price point
        const data1 = [{
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [GBPUSDbid[0]],
                // We need to make this y axis data dynamic for diff currencies
                name: 'Bid'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [GBPUSDask[0]],
                name: 'Ask'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [GBPUSDask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [GBPUSDbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
        ]

        // EURUSD Starting price point
        const data2 = [{
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURUSDbid[0]],
                // We need to make this y axis data dynamic for diff currencies
                name: 'Bid'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURUSDask[0]],
                name: 'Ask'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURUSDask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURUSDbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
        ]

        // EURGBP Starting price point
        const data3 = [{
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURGBPbid[0]],
                // We need to make this y axis data dynamic for diff currencies
                name: 'Bid'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURGBPask[0]],
                name: 'Ask'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURGBPask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURGBPbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
        ]

        // EURJPY Starting price point
        const data4 = [{
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURJPYbid[0]],
                // We need to make this y axis data dynamic for diff currencies
                name: 'Bid'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURJPYask[0]],
                name: 'Ask'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURJPYask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                // x: [new Date(Date(state.ticks[0])).toLocaleTimeString()],
                y: [EURJPYbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
        ]

        var layout1 = {
            title: "GBP/USD",
            autosize: false,
            width: 720,
            height: 385,
            margin: {
                l: 70,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
            paper_bgcolor: '#c7c7c7',
            plot_bgcolor: '#FFFFFF'
        };

        var layout2 = {
            title: "EUR/USD",
            autosize: false,
            width: 720,
            height: 385,
            margin: {
                l: 70,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
            paper_bgcolor: '#c7c7c7',
            plot_bgcolor: '#FFFFFF'
        };

        var layout3 = {
            title: "EUR/GBP",
            autosize: false,
            width: 720,
            height: 385,
            margin: {
                l: 70,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
            paper_bgcolor: '#c7c7c7',
            plot_bgcolor: '#FFFFFF'
        };

        var layout4 = {
            title: "EUR/JPY",
            autosize: false,
            width: 720,
            height: 385,
            margin: {
                l: 70,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
            paper_bgcolor: '#c7c7c7',
            plot_bgcolor: '#FFFFFF'
        };

        createPlot('graph1', data1, layout1)
        createPlot('graph2', data2, layout2)
        createPlot('graph3', data3, layout3)
        createPlot('graph4', data4, layout4)

        // tester = () => {   
        let cnt1 = 0;
        let cnt2 = 0;
        let cnt3 = 0;
        let cnt4 = 0;

        // GBPUSD Continuous chart plots
        console.log(GBPUSDask.length)
        let interval1 = setInterval(() => {
            // console.log('time: ',time)
            Plotly.extendTraces('graph1', {
                // x: [[new Date(Date(state.ticks[cnt])).toLocaleTimeString()], [new Date(Date(state.ticks[cnt])).toLocaleTimeString()]],
                y: [
                    [chartBid1(cnt1)],
                    [chartAsk1(cnt1)]
                ]
            }, [0, 1])
            cnt1 += 1
            if (cnt1 >= GBPUSDask.length) clearInterval(interval1)
        }, 250);

        // EURUSD Continuous chart plots
        let interval2 = setInterval(function () {

            Plotly.extendTraces('graph2', {
                // x: [
                //     [new Date(Date(state.ticks[cnt2])).toLocaleTimeString()],
                //     [new Date(Date(state.ticks[cnt2])).toLocaleTimeString()]
                // ],
                y: [
                    [chartBid2(cnt2)],
                    [chartAsk2(cnt2)]
                ]
            }, [0, 1])
            cnt2 += 1
            if (cnt2 >= EURUSDask.length) clearInterval(interval2);
        }, 250);

        // EURGBP Continuous chart plots
        let interval3 = setInterval(function () {

            Plotly.extendTraces('graph3', {
                // x: [
                //     [new Date(Date(state.ticks[cnt3])).toLocaleTimeString()],
                //     [new Date(Date(state.ticks[cnt3])).toLocaleTimeString()]
                // ],
                y: [
                    [chartBid3(cnt3)],
                    [chartAsk3(cnt3)]
                ]
            }, [0, 1])
            cnt3 += 1
            if (cnt3 >= EURGBPask.length) clearInterval(interval3);
        }, 250);

        // EURJPY Continuous chart plots
        let interval4 = setInterval(function () {

            Plotly.extendTraces('graph4', {
                // x: [
                //     [new Date(Date(state.ticks[cnt4])).toLocaleTimeString()],
                //     [new Date(Date(state.ticks[cnt4])).toLocaleTimeString()]
                // ],
                y: [
                    [chartBid4(cnt4)],
                    [chartAsk4(cnt4)]
                ]
            }, [0, 1])
            cnt4 += 1
            if (cnt4 >= EURJPYask.length) clearInterval(interval4);
        }, 250);
        // }
    })
// ### End of Chart Code

// const startButton = document.getElementById("startButton")
//  startButton.addEventListener('click', event => {
// tester()
// startButton.remove()
// })