import express from 'express';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';
import path from 'path';
import edt from 'express-debug';
import {
  sessionData,
  addCheckedFunction,
  matchRoutes,
  addNunjucksFilters,
  forceHttps
} from './utilities';
import routes from './api/routes';
import config from './app/config.js';

var connect_redis = require("connect-redis");

var cors = require('cors')

const lusca = require('lusca');


// import helmet from 'helmet';
// import { NONAME } from 'dns';

require("dotenv-json")();
const app = express();
app.options('*', cors());

// app.use(lusca.csrf());

// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

const PORT = process.env.PORT || config.PORT;

// Global vars
app.locals.serviceName = config.SERVICE_NAME;

// Local vars
const env = process.env.NODE_ENV;

if (env === 'production') {
  // app.use(helmet());
  app.get('/', function(req, res, next){
    if(req.hostname === 'report-wreck-material.service.gov.uk'){
      res.redirect('https://www.gov.uk/report-wreck-material/reporting-wreck-material');
    }else{
      next();
    }
  });
}

let useHttps = process.env.USE_HTTPS || config.USE_HTTPS;

useHttps = useHttps.toLowerCase();

// Production session data
const session = require('express-session');
var redis = require("redis");
var redisStore = connect_redis(session);
var redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: 6379,
});

const isSecure = env === 'production' && useHttps === 'true';
if (isSecure) {
  app.use(forceHttps);
}

// Support for parsing data in POSTs
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set('trust proxy', 1); // needed for secure cookies on heroku

// Configure nunjucks environment
const nunjucksAppEnv = nunjucks.configure(
  [
    path.join(__dirname, './node_modules/govuk-frontend/'),
    path.join(__dirname, './app/views/'),
  ],
  {
    autoescape: false,
    express: app,
    watch: env === 'development' ? true : false,
  }
);
addCheckedFunction(nunjucksAppEnv);
addNunjucksFilters(nunjucksAppEnv);

// Set views engine
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, './dist')));
app.use('/uploads', express.static('uploads'));
app.use('/auth', express.static(path.join(__dirname, 'app', 'static', 'auth')));


app.use(
  '/assets',
  express.static(
    path.join(__dirname, './node_modules/govuk-frontend/govuk/assets')
  )
);

// Serve CSS files specifically
app.use('/assets/css', (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
}, express.static(path.join(__dirname, './dist/assets/css')));


// Session uses service name to avoid clashes with other prototypes
app.use(session({
  secret: process.env.CSRFT_SESSION_SECRET,
  store: new redisStore({
      client: redisClient,
      ttl: 3600
  }),
  sameSite: 'none',
  saveUninitialized: false,
  resave: false,
  cookie: { httpOnly: true , secure: isSecure},
  unset: 'destroy'
}));

// Manage session data. Assigns default values to data
app.use(sessionData);

// Logs req.session data
if (env === 'development') edt(app, { panels: ['session'] });


app.get('/', function(req, res){
  res.render('index');
})

// Load API routes
app.use('/', routes());

// Disables caching when user clicks back button on confirmation page
app.use('/report/check-your-answers', function (req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});

app.get(/^([^.]+)$/, function (req, res, next) {
  if (config.SERVICE_UNAVAILABLE === true) {
    console.log('Service Unavailable.');
    res.status('503');
    res.sendFile(path.join(__dirname, '/app/static/service-unavailable.html'));
  } else {
    matchRoutes(req, res, next);
  }
});
// Redirect all POSTs to GETs
app.post(/^\/([^.]+)$/, function (req, res) {
  res.redirect('/' + req.params[0]);
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error(`Page not found: ${req.path}`);
  err.status = 404;

  next(err);
});

// Display error
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  if (err.message.indexOf('not found') > 0) {
    res.status(404).render('404');
  }
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT} - url: http://localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// export default app;