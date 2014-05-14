var shell = require("./shell")
, thr = require('super-stream.through').obj
;
/**
 * @param {String} filename - filename to run mocha against.
 * @returns {Function} - A gulp task
 */
;
module.exports = function mocha (filename){
  return function(){
    var cmd = './node_modules/mocha/bin/mocha ' +filename+ ' -R spec -t 30000;'
    ;
    shell(cmd)
      .catch(function(err){throw err})
      .then(console.log);
  }
};
