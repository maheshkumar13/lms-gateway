import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

/*
Error Code list:
AU01 - EMail mismatch
AU02 - Password mismatch
*/
function localAuthenticate(User, email, password, done) {
  User.findOne({
    email: email.toLowerCase(),
  }).exec()
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.',
          code: 'AU01',
        });
      }
      return user.authenticate(password, (authError, authenticated) => {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, { message: 'This password is not correct.', code: 'AU02' });
        }
        return done(null, user);
      });
    })
    .catch(err => done(err));
}

export default function setup(User/* config */) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password', // this is the virtual field on the model
  }, (email, password, done) => localAuthenticate(User, email, password, done)));
}

export { setup };
