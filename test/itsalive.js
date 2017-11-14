// // console.log("JOKE GOES HERE")

// //var expect = require('chai').expect;
// var {expect} = require('chai');
// var spies = require('chai-spies');
// var chai = require('chai');

// chai.use(spies);

// describe('Testing suite capabilities', function () {
//   it('confirms basic arithmetic', function () {
//     expect(2+2).to.equal(4);
//   });
// });

// describe('settimeout', function(){
//     it('checks time passage', function (done) {
//         var start = new Date();
//         setTimeout(function () {
//           var duration = new Date() - start;
//           expect(duration).to.be.closeTo(1000, 50);
//           done();
//         }, 1000);
//       });

// }
// );


// describe('spy practice', function(){

// it('will invoke a function once per element', function () {
//     var arr = ['x','y','z'];
//     function logNth (val, idx) {
//       console.log('Logging elem #'+idx+':', val);
//     }
//     logNth = chai.spy(logNth);
//     arr.forEach(logNth);
//     expect(logNth).to.have.been.called.exactly(arr.length);
//   });

// });