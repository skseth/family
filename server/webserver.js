'use strict';

const path = require('path')
const express = require('express')

const defaults = {
  node: {
    env: 'development'
  },
  server: {
    port: 8080,
    databackend: 'mongoose'
  },
  mongoose: {
    uri: 'mongodb://localhost/family'
  }
}

const configfile = path.join(__dirname, '..', 'config.json')

const Server = require('./stdserver/server').Server

const server = new Server(configfile, defaults, (app, config, databackend, db) => {

	const initPersonApi = () => {
		const PersonApi = require("./persons/api").PersonApi
		const personApi = new PersonApi(databackend, db)
		app.use('/api/persons', personApi.Router)
	}

	const initStatic = () => {
		app.use('/', express.static(path.join(__dirname, '..', 'client')))    
	}


	initPersonApi()
	initStatic()
})

server.listen()