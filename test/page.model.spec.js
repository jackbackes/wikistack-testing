var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
var assert = chai.assert;


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
      it('errors without title')
      it('errors without content');
      it('errors if given invalid status field');
    })

    describe('methods', ()=> {
      describe('findByTag', ()=> {
        it('is a class method');
        it('finds all pages that match an array of tags')
        it('does not find pages that do not match the array of tags');
      })
      describe('findSimilar', ()=> {
        it('is available as an instance method');
        it('finds all pages that overlap tags of the root page');
        it('does not find pages that do not overlap tags of the root page');
      })
    })
    describe('virtuals', () => {

      var snakePage;
      beforeEach(function() {
        var body = {
          title: "Snakes!",
          //urlTitle: "Snakes",
          content: "Ssssssscary stuff",
          status: "open",
          tags: ["Rattle", "Snake", "Slither", "Copperhead"]
        }
        snakePage = Page.create(body);
      })

      describe('route', () => {
        it('is a getter method');
        it('returns a correctly formatted url')
      })
      describe('renderedContent', ()=> {
        it('is a getter method');
        it('returns content marked up as HTML')
      });
    })
    describe('hooks', () => {
      it('sets urlTitle based on title BEFORE validating');
    })
  })
})
