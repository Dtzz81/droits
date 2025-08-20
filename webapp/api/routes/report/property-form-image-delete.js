import fs from 'fs';
import rateLimit from 'express-rate-limit';

// const maxRequests = process.env.RATE_LIMIT_MAX || 10;
// const propertyFormImageDeleteLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: maxRequests,
//   message: { error: "Too many requests, please try again later." }
// });

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
  points: 10,        // max requests
  duration: 60,      // per 60 seconds
  blockDuration: 300 // block for 300 seconds if exceeded
});
export default function (app) {
  app.post('/report/property-form-image-delete/:prop_id', rateLimiter, function (req, res) {
    const id = req.params.prop_id;
    const image = req.session.data.property[id].image;

    fs.unlink(`uploads/${image}`, (err) => {
      if (err) console.log(err);
      else {
        console.log(`\nDeleted file @ uploads/${image}`);
      }
    });

    const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];
    if (forbiddenKeys.includes(id)) {
      return res.sendStatus(403);
    }
    
    req.session.data.property[id].image = '';
    req.session.save();
    res.json();
  });
}
