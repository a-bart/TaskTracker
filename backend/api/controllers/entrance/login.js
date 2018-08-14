const passport = require('passport');

const _onPassportAuth = (req, res, error, user, info) => {
  if (error) return res.serverError(error);
  if (!user) return res.unauthorized(null, info && info.code, info && info.message);

  const token = sails.helpers.createJwtToken(user);

  return res.ok({
    token,
    user
  });
};

module.exports = function login (req, res) {
  passport.authenticate('local', _onPassportAuth.bind(this, req, res))(req, res);
};
