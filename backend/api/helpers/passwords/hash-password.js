const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Hash password',
  description: 'Hash a password (i.e. one-way encryption) using the BCrypt algorithm.',
  moreInfoUrl: 'https://en.wikipedia.org/wiki/Bcrypt',
  sideEffects: 'cacheable',
  inputs: {
    password: {
      type: 'string',
      description: 'The password to hash (in plain text).',
      example: 'k3yboard.cAt',
      required: true,
    },
    strength: {
      type: 'number',
      description: 'The hash strength.',
      example: 12,
      extendedDescription: `Strength is measured in this case by the number of iterations it takes to generate the 
      cryptographic key.  Hashes generated with a higher "strength" value will take longer to crack with brute force, 
      but will also take longer to generate.  A minimum of 10 (the default) is recommended.`,
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Bcrypt',
      defaultsTo: 10
    }
  },
  exits: {
    success: {
      outputFriendlyName: 'Hashed password',
      outputExample: '$2a$10$VC.etVpgnfYrUt5/TW4ktOy91yv/gWC6c.XXeK7jx69ukP/4Ocgj2',
      outputDescription: 'The (irreversibly munged) password hash generated from the provided password.',
      extendedDescription: `Secure BCrypt hashes are already irreversibly munged, so they\'re safe to store at rest
      in your database.`
    },
  },
  fn: async function(inputs, exits) {
    try {
      const hashed = await bcrypt.hash(inputs.password, inputs.strength);
      return exits.success(hashed);
    } catch (err) {
      return exits.error(err);
    }
  }
};
