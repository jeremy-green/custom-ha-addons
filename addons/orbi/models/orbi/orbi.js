const vm = require('vm');

const fetch = require('node-fetch');

const { interval, user, password } = require('config');
const { Machine, sendParent } = require('xstate');

function loadDevicesFromRouter() {
  const credentials = Buffer.from(`${user}:${password}`).toString('base64');
  const authorization = `Basic ${credentials}`;
  const url = `http://orbilogin.com/DEV_device_info.htm?ts=${Date.now()}`;
  return fetch(url, { headers: { authorization } }).then(res => res.text());
}

class Orbi {
  static machine = new Machine({
    initial: 'waiting',
    states: {
      waiting: {
        after: {
          [interval]: 'loading',
        },
      },
      loading: {
        invoke: {
          src: async (context, event) => {
            const txt = await loadDevicesFromRouter();
            vm.runInThisContext(txt); // defines `device` array
            // eslint-disable-next-line no-undef
            return device;
          },
          onDone: {
            target: 'waiting',
            actions: sendParent((_, { data }) => ({ data, type: 'DELIVERY' })),
          },
          onError: {
            target: 'waiting',
            actions: [(context, error) => console.log(context, error)],
          },
        },
      },
    },
  });
}

module.exports = Orbi;
