const EventEmitter = require('events');
const dns = require('dns');

const { promisify } = require('util');

const { confidenceThreshold, sampleSize, devices } = require('config');
const { Machine, sendParent, assign, spawn, sendUpdate } = require('xstate');

const Counter = require('./counter');

const lookup = promisify(dns.lookup);

async function getAddress(id) {
  try {
    const { address } = await lookup(id);
    return address;
  } catch {
    return null;
  }
}

function getDeviceStatusByAddress(devices, address) {
  return devices.reduce((acc, curr) => {
    if (curr.ip === address) {
      return { ...curr };
    }
    return acc;
  }, {});
}

function handleDeviceData(people, data) {
  return Promise.all(people.map(person => person.handleDelivery(data)));
}

class Person {
  router = null;
  counter = new Counter();
  index = 0;

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  async handleDelivery(devices) {
    const address = await getAddress(this.id);
    const response = getDeviceStatusByAddress(devices, address);
    const { conn_orbi_name: router } = response;

    this.counter.add(router);
    this.index += 1;

    console.log(this.id, this.name, router);

    if (!this.router) {
      this.router = router;
      return;
    }

    if (this.index === sampleSize) {
      // get the highest number of occurrences
      const [[highestInstance, highestCount]] = [
        ...Array.from(this.counter.entries()),
      ].sort((a, b) => b[1] - a[1]);
      const confidence = highestCount / sampleSize;

      this.counter = new Counter();
      this.index = 0;

      if (confidence >= confidenceThreshold) {
        this.router = router;
      }
    }
  }
}

class People {
  static machine = new Machine({
    id: 'people',
    initial: 'wait',
    context: {
      people: devices.map(device => new Person(device)),
    },
    states: {
      wait: {
        on: {
          PROCESS: { target: 'process' },
        },
      },
      process: {
        invoke: {
          src: ({ people }, { data }) => handleDeviceData(people, data),
          onDone: {
            target: 'wait',
            actions: sendParent((context, event) => ({
              ...context,
              type: 'PROCESSED',
            })),
          },
          onError: { target: 'wait' },
        },
      },
    },
  });
}

module.exports = People;
