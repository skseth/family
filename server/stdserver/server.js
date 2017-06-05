'use strict';

const path = require('path');
const express = require('express');
const Config = require('./config').Config;

class Server {
  constructor(configfile, defaults, cb) {
    this.config = new Config(configfile, defaults)
    this.opts = this.config.get('server')
    this.app = express();
    this._db = this.initDB(this.opts.databackend)
    cb(this.app, configfile, this.opts.databackend, this._db)
    this.init404()
    this.init500()
  }

  initDB(databackend) {
    const DB = require(`./db/${databackend}.js`).DB
    return new DB(this.config.get(databackend))
  }

  init404() {
    // Basic 404 handler
    this.app.use((req, res) => {
      res.status(404).send('Not Found');
    });    
  }

  init500() {
    // Basic error handler
    this.app.use((err, req, res, next) => {
      console.error(err);
      // If our routes specified a specific response, then send that. Otherwise,
      // send a generic message so as not to leak anything.
      res.status(500).send(err.response || 'Something broke!');
    });
  }

  listen() {
    this.server = this.app.listen(this.opts.port, () => {
      const port = this.server.address().port;
      console.log(`App listening on port ${port}`);
    })
  }

}




/*

  if (module === require.main) {
    // Start the server
    const server = app.listen(opts.port, () => {
      const port = server.address().port;
      console.log(`App listening on port ${port}`);
    });
  }
} */

module.exports.Server = Server;
