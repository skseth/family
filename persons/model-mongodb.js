'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

// TODO - get from nconf
// TODO - make robust
const dbURI = 'mongodb://localhost/family'; // connect to our database

// https://stackoverflow.com/questions/16226472/mongoose-autoreconnect-option
const reconnectTimeout = 5000; // ms.

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

function connect() {
  mongoose.connect(dbURI, options)
  .catch(() => {}); // Catch the warning, no further treatment is required
                      // because the Connection events are already doing this
                      // for us.
}

const db = mongoose.connection;

db.on('connecting', () => {
  console.info('Connecting to MongoDB...');
});

db.on('error', (error) => {
  console.error(`MongoDB connection error: ${error}`);
  mongoose.disconnect();
});

db.on('connected', () => {
  console.info('Connected to MongoDB!');
});

db.once('open', () => {
  console.info('MongoDB connection opened!');
});

db.on('reconnected', () => {
  console.info('MongoDB reconnected!');
});

db.on('disconnected', () => {
  console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
  setTimeout(() => connect(), reconnectTimeout);
});

connect();



var Schema = mongoose.Schema;

var PersonSchema   = new Schema({
    name: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: false
      },  	
    created_at: Date,
  	updated_at: Date
}, { bufferCommands: false });

PersonSchema.pre('save', function(next) {
  var currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

const Person = mongoose.model('Person', PersonSchema);


function create(data) {
	return Person(data).save()
}

function list() {
  return Person.find({}).exec()
}

function remove(personid) {
  return Person.findByIdAndRemove(personid)
}

function getById(personid) {
  return Person.findById(personid)
}

module.exports = {
	create,
  list,
  remove,
  getById
}

