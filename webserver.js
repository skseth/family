'use strict';

const path = require('path');
const express = require('express');
const config = require('./config');
const PersonApi = require('./persons/api').PersonApi
const db = require('./db/mongoose.js')

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')))


const personApi = new PersonApi(db)

app.use('/api/persons', personApi.Router)

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  const server = app.listen(config.get('PORT'), () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
