/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /**************************************************************************
   *                                                                         *
   * The TTL (time-to-live) for various sorts of tokens before they expire.  *
   *                                                                         *
   **************************************************************************/
  passwordResetTokenTTL: 24*60*60*1000,// 24 hours
  emailProofTokenTTL:    24*60*60*1000,// 24 hours

  /**************************************************************************
   *                                                                         *
   * Automated email configuration                                           *
   *                                                                         *
   * Sandbox Mailgun credentials for use during development, as well as any  *
   * other default settings related to "how" and "where" automated emails    *
   * are sent.                                                               *
   *                                                                         *
   * (https://app.mailgun.com/app/domains)                                   *
   *                                                                         *
   **************************************************************************/
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunSecret: process.env.MAILGUN_SECRET_KEY,
  //--------------------------------------------------------------------------
  // /\  Configure these to enable support for automated emails.
  // ||  (Important for password recovery, verification, contact form, etc.)
  //--------------------------------------------------------------------------

  // The sender that all outgoing emails will appear to come from.
  fromEmailAddress: 'noreply@example.com',
  fromName: 'Task Tracker Team',

  // Whether to require proof of email address ownership any time a new user
  // signs up, or when an existing user attempts to change their email address.
  verifyEmailAddresses: false,

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // …
  jwtSettings: {
    secret: process.env.JWT_SECRET || 'tasktracker_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '14 days',
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    issuer: null,
    audience: null
  },

  dbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/task-tracker-sample',
};
