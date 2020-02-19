const amqp = require('amqp-connection-manager');

let RabbitMqManager = {
  async create(config) {
    return new Promise((resolve, reject) => {
      let connection;
      const { user, pass, host, port, vhost } = config;
      connection = amqp.connect([`amqp://${user}:${pass}@${host}:${port}/${vhost}`]);
      connection.once('connect', function () {
        return resolve(connection);
      });

      connection.once('disconnect', function (params) {
        return reject(params.err);
      });

      connection.on('connect', function () {
        console.log('Rabbit connected!');
      });

      connection.on('disconnect', function (params) {
        console.log('Rabbit disconnected.', JSON.stringify(params.err));
      });
    })
  }
}

const EventBus = {
  connection: null,
  channels: {},
  init: async ({ user, pass, host, port, vhost }) => {
    let connection = await RabbitMqManager.create({ user, pass, host, port, vhost })
    EventBus.connection = connection;
    return EventBus;
  },
  on: (eventName, listen) => {
    const channel = EventBus.connection.createChannel({
      name: eventName,
      setup: activeChannel => Promise.all([
        activeChannel.prefetch(1),
        activeChannel.assertQueue(eventName, { durable: true, messageTtl: 2 * 24 * 60 * 60 * 1000 }),
        activeChannel.consume(eventName, function (msg) {
          let data = JSON.parse(msg.content.toString());
          listen(data)
          channel.ack(msg);
        }, { noAck: false })
      ])
    })
    EventBus.channels[eventName] = channel;
  },
  emit: (eventName, eventData) => {
    EventBus.channels[eventName].sendToQueue(eventName, new Buffer(JSON.stringify(eventData)), { persistent: true })
  }
}

module.exports = { EventBus }

let test = async () => {
  await EventBus.init({ user: 'guest', pass: 'guest', host: 'localhost', port: 5672, vhost: 'qhdapp' });
  EventBus.on('QHDTEST', (data) => {
    console.log(data)
  })
  EventBus.on('QHDTEST2', (data) => {
    console.log(data)
  })
  EventBus.emit('QHDTEST', { test: 123123 })
}
// test()