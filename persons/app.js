'use strict';
// knows nothing about http

const PersonModel = require('./model-mongodb.js').PersonModel;



class PersonApp {

	constructor(db) {
		this._model = new PersonModel(db);
	}

	list() {
		return this._model.list()
		.then(okresponse)
		.catch(errorresponse)		
	}

	create(newperson) {
		return this._model.create(newperson)
		.then(okresponse)
		.catch(errorresponse)
	}

	remove(personid) {
		return this._model.remove(personid)
		.then(okresponse)
		.catch(errorresponse)
	}

	getById(personid) {
		return this._model.getById(personid)
		.then(okresponse)
		.catch(errorresponse)		
	}
}

function errorresponse(err) {
	return {
		status: 500,
		body: err
	}	
}

function okresponse(resp) {
	return {
		status: 200,
		body: resp
	}		
}

// TODO: replace with ES6 syntax when available
module.exports.PersonApp = PersonApp