global.NODE_ENV = 'test';
var supertest = require('supertest');
var app = require('../app');
var request = supertest.agent(app);
var models = require('../models');
var Page = models.Page;
var marked = require('marked');
var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
var assert = chai.assert;

describe('http routes', function() {
  describe('GET request for /wiki/', function() {
    it('responds with 200', function (done) {
      request
      .get('/wiki')
      .expect(200, done);
    });
  })
  describe('POST request for /wiki/', function() {
    after(function(done){
      Page.find({
        where: {
          title: "Elephants123456789"
        }
      }).then( function(elephant){
        elephant.destroy();
        done();
      }).catch(done);
    })
    it('adds an entry to the Page database', function(done) {
      request
      .post('/wiki/')
      .send({title: 'Elephants123456789',
             content: 'They have **tusks**!',
             status: 'closed',
             name: 'Dr. Spock',
             email: 'DocSpoc@enterprise.gov'
           })
      .expect(302)
      .then(function(result) {
        request
        .get('/wiki/Elephants123456789')
        .expect(200, done)
      })
    })
    it('adds an entry to the database', function(done) {
      Page.find({
        where: {
          title: 'Elephants123456789'
        }
      }).then( function(elephantresult){
        // console.log(elephantresult);
        expect(elephantresult.dataValues.title).to.equal('Elephants123456789');
        done()
      }).catch(done);
    })
  })
  describe('GET request for /wiki/search', function() {
    it('responds with 200', function (done) {
      request
      .get('/wiki/search')
      .expect(200, done);
    });
  })
  describe('POST request for /wiki/:urlTitle', function() {
    // it('updates a Page')
    it('responds with 404 if the page does not exist', function (done) {
      request
      .post('/wiki/thereisnowaythispageurltitlewouldeverexistakjhsdgfkajshgdfkaj/similar')
      .expect(404, done);
    });
  })
  describe('GET request for /wiki/:urlTitle/delete', function() {
    before(function(done){
      request.post('/wiki')
             .send({
               name: "The Dog Whisperer",
               email: "hound@tooth.com",
               title: "Dogs12345",
               content: "Dogs are the **best**!",
               status: "closed"
             }, done).then( function() {
               request.get('/wiki/Dogs12345').expect(200, done);
             });
            //  done();
    })
    it('uses "destroy" removes a Page from the site and the database based on urlTitle', function(done){
      request.get('/wiki/Dogs12345')
             .expect(200).end( function(err1, res1){
        if(err1) done(err1);
        console.log('Dogs should exist:', res1.status);
        request.get('/wiki/Dogs12345/delete')
               .expect(302).end( function(err2, res2){
          if(err2) done(err2);
          console.log('Delete status code should be 302 redirect:', res2.status);
          request.get('/wiki/Dogs12345')
                 .expect(404).end( function(err3, res3){
            if(err3) done(err3);
            console.log('Dogs should not exist:', res3.status);
            done();
          });
        });
      });
    });
  });
  describe('GET request for /wiki/add', function() {
    it('responds with 200', function (done) {
      request
      .get('/wiki/add')
      .expect(200, done);
    });
  })
  describe('GET request for /wiki/:urlTitle', function() {
    it('responds with 200', function (done) {
      request
      .get('/wiki/Snakes')
      .expect(200, done);
    });
  })
  describe('GET request for /wiki/:urlTitle/edit', function() {
    it('responds with 200', function (done) {
      request
      .get('/wiki/Snakes/edit')
      .expect(200, done);
    });
  })
  describe('GET request for /wiki/:urlTitle/similar', function() {
    it('responds with 404 if the page does not exist', function (done) {
      request
      .get('/wiki/thereisnowaythispageurltitlewouldeverexistakjhsdgfkajshgdfkaj/similar')
      .expect(404, done);
    });
    it('responds with 200', function (done) {
      request
      .get('/wiki/Snakes/similar')
      .expect(200, done);
    });
  })
})
