var chai = require("chai")
, sinon = require("sinon")
, expect = chai.expect
, middleware = require('index')

, shell = require('./etc/shell')
;

chai.use(require('sinon-chai'));
chai.config.showDiff = false;

// describe("command line mode:", function(){
//   it('must print `fetching newer github css ...`', function(done){
//     shell('node ./index.js').then(function(s){
//       // removing trailing \n
//       var str = s.split('\n')[0]
//       expect(str).to.be.equal('fetching newer github css ...')
//       done()
//     }).catch(done)
//   })
// })


  // return function() {
  //   var firstLoad = true;
  //   gulp.watch(glob, function(evt) {
  //     lrUp.then(function() {
  //       gulp.src(evt.path).pipe(livereload(serverLR));
  //       if (firstLoad){
  //         // sleeping, to give time to tiny-lr to do its stuff
  //         shell('sleep 1 && touch ./coverage/index.html && echo "a"')
  //         firstLoad = false;
  //         return
  //       }
  //       log('LR: reloading....');
  //     });
  //   });
  // };




describe("exported value:", function(){


  it('must be a function', function(done){
    expect(middleware).to.be.an.instanceof(Function);
    var res, req 
    ;
    res = {
      end: function(str){
        console.log(str.slice(-2000,-1))
        done()
      }
    }

    req = {
      url: '/etc/test.md'
    } 

    middleware({directory: '.'})(req, res, done, done)
  });


  // <link href="https://assets-cdn.github.com/assets/github-fe51e3003c127b37f05de5650598800084218b4d.css" media="all" rel="stylesheet" type="text/css" />
  // <link href="https://assets-cdn.github.com/assets/github2-1b52c8327d73b3850ef82cf70fff8f961230bebe.css" media="all" rel="stylesheet" type="text/css" />


});
