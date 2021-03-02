const { Readable } = require('stream');

const thisArr = [
  'apple qwery oihealfbq lieqiuwerbliqw liquweb qiweubrqiweu qilwueh alefh wieuhalw iuhrl iewuh ',
  'bottom liuwherilfa3e8y32horq3e98rfqhawelksfzb9q23hrbq239rpefhqa p9q2h83rp92q38hr q92p38hr qp2938rh qp2983rh pq298rh qp2938hr a3r93p28rn 3pq982ahr pq',
  'jeans 932hprqn829ra 9h2qp39r8 hq2p39r8h 2p9a8 naf2p98fhq2p398hr'
];

const rs = Readable.from(thisArr)
rs.on('data', d => {
  console.log('d')
  console.log(d)
})