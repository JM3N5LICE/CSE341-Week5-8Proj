var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(express.json());
const port = process.env.PORT || 8080;
const mongodb = require('./db/connect');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('swagger.json');

// Okta Authentication with google
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.CLIENT_SECRET,
  baseURL: 'https://cse341movie.onrender.com',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));


app.listen(8080, () => {
    console.log(`server started on port ${port}`);
});

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        //app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});