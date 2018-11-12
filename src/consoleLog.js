// tick = [
//     {
//         "symbol": "GBPUSD",
//         "bid": 1.28508,
//         "ask": 1.2851,
//         "price": 1.28509,
//         "timestamp": 1542044422
//     },
//     {
//         "symbol": "EURUSD",
//         "bid": 1.12456,
//         "ask": 1.12456,
//         "price": 1.12456,
//         "timestamp": 1542044422
//     },
//     {
//         "symbol": "EURGBP",
//         "bid": 0.87507,
//         "ask": 0.87508,
//         "price": 0.875075,
//         "timestamp": 1542044422
//     },
//     {
//         "symbol": "EURJPY",
//         "bid": 127.943,
//         "ask": 127.945,
//         "price": 127.944,
//         "timestamp": 1542044422
//     }
// ]
//     (4)[{ … }, { … }, { … }, { … }]
// levels = {
//     easy: 'GBPUSD,EURUSD,EURGBP,EURJPY',
//     medium: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY',
//     hard: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY'
// }
// { easy: "GBPUSD,EURUSD,EURGBP,EURJPY", medium: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY", hard: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY" }
// url = `https://forex.1forge.com/1.0.3/quotes?pairs=${levels.easy}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// url = `https://forex.1forge.com/1.0.3/quotes?pairs=${levels.medium}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// getUrl = difficulty => `https://forex.1forge.com/1.0.3/quotes?pairs=${levels[difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
// difficulty => `https://forex.1forge.com/1.0.3/quotes?pairs=${levels[difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
// getUrl('medium')
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// getUrl('easy')
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// getUrl('hard')
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// getUrl()
// "https://forex.1forge.com/1.0.3/quotes?pairs=undefined&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// difficulty = 'easy'
// "easy"
// getUrl()
// "https://forex.1forge.com/1.0.3/quotes?pairs=undefined&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// getUrl = () => `https://forex.1forge.com/1.0.3/quotes?pairs=${levels[difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
//     () => `https://forex.1forge.com/1.0.3/quotes?pairs=${levels[difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
// getUrl()
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// difficulty = 'hard'
// "hard"
// getUrl()
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// state = {
//     ticks: [],
//     difficulty: 'easy',
//     levels = {
//         easy: 'GBPUSD,EURUSD,EURGBP,EURJPY',
//         medium: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY',
//         hard: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY'
//     }
// }
// VM1016: 4 Uncaught SyntaxError: Invalid shorthand property initializer
// state = {
//     ticks: [],
//     difficulty: 'easy',
//     levels: {
//         easy: 'GBPUSD,EURUSD,EURGBP,EURJPY',
//         medium: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY',
//         hard: 'GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY'
//     }
// }
// { ticks: Array(0), difficulty: "easy", levels: { … } }
// state.levels
// { easy: "GBPUSD,EURUSD,EURGBP,EURJPY", medium: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY", hard: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY" }
// state.ticks
// []
// state.ticks.push(tick)
// 1
// state.ticks.push(tick)
// 2
// state.ticks.push(tick)
// 3
// state.ticks.push(tick)
// 4
// state.ticks.push(tick)
// 5
// state.ticks.push(tick)
// 6
// state.ticks.push(tick)
// 7
// state.ticks.push(tick)
// 8
// state.ticks.push(tick)
// 9
// state.ticks.push(tick)
// 10
// state.ticks.push(tick)
// 11
// state
// { ticks: Array(11), difficulty: "easy", levels: { … } } difficulty: "easy"levels: { easy: "GBPUSD,EURUSD,EURGBP,EURJPY", medium: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY", hard: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY" } ticks: Array(11)0: Array(4)0: { symbol: "GBPUSD", bid: 1.28508, ask: 1.2851, price: 1.28509, timestamp: 1542044422 } 1: { symbol: "EURUSD", bid: 1.12456, ask: 1.12456, price: 1.12456, timestamp: 1542044422 } 2: { symbol: "EURGBP", bid: 0.87507, ask: 0.87508, price: 0.875075, timestamp: 1542044422 } 3: { symbol: "EURJPY", bid: 127.943, ask: 127.945, price: 127.944, timestamp: 1542044422 } length: 4__proto__: Array(0)1: Array(4)0: { symbol: "GBPUSD", bid: 1.28508, ask: 1.2851, price: 1.28509, timestamp: 1542044422 } 1: { symbol: "EURUSD", bid: 1.12456, ask: 1.12456, price: 1.12456, timestamp: 1542044422 } 2: { symbol: "EURGBP", bid: 0.87507, ask: 0.87508, price: 0.875075, timestamp: 1542044422 } 3: { symbol: "EURJPY", bid: 127.943, ask: 127.945, price: 127.944, timestamp: 1542044422 } length: 4__proto__: Array(0)2: (4)[{ … }, { … }, { … }, { … }]3: (4)[{ … }, { … }, { … }, { … }]4: (4)[{ … }, { … }, { … }, { … }]5: (4)[{ … }, { … }, { … }, { … }]6: (4)[{ … }, { … }, { … }, { … }]7: (4)[{ … }, { … }, { … }, { … }]8: (4)[{ … }, { … }, { … }, { … }]9: (4)[{ … }, { … }, { … }, { … }]10: (4)[{ … }, { … }, { … }, { … }]length: 11__proto__: Array(0)__proto__: Object
// getTick().then(tick => state.ticks.push(tick))
// VM1200: 1 Uncaught ReferenceError: getTick is not defined
// at<anonymous>: 1: 1
//     (anonymous) @VM1200: 1
// getUrl = () => `https://forex.1forge.com/1.0.3/quotes?pairs=${state.levels[state.difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
//     () => `https://forex.1forge.com/1.0.3/quotes?pairs=${state.levels[state.difficulty]}&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh`
// getUrl()
// "https://forex.1forge.com/1.0.3/quotes?pairs=GBPUSD,EURUSD,EURGBP,EURJPY&api_key=Zof3WIhvbF6Ed3TGF2hNKaA6rzsXhoKh"
// getTick = () =>
//     fetch(getUrl())
//         .then(resp => resp.json())
//         () =>
// fetch(getUrl())
//     .then(resp => resp.json())
// saveTick = () => {
//     getTick().then(tick => state.ticks.push(tick))
// }
// () => {
//     getTick().then(tick => state.ticks.push(tick))
// }
// saveTick()
// undefined
// saveTick()
// undefined
// saveTick()
// undefined
// saveTick()
// undefined
// state
// { ticks: Array(15), difficulty: "easy", levels: { … } } difficulty: "easy"levels: { easy: "GBPUSD,EURUSD,EURGBP,EURJPY", medium: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY", hard: "GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY,GBPUSD,EURUSD,EURGBP,EURJPY" } ticks: Array(15)0: Array(4)0: { symbol: "GBPUSD", bid: 1.28508, ask: 1.2851, price: 1.28509, timestamp: 1542044422 } 1: { symbol: "EURUSD", bid: 1.12456, ask: 1.12456, price: 1.12456, timestamp: 1542044422 } 2: { symbol: "EURGBP", bid: 0.87507, ask: 0.87508, price: 0.875075, timestamp: 1542044422 } 3: { symbol: "EURJPY", bid: 127.943, ask: 127.945, price: 127.944, timestamp: 1542044422 } length: 4__proto__: Array(0)1: (4)[{ … }, { … }, { … }, { … }]2: (4)[{ … }, { … }, { … }, { … }]3: (4)[{ … }, { … }, { … }, { … }]4: (4)[{ … }, { … }, { … }, { … }]5: (4)[{ … }, { … }, { … }, { … }]6: (4)[{ … }, { … }, { … }, { … }]7: (4)[{ … }, { … }, { … }, { … }]8: (4)[{ … }, { … }, { … }, { … }]9: (4)[{ … }, { … }, { … }, { … }]10: (4)[{ … }, { … }, { … }, { … }]11: (4)[{ … }, { … }, { … }, { … }]12: (4)[{ … }, { … }, { … }, { … }]13: (4)[{ … }, { … }, { … }, { … }]14: Array(4)0: { symbol: "GBPUSD", bid: 1.28502, ask: 1.28504, price: 1.28503, timestamp: 1542045525 } 1: { symbol: "EURUSD", bid: 1.12442, ask: 1.12442, price: 1.12442, timestamp: 1542045525 } 2: { symbol: "EURGBP", bid: 0.87502, ask: 0.87503, price: 0.875025, timestamp: 1542045525 } 3: { symbol: "EURJPY", bid: 127.962, ask: 127.964, price: 127.963, timestamp: 1542045525 } length: 4__proto__: Array(0)length: 15__proto__: Array(0)__proto__: Object
// setInterval(saveTick, 1000)
// 4609
// clearInterval(4609)
// undefined
// state
