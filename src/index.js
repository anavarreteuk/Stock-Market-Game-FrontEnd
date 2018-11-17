// start game


// FX Rate Functions
const state = {
    ticks: [],
    buys: {
        GBPUSD: [],
        EURUSD: [],
        EURGBP: [],
        EURJPY: []
    },
    sells: {
        GBPUSD: [],
        EURUSD: [],
        EURGBP: [],
        EURJPY: []
    },
    name:[],
    score:0,
    difficulty: 'normal',
    levels: {
        normal: 'GBPUSD,EURUSD,EURGBP,EURJPY'
    }
}

// Call to external API for live FX prices.
const getURL = () => `https://forex.1forge.com/1.0.3/quotes?pairs=${state.levels[state.difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
const getTick = () => fetch(getURL()).then(resp => resp.json())
const saveTick = () => getTick().then(tick => state.ticks.push(...tick))

// // Post request from our JS front end our to our Ruby DB.
const postData = priceData =>
    fetch('https://rocky-inlet-93512.herokuapp.com/api/v1/price_datas', {
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
    fetch('https://rocky-inlet-93512.herokuapp.com/api/v1/price_datas')
        .then(resp => resp.json())

// This is our empty object which will be filled with our price data.
const bidAskArrays = {}

// This function creates dynamic objects for our prices, with symbol names and bid/ask prices.
const constructBidArrays = ticks => {
    ticks.forEach((tick) => {

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

// START OF OUR CHART CODE.
// Calls on DB data, pushes to state.ticks array, creates objects in bidAskarray.
function tete() {
    const callPriceDataFromDB = () =>
        fetchDataFromDB()
            .then(prices => {
                prices.forEach(price => state.ticks.push(price))
                constructBidArrays(state.ticks)
            })

    function createPlot(plotName, plotData, layout) {
        Plotly.plot(plotName, plotData, layout, { displayModeBar: false });
    }

    function buy(cnt, currency) {
        currency = currency.toUpperCase()
        const askPrice = bidAskArrays[`${currency}ASK`][cnt]
        Plotly.extendTraces(currency, {
            y: [
                [askPrice]
            ],
            x: [
                [cnt]
            ]
        }, [2])
        if (state.buys[currency]) {
            state.buys[currency].push(askPrice)
        } else {
            state.buys[currency] = [askPrice]
        }
    }

    function sell(cnt, currency) {
        currency = currency.toUpperCase()
        const bidPrice = bidAskArrays[`${currency}BID`][cnt]
        Plotly.extendTraces(currency, {
            y: [
                [bidPrice]
            ],
            x: [
                [cnt]
            ]
        }, [3])
        if (state.sells[currency]) {
            state.sells[currency].push(bidPrice * -1)
        } else {
            state.sells[currency] = [bidPrice * -1]
        }
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
                x: [0],
                y: [GBPUSDbid[0]],
                name: 'Bid'
            },
            {
                x: [0],
                y: [GBPUSDask[0]],
                name: 'Ask'
            },
            {
                x: [0],
                y: [GBPUSDask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                x: [0],
                y: [GBPUSDbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
            ]

            // EURUSD Starting price point
            const data2 = [{
                x: [0],
                y: [EURUSDbid[0]],
                name: 'Bid'
            },
            {
                x: [0],
                y: [EURUSDask[0]],
                name: 'Ask'
            },
            {
                x: [0],
                y: [EURUSDask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                x: [0],
                y: [EURUSDbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
            ]

            // EURGBP Starting price point
            const data3 = [{
                x: [0],
                y: [EURGBPbid[0]],
                name: 'Bid'
            },
            {
                x: [0],
                y: [EURGBPask[0]],
                name: 'Ask'
            },
            {
                x: [0],
                y: [EURGBPask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                x: [0],
                y: [EURGBPbid[0]],
                name: 'Sell',
                mode: 'markers'
            }
            ]

            // EURJPY Starting price point
            const data4 = [{
                x: [0],
                y: [EURJPYbid[0]],
                name: 'Bid'
            },
            {
                x: [0],
                y: [EURJPYask[0]],
                name: 'Ask'
            },
            {
                x: [0],
                y: [EURJPYask[0]],
                name: 'Buy',
                mode: 'markers'
            },
            {
                x: [0],
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

            createPlot('GBPUSD', data1, layout1, { displayModeBar: false })
            createPlot('EURUSD', data2, layout2, { displayModeBar: false })
            createPlot('EURGBP', data3, layout3, { displayModeBar: false })
            createPlot('EURJPY', data4, layout4, { displayModeBar: false })

            tester = () => {
                let cnt1 = 0;
                let cnt2 = 0;
                let cnt3 = 0;
                let cnt4 = 0;

                // GBPUSD Continuous chart plots
                console.log(GBPUSDask.length)
                let interval1 = setInterval(() => {
                    // console.log('time: ',time)
                    Plotly.extendTraces('GBPUSD', {
                        x: [
                            [cnt1],
                            [cnt1]
                        ],
                        y: [
                            [chartBid1(cnt1)],
                            [chartAsk1(cnt1)]
                        ]
                    }, [0, 1])
                    cnt1 += 1
                    if (cnt1 >= GBPUSDask.length) {
                        clearInterval(interval1)
                        console.log(getFinalScore())
                    }
                }, 250);

                // EURUSD Continuous chart plots
                let interval2 = setInterval(function () {

                    Plotly.extendTraces('EURUSD', {
                        x: [
                            [cnt2],
                            [cnt2]
                        ],
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

                    Plotly.extendTraces('EURGBP', {
                        x: [
                            [cnt3],
                            [cnt3]
                        ],
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

                    Plotly.extendTraces('EURJPY', {
                        x: [
                            [cnt4],
                            [cnt4]
                        ],
                        y: [
                            [chartBid4(cnt4)],
                            [chartAsk4(cnt4)]
                        ]
                    }, [0, 1])
                    cnt4 += 1
                    if (cnt4 >= EURJPYask.length) clearInterval(interval4);
                }, 250);

                // BUY/SELL EVENT LISTENERS - START OF CODE
                document.addEventListener('click', event => {

                    const ccy = 'GBPUSD'
                    if (event.target.dataset.id === `${ccy}-buy`) {
                        buy(cnt1, ccy)
                    }
                })
                document.addEventListener('click', event => {

                    const ccy = 'GBPUSD'
                    if (event.target.dataset.id === `${ccy}-sell`) {
                        sell(cnt1, ccy)
                    }
                })

                document.addEventListener('click', event => {

                    const ccy = 'EURUSD'
                    if (event.target.dataset.id === `${ccy}-buy`) {
                        buy(cnt2, ccy)
                    }
                })
                document.addEventListener('click', event => {

                    const ccy = 'EURUSD'
                    if (event.target.dataset.id === `${ccy}-sell`) {
                        sell(cnt2, ccy)
                    }
                })

                document.addEventListener('click', event => {

                    const ccy = 'EURGBP'
                    if (event.target.dataset.id === `${ccy}-buy`) {
                        buy(cnt3, ccy)
                    }
                })
                document.addEventListener('click', event => {

                    const ccy = 'EURGBP'
                    if (event.target.dataset.id === `${ccy}-sell`) {
                        sell(cnt3, ccy)
                    }
                })

                document.addEventListener('click', event => {

                    const ccy = 'EURJPY'
                    if (event.target.dataset.id === `${ccy}-buy`) {
                        buy(cnt4, ccy)
                    }
                })
                document.addEventListener('click', event => {

                    const ccy = 'EURJPY'
                    if (event.target.dataset.id === `${ccy}-sell`) {
                        sell(cnt4, ccy)
                    }
                })
                // ### BUY/SELL EVENT LISTENERS - END OF CODE ###
            }
        })


}
// ### END OF CHART CODE ###

// INTRO PAGE AND NAME SUBMISSION FORM.

    const formDiv = document.createElement('div')
    formDiv.setAttribute('id', 'FormDiv')
    formDiv.innerHTML = `
        <h1 id='firstText'>
        FX TRADER 
        </h1>
        <h3>
            Welcome to our FX trading game.
        </h3>
        <h4>
            <p>You have 1 minute to make as much money as you can buying and selling currencies.</p>
            <p>There are 4 currency crosses to choose from, GBP/USD, EUR/USD, EUR/GBP and EUR/JPY.</p>
            <p>See how well you can do. At the end you're name will be added to the leaderboard... Good Luck!</p>
        </h4>
        <h5>
            <em>Created by Adrian N and Oliver DS.</em>
        </h5>
        <form id='startForm'>
            <br>
                <p>Please Insert Your Name:</p>
                <input id='name' type="text" name="firstname">
            <br>
        </form>
        <button id='submitButton'>submit</button>`

    document.body.appendChild(formDiv)

    const submitButton = document.getElementById('submitButton')
    submitButton.addEventListener('click', event => {
        
        // Posting the name and score
        let startFormNameValue = document.querySelector('#name').value
        state.name.push(startFormNameValue)

        tete()
        const readyButton = document.getElementById('holder')
        readyButton.innerHTML = `<div id = "startButton" class="button">
            <p id="startButton" class="btnText">READY?</p>
            <div id="startButton" class="btnTwo">
                <p id="startButton" class="btnText2">GO!</p>
            </div>
            </div >`
        document.body.appendChild(readyButton)
        formDiv.remove()
        const startButton = document.getElementById("startButton")
        startButton.addEventListener('click', event => {
            tester()
            startButton.remove()
        
            let clockThing = () => {
            let clockCounter = document.createElement('div')
            clockCounter.innerHTML = ` 
                <div id = "countdown">
                    <div id="countdown-number"></div>
                    <svg>
                        
                    </svg>
                </div >`
                document.getElementById('holder').appendChild(clockCounter)
            var countdownNumberEl = document.getElementById('countdown-number');
            var countdown = 60;

            countdownNumberEl.textContent = countdown;

            setInterval(function () {
                countdown = --countdown <= 0 ? 60 : countdown;

                countdownNumberEl.textContent = countdown;
            }, 1000);}
            clockThing()

                const div1 = document.querySelector('div1')
            
            setTimeout(function () {
                div1.remove()

                document.getElementById('countdown').remove()
                postNameScore(state.name[0],state.score)
                .then( () => {
                    createTable()
                    getInfos()
                })
            }, 60000)
            setTimeout(60000)

            const containerNodes = document.getElementsByClassName('js-plotly-plot')
            const containers = [...containerNodes]

            containers.forEach((el) => el.appendChild(generateBtn(el.id)))
        })
    })

    const generateBtn = (ccy) => {
        const buttonContainer = document.createElement('div')
        buttonContainer.setAttribute("id", "buttonDiv")
        buttonContainer.innerHTML = `
                <button class='buy-btn' data-id='${ccy}-buy'>
                    Buy
                </button>
                <br/>
                <button class='sell-btn' data-id='${ccy}-sell'>
                    Sell
                </button>
            `;

        return buttonContainer;
    }


    // END OF GAME CALCULATIONS:

    const getFinalScore = () => {

        // GBPUSD
        while (state.buys.GBPUSD.length < state.sells.GBPUSD.length) {
            state.buys.GBPUSD.push(bidAskArrays.GBPUSDASK[bidAskArrays.GBPUSDASK.length - 1])
        }
        while (state.sells.GBPUSD.length < state.buys.GBPUSD.length) {
            state.sells.GBPUSD.push((bidAskArrays.GBPUSDBID[bidAskArrays.GBPUSDBID.length - 1]) * -1)
        }

        let buyTotalGBPUSD = state.buys.GBPUSD.reduce((total, el) => {
            return total + el
        }, 0)

        let sellTotalGBPUSD = state.sells.GBPUSD.reduce((total, el) => {
            return total + el
        }, 0)

        const totalGBPUSD = (-(buyTotalGBPUSD + sellTotalGBPUSD)) * 100000
        console.log(totalGBPUSD)

        // EURUSD
        while (state.buys.EURUSD.length < state.sells.EURUSD.length) {
            state.buys.EURUSD.push(bidAskArrays.EURUSDASK[bidAskArrays.EURUSDASK.length - 1])
        }
        while (state.sells.EURUSD.length < state.buys.EURUSD.length) {
            state.sells.EURUSD.push((bidAskArrays.EURUSDBID[bidAskArrays.EURUSDBID.length - 1]) * -1)
        }

        let buyTotalEURUSD = state.buys.EURUSD.reduce((total, el) => {
            return total + el
        }, 0)

        let sellTotalEURUSD = state.sells.EURUSD.reduce((total, el) => {
            return total + el
        }, 0)

        const totalEURUSD = (-(buyTotalEURUSD + sellTotalEURUSD)) * 100000
        console.log(totalEURUSD)

        // EURGBP
        while (state.buys.EURGBP.length < state.sells.EURGBP.length) {
            state.buys.EURGBP.push(bidAskArrays.EURGBPASK[bidAskArrays.EURGBPASK.length - 1])
        }
        while (state.sells.EURGBP.length < state.buys.EURGBP.length) {
            state.sells.EURGBP.push((bidAskArrays.EURGBPBID[bidAskArrays.EURGBPBID.length - 1]) * -1)
        }

        let buyTotalEURGBP = state.buys.EURGBP.reduce((total, el) => {
            return total + el
        }, 0)

        let sellTotalEURGBP = state.sells.EURGBP.reduce((total, el) => {
            return total + el
        }, 0)

        const totalEURGBP = (-(buyTotalEURGBP + sellTotalEURGBP)) * 100000
        console.log(totalEURGBP)

        // EURJPY
        while (state.buys.EURJPY.length < state.sells.EURJPY.length) {
            state.buys.EURJPY.push(bidAskArrays.EURJPYASK[bidAskArrays.EURJPYASK.length - 1])
        }
        while (state.sells.EURJPY.length < state.buys.EURJPY.length) {
            state.sells.EURJPY.push((bidAskArrays.EURJPYBID[bidAskArrays.EURJPYBID.length - 1]) * -1)
        }

        let buyTotalEURJPY = state.buys.EURJPY.reduce((total, el) => {
            return total + el
        }, 0)

        let sellTotalEURJPY = state.sells.EURJPY.reduce((total, el) => {
            return total + el
        }, 0)

        const totalEURJPY = (-(buyTotalEURJPY + sellTotalEURJPY)) * 1000
        console.log(totalEURJPY)


        const grandTotalScore = (totalGBPUSD + totalEURUSD + totalEURGBP + totalEURJPY)
        state.score = grandTotalScore
    }

    const postNameScore = (name,score) =>
        fetch('https://rocky-inlet-93512.herokuapp.com/api/v1/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: name,
                point: score
            })
        }).then(resp => resp.json())


        function createTable() {
        const a = document.createElement('div')
        a.innerHTML = `<div class="table-title">
        <h3>LeaderBoard</h3>
        </div>
        <table class="table-fill">
        <thead>
        <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Score</th>
        </tr>
        </thead>
        <tbody id ="lol" class="table-hover">
        </tbody>
        </table>`
        document.querySelector('#holder').appendChild(a)
        return a
    
    }

    const renderInfo = (info) =>{
        const newTr = document.createElement('tr')
        newTr.innerHTML = `
        <td class="text-left">${info.username}</td>
        <td class="text-left">${Math.round(info.point)}</td>
        `
        placeAppend = document.querySelector('#lol')
        placeAppend.appendChild(newTr)
    }

    const renderInfos = (infos) => {
        infos.forEach(info => {
            renderInfo(info)
            
        })
        againButton()
        playAgain()
    }

    const getInfos = () => {
        fetch('https://rocky-inlet-93512.herokuapp.com/api/v1/scores')
            .then(resp => resp.json())
            .then(infos => renderInfos(infos))
    }

    const againButton = () => {
    let a = document.createElement('button')
    a.setAttribute('id', 'againButton')
    
    a.innerHTML = `<p>Play Again</p><canvas id="myCanvas" width="200" height="200"></canvas>`
    let b = document.querySelector('#holder')
        b.appendChild(a)
    }

const playAgain = () =>{
    const againBttn = document.getElementById('againButton')
    againBttn.addEventListener('click', (event) => {
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        Math.randMinMax = function (min, max, round) {
            var val = min + (Math.random() * (max - min));

            if (round) val = Math.round(val);

            return val;
        };
        Math.TO_RAD = Math.PI / 180;
        Math.getAngle = function (x1, y1, x2, y2) {

            var dx = x1 - x2,
                dy = y1 - y2;

            return Math.atan2(dy, dx);
        };
        Math.getDistance = function (x1, y1, x2, y2) {

            var xs = x2 - x1,
                ys = y2 - y1;

            xs *= xs;
            ys *= ys;

            return Math.sqrt(xs + ys);
        };

        var FX = {};

        (function () {

            var canvas = document.getElementById('myCanvas'),
                ctx = canvas.getContext('2d'),
                lastUpdate = new Date(),
                mouseUpdate = new Date(),
                lastMouse = [],
                width, height;

            FX.particles = [];

            setFullscreen();
            document.getElementById('againButton').addEventListener('mousedown', buttonEffect);

            function buttonEffect() {

                var button = document.getElementById('againButton'),
                    height = button.offsetHeight,
                    left = button.offsetLeft,
                    top = button.offsetTop,
                    width = button.offsetWidth,
                    x, y, degree;

                for (var i = 0; i < 40; i = i + 1) {

                    if (Math.random() < 0.5) {

                        y = Math.randMinMax(top, top + height);

                        if (Math.random() < 0.5) {
                            x = left;
                            degree = Math.randMinMax(-45, 45);
                        } else {
                            x = left + width;
                            degree = Math.randMinMax(135, 225);
                        }

                    } else {

                        x = Math.randMinMax(left, left + width);

                        if (Math.random() < 0.5) {
                            y = top;
                            degree = Math.randMinMax(45, 135);
                        } else {
                            y = top + height;
                            degree = Math.randMinMax(-135, -45);
                        }

                    }
                    createParticle({
                        x: x,
                        y: y,
                        degree: degree,
                        speed: Math.randMinMax(100, 150),
                        vs: Math.randMinMax(-4, -1)
                    });
                }
            }
            window.setTimeout(buttonEffect, 100);

            loop();

            window.addEventListener('resize', setFullscreen);

            function createParticle(args) {

                var options = {
                    x: width / 2,
                    y: height / 2,
                    color: 'hsla(' + Math.randMinMax(160, 290) + ', 100%, 50%, ' + (Math.random().toFixed(2)) + ')',
                    degree: Math.randMinMax(0, 360),
                    speed: Math.randMinMax(300, 350),
                    vd: Math.randMinMax(-90, 90),
                    vs: Math.randMinMax(-8, -5)
                };

                for (key in args) {
                    options[key] = args[key];
                }

                FX.particles.push(options);
            }

            function loop() {

                var thisUpdate = new Date(),
                    delta = (lastUpdate - thisUpdate) / 1000,
                    amount = FX.particles.length,
                    size = 2,
                    i = 0,
                    p;

                ctx.fillStyle = 'rgba(15,15,15,0.25)';
                ctx.fillRect(0, 0, width, height);

                ctx.globalCompositeStyle = 'lighter';

                for (; i < amount; i = i + 1) {

                    p = FX.particles[i];

                    p.degree += (p.vd * delta);
                    p.speed += (p.vs);// * delta);
                    if (p.speed < 0) continue;

                    p.x += Math.cos(p.degree * Math.TO_RAD) * (p.speed * delta);
                    p.y += Math.sin(p.degree * Math.TO_RAD) * (p.speed * delta);

                    ctx.save();

                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.degree * Math.TO_RAD);

                    ctx.fillStyle = p.color;
                    ctx.fillRect(-size, -size, size * 2, size * 2);

                    ctx.restore();
                }

                lastUpdate = thisUpdate;

                requestAnimFrame(loop);
            }

            function setFullscreen() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            };
        })();
        location.reload()
    })
    
    }

    