const nodemailer = require('nodemailer');

const fromCreds = {
  user: 'mretfaster@gmail.com',
  pass: 'Jakethe86',
};

const toCreds = {
  from: 'noreply.jake@gmail.com',
  to: 'mretfaster@gmail.com',
  subject: 'Mic Check',
  text: 'That was easy!',
}
async function sendEmail({ recipient }) {
  if (!recipient.to || !recipient.subject || !recipient.text) { 
    throw new Error('Cannot sendEmail without expected recipient props')
  }
  
  try {
    console.log('sending email!');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        ...fromCreds,
      },
    });

    const mailRes = await transporter.sendMail(toCreds);
    console.log('mailRes');
    console.log(mailRes);

    console.log('Email sent: ' + mailRes.response);
    console.log('// - - - - - //');
    return true;
  } catch (error) {
    console.log('sendEmail error');
    console.log(error.message);
  }
}

module.exports = {
  sendEmail,
};
