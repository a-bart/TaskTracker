const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Check password attempt',
  description: 'Compare a plaintext password attempt against a Bcrypt hash (i.e. already-encrypted).',
  sideEffects: 'cacheable',
  inputs: {
    passwordAttempt: {
      type: 'string',
      description: 'The new password attempt (unencrypted).',
      example: 'k3yboard.cAt',
      required: true,
    },
    hashedPassword: {
      type: 'string',
      example: '$2a$10$VC.etVpgnfYrUt5/TW4ktOy91yv/gWC6c.XXeK7jx69ukP/4Ocgj2',
      description: 'The existing, correct password hash to compare against.',
      required: true
    }
  },
  exits: {
    success: {
      description: 'Password attempt matched the already-encrypted version.'
    },
    incorrect: {
      description: 'Password attempt did not match already-encrypted version.'
    }
  },
  fn: async function(inputs, exits) {
    try {
      const match = await bcrypt.compare(inputs.passwordAttempt, inputs.hashedPassword);
      if (match) {
        return exits.success();
      }

      return exits.incorrect();

    } catch (err) {
      return exits.error(err);
    }
  }
};
