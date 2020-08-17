const { Machine, spawn, assign, send, interpret } = require('xstate');
const { routerMap } = require('config');

const Floor = require('./floor');

const { machine: OrbiMachine } = require('./orbi');
const { machine: PeopleMachine } = require('./person');

const floorMap = {
  [routerMap.UNKNOWN]: 'unknown',
  [routerMap.UPSTAIRS]: 'upstairs',
  [routerMap.DOWNSTAIRS]: 'downstairs',
  [routerMap.BASEMENT]: 'basement',
  undefined: 'off_network',
};

const floors = Object.values(floorMap).reduce(
  (acc, curr) => ({ ...acc, [curr]: new Floor(curr) }),
  {},
);

function handleFlooring(people) {
  Object.values(floors).forEach((f) => f.empty());
  people.forEach((p) => {
    const floor = floorMap[p.router];
    console.log(floor, floorMap[p.router], '<=====', p);
    floors[floor].add(p);
  });
}

interpret(
  new Machine({
    id: 'supervisor',
    initial: 'inactive',
    context: {},
    states: {
      inactive: {
        always: {
          target: 'active',
          actions: [() => console.log('🐉')],
        },
      },
      active: {
        entry: assign({
          orbi: () => spawn(OrbiMachine, 'orbi'),
          people: () => spawn(PeopleMachine, 'people'),
        }),
        on: {
          DELIVERY: {
            actions: send((_, event) => ({ ...event, type: 'PROCESS' }), {
              to: (context) => context.people,
            }),
          },
          PROCESSED: {
            actions: (_, { people }) => handleFlooring(people),
          },
        },
      },
    },
  }),
).start();

module.exports = floors;
