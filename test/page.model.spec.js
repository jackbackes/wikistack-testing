global.NODE_ENV = 'test';
var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
var assert = chai.assert;
var models = require('../models');
var Page = models.Page;
var marked = require('marked');



//configure chai
chai.use(spies);


describe('Models', ()=> {
  describe('Page', () => {

    it('is an instance of Sequelize')

    describe('attributes', ()=> {
      it('has a required title STRING')
      it('has a require urlTitle STRING')
      it('has a require content field TEXT')
      it('has a status field ENUM')
      it('has a date field DATE')
      it('has an array of tags ARRAY')
    })
    describe('validations', ()=> {

      var rhinoPage;
      beforeEach(function(){
        rhinoPage = Page.build({
          tags: ['rhinos4eva']
        })
      })
      afterEach(function(done){
        Page.findByTag('rhinos4eva').then( result => {
          result.forEach( curr => curr.destroy() )
          done();
        })
      })

      it('errors without title, urlTitle, and/or content', function(done) {
        var rhinoError;
        rhinoPage.validate().then(function(rhinoError){
          expect(rhinoError).to.be.instanceOf(Error);
          expect(rhinoError.errors).to.have.lengthOf(3);
          expect(rhinoError.errors[0].path).to.equal('title');
          expect(rhinoError.errors[1].path).to.equal('urlTitle');
          expect(rhinoError.errors[2].path).to.equal('content');
          done();
        }).catch(done);

      })

    })

    describe('methods', ()=> {
      var giraffePage, test, giraffeTester;
      describe('findByTag', ()=> {
        beforeEach(function(done){
          var page1 = Page.create({
            title: "African Giraffes",
            content: "The African Giraffe has a _really_ long neck.",
            status: "closed",
            tags: ["neck", "giraffe", "mammal", "africa", "istest1234"]
          });
          var page2 = Page.create({
            title: "Asian Giraffes",
            content: "The Asian Giraffe has a really **short** neck.",
            status: "closed",
            tags: ["neck", "giraffe", "mammal", "asiatest", "istest1234"]
          });
          // giraffePage.save();
          giraffeTester = function(test){
            return giraffePage.then( function(result) {
              console.log(result);
              test(result);
            });
          }
          Promise.all([page1, page2]).then(function(){
            done()
          });
        });
        afterEach(function(done){
          Page.findByTag("istest1234").then(function(pages){
            if( !pages ) throw 'no pages found';
            console.log('test pages:',pages.length);
            pages.forEach( curr => curr.destroy() );
            console.log('destroyed test pages');
            done();
          }).catch(done);
        });
        it('is a class method', function(done){
          expect(Page.findByTag).to.exist;
          expect(Page.findByTag).to.be.a('function');
          done();
        });
        it('finds all pages that match one tag', function(done){
          var test1 = Page.findByTag("istest1234");
          var test2 = Page.findByTag("asiatest");
          Promise.all([test1, test2]).then( function(results) {
            expect(results[0]).to.have.lengthOf(2);
            expect(results[1]).to.have.lengthOf(1);
            expect(results[3]).not.to.exist;
            expect(results[0]).not.to.have.lengthOf(23948293847);
            done();
          }).catch(done);
          // console.log(result);

        })
        // it('finds all pages that match an array of tags')
        it('does not find pages that do not match the array of tags');
      })
      describe('findSimilar', ()=> {
        var hearmonkey, seemonkey, domonkey, testmonkey;
        beforeEach(function(done){
          hearmonkey = Page.create({
            title: "Hearing of Monkeys",
            content: "Monkeys have **great** hearing!",
            status: "closed",
            tags: ['monkey33333', 'auditory system33333', 'hearing33333', 'mammal33333', 'test33333']
          })
          seemonkey = Page.create({
            title: "Vision of Monkeys",
            content: "Monkeys have **great** vision!",
            status: "closed",
            tags: ['monkey33333', 'vision33333', 'mammal33333', 'test33333']
          })
          domonkey = Page.create({
            title: "Executive Function of Monkeys",
            content: "Monkeys have **terrible** executive function!",
            status: "closed",
            tags: ['monkey33333', 'executive function33333', 'action33333', 'mammal33333', 'test33333']
          });
          Promise.all([hearmonkey, seemonkey, domonkey]).then(function(){
            testmonkey = Page.findOne({
              where: {
                title: "Executive Function of Monkeys"
              }
            })
            testmonkey.then(function(){
              done();
            })
          })
        })
        afterEach(function(done){
          Page.findByTag('test33333').then( result => {
            result.forEach( curr => curr.destroy() )
            done();
          })
        })
        it('is available as an instance method', function(done){
          expect(Page.findByTag).to.exist;
          expect(Page.findByTag).to.be.a('function');
          done();
        });
        it('finds all pages that overlap tags of the root page', function(done){
          testmonkey.then(function( theTestMonkey ){
            theTestMonkey
              .findSimilar()
              .then(function(similarPages){
                expect(similarPages.length).to.equal(2);
                done();
              })
          }).catch(done);
        });
        it('does not find pages that do not overlap tags of the root page', function(done){
          testmonkey.then(function( theTestMonkey ){
            theTestMonkey
              .findSimilar()
              .then(function(similarPages){
                expect(similarPages.length).not.to.equal(234);
                done();
              })
          }).catch(done);
        });
      })
    })
    describe('virtuals', () => {

      var snakePage;
      var snakeTester;
      var test;
      beforeEach(function() {
        var body = {
          title: "Snakes!",
          //urlTitle: "Snakes",
          content: "Ssssssscary **stuff**",
          status: "open",
          tags: ["Rattle", "Snake", "Slither", "Copperhead", "istest1234"]
        }
        snakePage = Page.create(body);
        // snakeTester = function(test){
        //   return snakePage.then( function(result) {
        //     console.log(result);
        //     test(result);
        //   });
        // }

      })

      describe('route', function() {

        it('is a getter method', function(){
          snakePage.then(function(result) {
            expect(result.$modelOptions.getterMethods.route).to.exist;
            expect(result.$modelOptions.getterMethods.route).to.be.a('function');
            expect(result.$modelOptions.getterMethods.route).not.to.be.a('string');
            expect(result.$modelOptions.getterMethods.routeoijweofijweoifj).not.to.exist;
          })
        });

        it('returns a correctly formatted url', function(done){
          snakePage.then(function(result) {
            // console.log(result);
            expect(result.route).to.equal('/wiki/Snakes');
            expect(result.route).to.be.a('string');
            expect(result.route).to.equal('/wiki/' + result.urlTitle)
            done();
          })
        })

        it('does not return an incorrectly formatted url', function(done){
          snakePage.then(result => {
            // console.log(result);
            expect(result.route).not.to.equal('/wiki/Snakesijwifjowiejfowijefoiwejf');
            expect(result.route).to.be.a('string');
            done();
          })
        })
      })
      describe('renderedContent', function() {
        it('is a getter method', function(done){
          snakePage.then((result)=>{
            expect(result.$modelOptions.getterMethods.renderedContent).to.exist;
            expect(result.$modelOptions.getterMethods.renderedContent).to.be.a('function');
            expect(result.$modelOptions.getterMethods.renderedContent).not.to.be.a('string');
            expect(result.$modelOptions.getterMethods.renderedContentoiwjefoiwjefo).not.to.exist;
            done();
          })
        });
        it('returns content marked up as HTML', function(done){
          snakePage.then((result)=>{
            console.log(marked(result.content));
            expect(result.renderedContent).to.equal('<p>Ssssssscary <strong>stuff</strong></p>\n');
            expect(result.renderedContent).not.to.equal('Ssssssscary **stuff**');
            done();
          })
        })
      });
    })
    describe('hooks', () => {

      var lionPage;
      beforeEach(function(){
        lionPage = Page.build({
          title: "The Majestic Lion",
          content: "Coming to your local zoo!",
          status: "closed",
          tags: ['lions4eva273465827356']
        })
      })
      afterEach(function(done){
        Page.findByTag('lions4eva273465827356').then( result => {
          result.forEach( curr => curr.destroy() )
          done();
        })
      })

      it('sets urlTitle based on title BEFORE validating', function(done) {
        expect(lionPage.urlTitle, 'before validate').not.to.exist;
        Page.addHook('afterValidate', 'lionTest', function() {
          expect(lionPage.urlTitle, 'after validate').to.exist;
        })
        lionPage.save().then(function(result){
          done();
        });

      })
    })
  })
})
