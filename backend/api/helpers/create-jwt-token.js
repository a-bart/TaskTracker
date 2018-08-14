const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Create JWT Token',
  description: 'Method generates jwt token to be used in authorization',
  sync: true,
  inputs: {
    user: {
      description: 'The user to be placed in token',
      example: {
        id: '5b729dafde07a109e5463040',
        email: 'test@example.com',
        isSuperAdmin: false
      },
      type: {},
      required: true
    }
  },
  exits: {
    success: {
      outputFriendlyName: 'JWT token string',
    }
  },
  fn: function(inputs, exits) {
    const { secret, expiresIn, algorithm } = sails.config.custom.jwtSettings;
    const { user } = inputs;

    const token = jwt.sign(
      {
        user: {
          id: user.id.toString(),
          email: user.email
        }
      },
      secret,
      {
        algorithm,
        expiresIn
      }
    );

    return exits.success(token);
  }
};
