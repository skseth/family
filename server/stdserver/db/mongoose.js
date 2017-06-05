'use strict';

const mongoose = require('mongoose');
const reconnectTimeout = 5000; // ms.


class MongooseDB {
  constructor(config) {
    this._mongooseURI = config.uri
    this._mongoose = mongoose
    this._initMongoose()
  }

  _initMongoose() {
      this._mongoose.Promise = global.Promise

      this._mongoose.connection
      .on('connecting', () => {
        console.info('Connecting to MongoDB...');
      })
      .on('error', (error) => {
        console.error(`MongoDB connection error: ${error}`);
        this._mongoose.disconnect();
      })
      .on('connected', () => {
        console.info('Connected to MongoDB!');
      })
      .once('open', () => {
        console.info('MongoDB connection opened!');
      })
      .on('reconnected', () => {
        console.info('MongoDB reconnected!');
      })
      .on('disconnected', () => {
        console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
        setTimeout(() => this.connect(), reconnectTimeout);
      })

      this.connect()
  }

  connect() {
    mongoose.connect(this._mongooseURI, options)
    .catch(() => {}); 
  }

  get Mongoose() { return this._mongoose }

}

const options = {
	server: {
		poolSize: 5,
		socketOptions: { 
			autoReconnect: false,
			keepAlive: 300000, 
			connectTimeoutMS: 3000
		} /*,
	    reconnectInterval: 60,
	    reconnectTries: 1  */    	    
	},
	db: { bufferMaxEntries: 0 }
}

module.exports.DB = MongooseDB

