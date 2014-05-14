var shell = require("./shell")
, thr = require('super-stream.through').obj
;
/**
 * @param {String} filename - filename to run istanbul against.
 * @returns {Function} - A gulp task
 */
module.exports = function istanbul (filename){
  return function(){
    var cmd = './node_modules/istanbul/lib/cli.js cover --report html ./node_modules/mocha/bin/_mocha -- ' +filename+ ' -R spec -t 10000'
    ;
    shell(cmd)
      .catch(function(err){throw err})
      .then(console.log);
  }
};
