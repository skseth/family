
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// TODO - support datastore + mongo
const personmodel = require('./model-mongodb.js');

// set up router for persons api
const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
  res.status(200).json({ name: 'tobi' });
})

router.post('/', (req, res, next) => {
	personmodel.create(req.body)
	.then((entity) => {
		res.json(entity)
	})
	.catch((err) => {
		res.json({"error": err})
	})

})

module.exports = router
