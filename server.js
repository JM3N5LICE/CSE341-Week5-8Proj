// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }


// const express = require('express');
// const bodyParser = require('body-parser');
// const mongodb = require('./db/connect');

// const port = process.env.PORT || 8080;
// const app = express();
// const config = require('./config'); // Adjust the path based on your project structure

// // Access MongoDB URI
// const mongoURI = process.env.MONGODB_URI;


// app.get('/', (req, res) => {
//     res.send('Welcome to the root of the application!');
//   });
  
//   // Use the routes defined in ./routes/index.js
//   app.use('/', require('./routes/index'));
  
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });

  const express = require('express');
  const bodyParser = require('body-parser');
  const mongodb = require('./db/connect');
  
  const port = process.env.PORT || 8080;
  const app = express();
  
  app
    .use(bodyParser.json())
    .use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    })
    .use('/', require('./routes'));
  
  mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port);
      console.log(`Connected to DB and listening on ${port}`);
    }
  });