var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
var assert = chai.assert;

//configure chai
chai.use(spies);


describe('hey buddy, ', function() {
  it('2+2 should equal 4, you know?', function() {
    expect(2+2).to.equal(4);
  })
})

describe('setTimeout', () => {
  it('takes about 1000 milliseconds', (done) => {
    var start = new Date();
    setTimeout(() => {
      var end = new Date() - start;
      expect(end).to.be.below(1010)
                 .and.to.be.above(990);
      done();
  }, 1000);
  })
})



describe('testing Chai spies', () => {

  var spyable = function(){};
  spyable = chai.spy(spyable);

  it('is a spy', () => expect(spyable).to.be.spy)

  it('spyable is spyable', (done) => {

    var spyableArray = [1, 2, 234982739487239487239487];
    var forEachSpy = chai.spy.on(spyableArray, 'forEach');

    spyableArray.forEach( spyable );

    expect(spyable).to.have.been.called.exactly(3);
    done();

  })
})
