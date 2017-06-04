
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const PersonApp = require('./app.js').PersonApp
// TODO - support datastore + mongo


class PersonApi {
	constructor(db) {
		this._router = express.Router()
		this._app = new PersonApp(db)
		this._initRoutes()
	}

	_initRoutes() {
		this._router.use(bodyParser.json());
		this._router.get('/', handleroute((req) => this._app.list()))
		this._router.post('/', handleroute((req) => this._app.create(req.body)))
		this._router.delete('/:personid', handleroute((req) => this._app.remove(req.params.personid)))
		this._router.get('/:personid', handleroute((req) => this._app.getById(req.params.personid)))
	}

	get Router() {
		return this._router
	}

}

function handleroute(fn) {
	return (req, res, next) => {
		fn(req)		
		.then((resp) => {
			res.status(resp.status).json(resp.body)
		})
		.catch((err) => {
			res.status(500).json({"error": err})
		})
	}
}

module.exports.PersonApi = PersonApi
