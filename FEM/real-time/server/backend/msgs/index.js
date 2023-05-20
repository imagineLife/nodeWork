import nanobuffer from 'nanobuffer';

let msgArr = [];
function setup() {
  // set up a limited array
  msgArr = new nanobuffer(50);

  // feel free to take out, this just seeds the server with at least one message
  msgArr.push({
    user: 'Jake',
    text: 'initialMessage',
    time: Date.now(),
  });
}

function get() {
  return Array.from(msgArr).reverse();
}

export { setup };
export { get };
export { msgArr };
