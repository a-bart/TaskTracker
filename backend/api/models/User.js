/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      example: 'carol.reyna@microsoft.com'
    },
    password: {
      type: 'string',
      protect: true,
      required: true,
      example: '2$28a8eabna301089103-13948134nad'
    },
    name: {
      type: 'string',
      example: 'Alex'
    },
    isSuperAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
    },
    passwordResetToken: {
      type: 'string',
      description: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
    },
    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },
    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },
    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },
    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      defaultsTo: 'confirmed',
      description: 'The confirmation status of the user\'s email address.',
      extendedDescription:
        `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
        admin users).  When the email verification feature is enabled, new users created via the
        signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
        Similarly, when an existing user changes their email address, they switch to the "changeRequested"
        email status until they click the link in the confirmation email.`
    },
    emailChangeCandidate: {
      type: 'string',
      description: 'The (still-unconfirmed) email address that this user wants to change to.'
    },
    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  // waterline method. see more: https://sailsjs.com/documentation/reference/waterline-orm/records/to-json
  customToJSON: function() {
    return _.omit(this, ['password'])
  },

  toJWTFormat: function() {
    return {
      id: this.id.toString(),
      email: this.email,
      name: this.name || null
    }
  }

};

