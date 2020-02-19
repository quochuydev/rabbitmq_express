let express = require('express');
let app = express();
let { EventBus } = require('./index');
let { send, send2 } = require('./queue');
let { consumer } = require('./consumer')
let config = require('./config');

let init = async () => {
  let { user, pass, host, port, vhost } = config.rabbit;
  await EventBus.init({ user, pass, host, port, vhost });
  consumer();
}
init()

app.post('/send', send)
app.post('/send2', send2)

app.listen(3000, () => {
  console.log('running 3000')
})