function make(type){
  // TRACKS how many times this fn gets called INTERNALLY
  var id = 0;

  // return a fn
  return (name) => {
    // increment id
    id += 1;

    return {id, type, name}
  }
}

const user = make('User');
const obj = make('Object');

const Donna = user('Donna')
const Raf = user('raf')

const chair = obj('chair')
const canon = obj('canon')