var nodemailer = require('nodemailer');
var config = require('../config');

module.exports = function(options){
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
      service:config.get('mailer:service'),
      auth: {
          user: config.get('mailer:auth:user'),
          pass: config.get('mailer:auth:pass')
      }
  });

  // setup email data with unicode symbols
  var mailOptions = {
      from: config.get('mailer:mailOptions:from'),
      to: options.to || config.get('mailer:mailOptions:to'),
      subject: options.subject || config.get('mailer:mailOptions:subject'),
      text: options.text || "",
      html: options.html || ""
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions,function(err, info) {
      if (err) {
          return console.log(err);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
};
