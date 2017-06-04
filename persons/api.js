
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// TODO - support datastore + mongo
const personmodel = require('./model-mongodb.js');

// set up router for persons api
const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
	personmodel.list()
	.then((persons) => {
		res.json(persons)
	})
	.catch((err) => {
		res.json({"error": err})
	})
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


router.delete('/:personid', (req, res, next) => {
	personmodel.remove(req.params.personid)
	.then(() => {
		res.json({deleted: req.params.personid})
	})
	.catch((err) => {
		res.json({"error": err})
	})
})


router.get('/:personid', (req, res, next) => {
	personmodel.getById(req.params.personid)
	.then((person) => {
		res.json(person)
	})
	.catch((err) => {
		res.json({"error": err})
	})
})



module.exports = router
