const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// the POLL_INTERVAL to poll at in milliseconds
const POLL_INTERVAL = 3000;
const POLL_API_PATH = '/poll';

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postMsgs(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postMsgs(user, text) {
  const msgData = {
    user, text
  }

  const fetchOpts = {
    method: 'POST',
    body: JSON.stringify(msgData),
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(POLL_API_PATH, fetchOpts);
  // const fetchRes = await fetch(POLL_API_PATH, fetchOpts)
  // const jsonRes = fetchRes.json()
}

async function getMsgs() {
  let jsonFromApi;
  try {
    const res = await fetch(POLL_API_PATH)

    // something went wrong!
    if (res.status >= 400) {
      // error gets caught in the catch block below
      throw new Error('polling request errored with status', res.status)
    }

    const { msg } = await res.json()
    jsonFromApi = msg;
    render(jsonFromApi);  

    failedPollingCount = 0;

  } catch (e) {
    console.error("Polling error: ", e)
    failedPollingCount++;
  }
  
  /*
    setTImeout to poll is a more "trivial" approach
    requestAnimationFrame is a less persistent and more ui-aware approach
    THIS is replaced with rafFn below
  */ 
  // setTimeout(getMsgs, POLL_INTERVAL)
}

function render(msgArr) {
  // as long as msgsArr is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = msgArr.map(({ user, text, time, id }) => msgString(user, text, time, id));
  msgs.innerHTML = html?.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const msgString = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// A Trivial way to start the polling:
// make the first request
// REPLACED with code below
// getMsgs();


// a more browser-friendly version beside setTimeout
// gets called ... a lot.... like a lot.....the POLL_INTERVAL keeps the fetch happening less frequently
let timeToMakeNextPoll = 0;
const BACKOFF_TIME = 5000;
let failedPollingCount = 0
async function rafFn(s) {
  if (timeToMakeNextPoll <= s) {
    await getMsgs()
    timeToMakeNextPoll = s + POLL_INTERVAL + (failedPollingCount * BACKOFF_TIME);
  }
  requestAnimationFrame(rafFn)
}

requestAnimationFrame(rafFn);