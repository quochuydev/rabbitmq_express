let { EventBus } = require('./index');

let consumer = () => {
  EventBus.on('QHDTEST', (data) => {
    console.log(data)
  })
  EventBus.on('QHDTEST2', (data) => {
    console.log(data)
  })
}

module.exports = { consumer }
