const { docEmailStatus } = require('./docEmailStatus')
const { getEmailRecipients } = require('./getEmailRecipients');
const { getFirstRecipientFromQueue } = require('./getFirstRecipientFromQueue');
const { sendEmail } = require('./sendEmail');
const { storeEmailRecipients } = require('./storeEmailRecipients');
const { loadConfig } = require('./loadConfig');

module.exports = {
  docEmailStatus,
  getEmailRecipients,
  getFirstRecipientFromQueue,
  sendEmail,
  storeEmailRecipients,
  loadConfig,
};