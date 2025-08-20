const passport = require('passport');

// const maxRequests = process.env.RATE_LIMIT_MAX || 10;
// const loginLimiter = rateLimit({
//     windowMs: 60 * 1000,
//     max: maxRequests,
//     message: { error: "Too many requests, please try again later." }
// });

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
    points: 10,        // max requests
    duration: 60,      // per 60 seconds
    blockDuration: 300 // block for 300 seconds if exceeded
});
export default function (app) {
  app
    .get(
      '/auth/openid/return',
        rateLimiter,
      function (req, res, next) {
        passport.authenticate('azuread-openidconnect', {
          response: res,
          failureRedirect: '/error',
        })(req, res, function (err) {
          if (err) {
            // Redirect to the error page
            return res.redirect('/error');
          }

          next();
        });
      },
      function (req, res) {
        res.redirect('/portal/dashboard');
      }
    )
    .post(
      '/auth/openid/return',
      function (req, res, next) {
        passport.authenticate('azuread-openidconnect', {
          response: res,
          failureRedirect: '/error',
        })(req, res, next);
      },
      function (req, res) {

        const currentUserEmail = req.user.emails[0];

        req.session.user = req.user;
        req.session.data.email = currentUserEmail;

        res.redirect('/portal/dashboard');
      }
    );
}
