'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = require('nconf');
const path = require('path');



class Config {

  constructor(configfile, defaults) {
    this._nconf = nconf
      .argv()
      .env({ lowerCase: true })
      // 3. Config file
      .file({ file: configfile})
      // 4. Defaults
      .defaults(defaults)    
  }

  get(name) {
    return this._nconf.get(name)
  }
}

module.exports.Config = Config
