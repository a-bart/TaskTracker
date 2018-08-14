const Mailgun = require('mailgun-js');
const mailcomposer = require('mailcomposer');
const config = require('../../../config/custom');

module.exports = {
  friendlyName: 'Send HTML email',
  description: 'Send an automated HTML email.',
  extendedDescription: 'This implementation delivers the provided message using the Mailgun API.',
  moreInfoUrl: 'https://documentation.mailgun.com/en/latest/api-sending.html#sending',

  inputs: {
    to: {
      example: 'jane@example.com',
      description: 'Email address of the desired recipient.',
      required: true
    },
    subject: {
      description: 'Subject line for the email.',
      example: 'Welcome, Jane!',
      required: true
    },
    htmlMessage: {
      description: 'The html body of the email.',
      example: '<p>Jane,</p>\n<p>Thanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.</p>\n<br/>\n<p><em>Sincerely,</em></p>\n<p><em>The Management</em></p>',
      required: true
    },
    from: {
      description: 'The return email address of the sender.',
      example: 'noreply@tasktrackerteam.com',
      required: true
    },
    fromName: {
      description: 'The display name of the sender, for display purposes in the inbox.',
      example: 'Task Tracker Team.'
    },
    toName: {
      example: 'Jane Doe',
      description: 'Full name of the primary recipient.',
      extendedDescription: 'If left blank, defaults to the recipient\'s email address.'
    },
    textMessage: {
      description: 'The plaintext fallback for the email.',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management'
    },
    testMode: {
      type: 'boolean',
      friendlyName: 'Test mode?',
      description: 'Whether to send this email using Mailgun\'s "test mode".',
      defaultsTo: false
    },
  },

  exits: {
    success: {
      description: 'The email was sent successfully.',
      extendedDescription: 'Note that this does not necessarily mean it was _delivered_ successfully.  If you are having issues with mail being delivered, check the Mailgun dashboard for delivery status, and be sure to verify that the email wasn\'t quarantined or flagged as spam by the recipient\'s email service (e.g. Gmail\'s "spam folder" or GSuite\'s "admin quarantine").'
    }
  },

  fn: function(inputs, exits) {
    const { mailgunSecret, mailgunDomain } = config.custom;

    // Initialize the underlying mailgun API wrapper lib.
    const mailgun = Mailgun({
      apiKey: mailgunSecret,
      domain: mailgunDomain
    });

    // Format recipients
    // e.g. 'Jane Doe <jane@example.com>,foo@example.com'.
    const recipients = [
      { emailAddress: inputs.to, name: inputs.toName }
    ];
    const formattedRecipients = recipients.map((recipient) => {
      if (recipient.name) {
        return recipient.name+' <'+recipient.emailAddress+'>';
      } else {
        return recipient.emailAddress;
      }
    }).join(',');

    // Prepare the email payload.
    mailcomposer({
      to: formattedRecipients,
      subject: inputs.subject,
      body: inputs.textMessage || '',
      html: inputs.htmlMessage || '',
      from: inputs.fromName ? `${inputs.fromName} <${inputs.from}>` : inputs.from,
    })
      .build(function(err, message) {
        if (err) { return exits.error(err); }

        // Send the mail via Mailgun's `sendMime` API call.
        mailgun.messages().sendMime({
          to: formattedRecipients,
          message: message.toString('ascii'),
          'o:testmode': inputs.testMode ? 'yes' : undefined
        }, function (err) {
          if (err) { return exits.error(err); }
          return exits.success();
        });
      });
  }

};
