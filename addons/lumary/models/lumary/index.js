const Net = require('net');

const { Machine, interpret } = require('xstate');

const constants = require('./constants');

const port = 6668;

class Lumary {
  #service = null;
  #machine = new Machine(
    {
      initial: 'off',
      states: {
        on: {
          entry: ['notify', 'toggle'],
          on: { OFF: 'off' },
        },
        off: {
          entry: ['notify', 'toggle'],
          on: { ON: 'on' },
        },
      },
    },
    {
      actions: {
        notify: (context, event) => console.log(context, event),
        toggle: (context, event) => this.update(context, event),
      },
    },
  );

  constructor(context) {
    this.#service = interpret(this.#machine.withContext(context)).start();
  }

  update({ host, name }, { type }) {
    if (type === 'xstate.init') {
      return;
    }

    return new Promise((resolve, reject) => {
      const client = new Net.Socket();
      client.on('close', resolve);
      client.on('error', reject);
      // client.on('timeout', reject);

      client.connect({ port, host }, () => {
        console.log('TCP connection established with the server.', host);
        client.write(new Uint8Array(constants[name][type]));
        client.destroy();
      });
    });
  }

  turn(state) {
    this.#service.send(state.toUpperCase());
  }

  toJSON() {
    const { context, value } = this.#service.state;
    return { context, value };
  }
}

module.exports = new Map([
  ['the_diplomat', new Lumary({ name: 'the_diplomat', host: '192.168.1.181' })],
  ['patio', new Lumary({ name: 'patio', host: '192.168.1.181' })],
]);
