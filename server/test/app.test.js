import test from 'ava';
const request = require('supertest');
const app = require('../app');

test('some feature', t => {
	return request(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
          t.is(response.body.name, 'tobi')
      })
});

test('deepequal', t => {
	t.deepEqual([1, 2], [1, 2]);
});