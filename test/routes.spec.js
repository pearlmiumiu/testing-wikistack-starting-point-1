const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../app');
const agent = supertest(app);
// const agent = require('supertest')(require('../app'))

describe('http requests', function () {

  // describe('GET /wiki/', function () {
  //   it('responds with 200');
  // });

  // describe('GET /wiki/add', function () {
  //   it('responds with 200');
  // });

  // describe('GET /wiki/:urlTitle', function () {
  //   it('responds with 404 on page that does not exist');
  //   it('responds with 200 on page that does exist');
  // });

  // describe('GET /wiki/search/:tag', function () {
  //   it('responds with 200');
  // });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', function () {
    	return agent
    		.get('/wiki/blerp/similar')
    		.expect(404)
    });
    it('responds with 200 for similar page');
  });

  describe('POST /wiki', function () {
    it('responds with 302', function () { // 302 === found
    	return agent
    		.post('/wiki')
    		.send({ // creates HTTP request body
    			authorEmail: 'Choi@choi.choi',
    			authorName: 'Choi',
    			title: 'Winning',
    			content: 'Today',
    			status: 'open',
    			tags: 'JS'
    		})
    		.expect(302)
    });
    it('creates a page in the database');
  });

});