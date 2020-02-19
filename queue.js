let { EventBus } = require('./index');

let send = (req, res) => {
  try {
    EventBus.emit('QHDTEST', { test: 123123 })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}

let send2 = (req, res) => {
  try {
    EventBus.emit('QHDTEST2', { test: 'send 2' })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}

module.exports = { send, send2 }