const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./custom');

/**
 * Configuration object for local strategy
 */
const LOCAL_STRATEGY_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
};

/**
 * Configuration object for JWT strategy
 */
const JWT_STRATEGY_CONFIG = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.custom.jwtSettings.secret,
  // issuer : config.custom.jwtSettings.issuer,
  // audience: config.custom.jwtSettings.audience,
  passReqToCallback: false
};

const _onLocalStrategyAuth = (email, password, next) => {
  User
    .findOne({ email })
    .exec((err, user) => {
      if (err) return next(err, false, {});
      if (!user) return next(null, false, {
        code: 'E_USER_NOT_FOUND',
        message: email + ' is not found'
      });

      // check password hash
      bcrypt.compare(password, user.password, function(err, res) {
        if (err) return next(err, false, {});
        if (!res) return next(null, false, {
          code: 'E_WRONG_PASSWORD',
          message: 'Password is wrong'
        });
        return next(null, user, {});
      });
    });
};

const _onJwtStrategyAuth = (payload, next) => {
  const user = payload.user;
  // todo: could be additional user check in db
  return next(null, user, {});
};

passport.use(
  new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(
  new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));
