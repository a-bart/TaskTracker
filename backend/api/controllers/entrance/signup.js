module.exports = {
  friendlyName: 'Signup',
  description: 'Sign up for a new user account.',
  inputs: {
    email: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },
  },
  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'The provided password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
        'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
  },
  fn: async function (inputs, exits) {
    const newEmailAddress = inputs.email.toLowerCase();

    // hash password
    const salt = 10;
    const hashedPassword = await sails.helpers.passwords.hashPassword(inputs.password, salt);

    const newUserRecord = await User
      .create(Object.assign({
        email: newEmailAddress,
        password: hashedPassword
      }, sails.config.custom.verifyEmailAddresses? {
        emailProofToken: await sails.helpers.strings.random('url-friendly'),
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
        emailStatus: 'unconfirmed'
      }:{}))
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .intercept({name: 'UsageError'}, 'invalid')
      .fetch();

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          token: newUserRecord.emailProofToken
        }
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

    // Since everything went ok, send our 200 response.
    return exits.success();
  }
};
