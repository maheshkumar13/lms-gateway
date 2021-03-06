import compose from 'composable-middleware';
import request from 'request';

import { config } from '../config/environment';

export function isAuthenticated() {
  return compose()
    .use((req, res, next) => {
      const authService = `${config.services.sso}/auth/isAuthenticated`;
      const options = {
        url: authService,
        headers: {
          authorization: req.headers.authorization,
          accesscontroltoken: req.headers.accesscontroltoken,
        },
      };
      request.post(options, (err, response, body) => {
        if (!response) response = {}
        let { statusCode, statusMessage } = response;
        if (!statusCode) statusCode = 401;
        if (statusCode !== 200) {
          res.statusMessage = statusMessage;
          res.status(statusCode).end();
        }
        if (err) {
          res.statusMessage = 'Something went wrong';
          res.status(401).end();
        }
        try {
          body = JSON.parse(body);
          if (body) {
            req.user = body;
            req.user.token = {
              authorization: req.headers.authorization,
              accesscontroltoken: req.headers.accesscontroltoken,
            };
            req.user_cxt = req.user
            next();
          }
        } catch (e) {
          res.status(401).end();
        }
      });
    });
}

// const validateJwt = expressJwt({
//   secret: config.secrets.session,
// });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
// export function isAuthenticated() {
//   return compose()
//     // Validate jwt
//     .use((req, res, next) => {
//       // allow access_token to be passed through query parameter as well
//       if (req.query && req.query.hasOwnProperty('access_token')) {
//         req.headers.authorization = `Bearer ${req.query.access_token}`;
//       }
//       // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
//       if (req.query && typeof req.headers.authorization === 'undefined') {
//         req.headers.authorization = `Bearer ${req.cookies.token}`;
//       }
//       validateJwt(req, res, next);
//     })
//     // Attach user to request
//     .use((req, res, next) => {
//       User.findById(req.user._id).exec()
//         .then((user) => {
//           if (!user) {
//             return res.status(401).end();
//           }
//           // console.info('hostname', req.user.hostname);
//           if (req.user.hostname !== user.hostname) {
//             res.statusMessage = 'hostname doesnot Match';
//             return res.status(401).end();
//           }
//           req.user = user;
//           next();
//         })
//         .catch(err => next(err));
//     });
// }

/**
 * Checks if the user role meets the minimum requirements of the route
 */
// export function hasRole(roleRequired) {
//   if (!roleRequired) {
//     throw new Error('Required role needs to be set');
//   }

//   return compose()
//     .use(isAuthenticated())
//     .use((req, res, next) => {
//       if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
//         return next();
//       }
//       return res.status(403).send('Forbidden');
//     });
// }

/**
 * Returns a jwt token signed by the app secret
 */
// export function signToken(id, role, instituteId, hostname) {
//   return jwt.sign({
//     _id: id, role, instituteId, hostname,
//   }, config.secrets.session, {
//     expiresIn: 60 * 60 * 24,
//   });
// }

// /**
//  * Set token cookie directly for oAuth strategies
//  */
// export function setTokenCookie(req, res) {
//   if (!req.user) {
//     return res.status(404).send('It looks like you aren\'t logged in, please try again.');
//   }
//   const token = signToken(req.user._id, req.user.role, req.user.instituteId, req.hostname);
//   res.cookie('token', token);
//   res.redirect('/');
// }

export default { isAuthenticated };
