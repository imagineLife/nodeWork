const {
  getEmailRecipients,
  storeEmailRecipients,
  getFirstRecipientFromQueue,
  sendEmail,
  docEmailStatus,
  loadConfig
} = require('./eventHandlers');
const EventEmitter = require('events');
const Ev = new EventEmitter();

const EVENTS = {
  LOAD_CONFIG: {
    k: "LOAD_CONFIG",
    v: loadConfig
  },
  GET_EMAIL_RECIPIENTS: {
    k: "GET_EMAIL_RECIPIENTS",
    v: getEmailRecipients
  },
  STORE_EMAIL_RECIPIENTS: {
    k: "STORE_EMAIL_RECIPIENTS",
    v: storeEmailRecipients
  },
  GET_FIRST_RECIPIENT: {
    k: "GET_FIRST_RECIPIENT",
    v: getFirstRecipientFromQueue
  },
  SEND_EMAIL: {
    k: "SEND_EMAIL",
    v: sendEmail
  },
  DOCUMENT_EMAIL_SEND_STATUS: {
    k: "DOCUMENT_EMAIL_SEND_STATUS",
    v: docEmailStatus
  },
}

