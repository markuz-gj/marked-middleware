
var path = require('path') 
, writeFile = require('fs').writeFile
, readFile = require('fs').readFile
, readFileSync = require('fs').readFileSync
, getStat = require('fs').stat

, Promise = require('es6-promise').Promise
, request = require('request')

, highlight = require('pygmentize-bundled')
, compile = require('marked')
, ejs = require('ejs')

, SRC = path.join(__dirname, './assets/github.css')
, TEMPLATE = readFileSync(path.join(__dirname, './assets/index.html'), 'utf8')
, URL = require(path.join(__dirname,'./package.json')).repository.url.replace(/.git$/, '').replace(/^git/, 'https')
, compileOpts 
;

compileOpts = {
  gfm: true,
  pedantic: false,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function(code, lang, done){
    highlight({lang: lang, format: 'html'}, code, done)
  }
}

/**
 * @private
 * @param  {Error} err
 * @return {undefined}
 */
function errorHandler (err) {
  if (err && (err.code !== 'ETIMEDOUT')) { throw err }
}

/**
 * A promise wrapper arount `request`. It timeout the request after 10 sec
 * @private
 * @param  {String} url
 * @return {Promise} - resolve {String} with the request's body. Could be an `html` or `css`. 
 */
function getUrl (url) {
  var opt = {
    url: url
  , timeout: 10000 // 10 seconds
  }
  ;
  return new Promise(function(resolve, reject){
    request(opt, function(err, res, body){
      if (err) { return reject(err); }
      resolve(body)
    });
  });
}

/**
 *  Requests all css in parallel
 * @private
 * @return {Promise} - It passes an {Array<String>} in the right order to be concat.
 */
function requestCss () {
  return getUrl(URL).then(function(body){
    var re = /href=["']([^"']+\.css)/g
    , match = body.match(re)
    , cache = []
    ;

    for (var i = 0; i < match.length; i++) {
      cache.push(getUrl(match[i].replace(/href=["']/, '')));
      if (i === match.length - 1){
        // this garantee all css will be in the right order
        return Promise.all(cache);
      }
    }; 
  });
}

/**
 * @private
 * @return {Promise} - passes a {String|undefined} to the next `then`
 */
function writeCss () {
  return requestCss().then(function(array){
    var str = array.join(';\n\n')
    if (str) {
      writeFile(SRC, str, errorHandler);
    }
    return str
  }).catch(errorHandler)
}

/**
 * @private
 * @return {Promise} - resolve to `true` is local `github.css` is older than 5 day. Otherwise resolve to false
 */
function checkTime () {
  var day = 86400*1000 // number of milisec in a day
  ;
  return new Promise(function(resolve, reject){
    getStat(SRC, function(err, stats){
      if (err) {return reject(err);}
      if ((Date.now() - stats.mtime) > (5*day)){
        return resolve(true)
      }
      else {
        return resolve(false)
      }

    });
  });
}

/**
 * Read local github's css
 * @private
 * @return {Promise} - resolves to a {String} with the local github's css
 */
function readCss () {
  return new Promise(function(resolve, reject){
    readFile(SRC, {encoding: 'utf8'}, function(err, str){
      if (err) { return reject(err); }
      resolve(str)
    });
  });
}


/**
 * It gets the css local or remote.
 * @private
 * @return {Promise} - it passes {String} with github's css to the next `then`.
 */
function getCss () {
  return checkTime().then(function(isOld){
    if (isOld){ return writeCss().then(function(str){
      if (!str) { return readCss(); }
      return str
    }); }
    return readCss()
  })
}

/**
 * Checking if its being caled from the command line.
 * If it is, just update the local github.csss
 * The point behind this is to run the script as a pre-install hook on npm.
 * And in this a user will have the most recent css. if the op timeout, the repos css will be used instead.
 */
if (require.main === module){
  console.log('fetching newer github css ...')
  writeCss().then()
  return
}

// pre-fetchin github's css
getCss().then()

module.exports = function(opts){
  var dir = path.resolve(opts.directory)

  return function(req, res, next) {
    var file = req.url

    if (!(/\.m(?:d|arkdown)$/i).test(file)) return next()

    file = path.join(dir, file)

    readFile(file, 'utf8', function(e, md){
      if (e) return next(e)

      compile(md, compileOpts, function(e, html){
        getCss().then(function(str){
          res.end(ejs.render(TEMPLATE, {
            css: [str],
            markdown: html,
            title: path.relative(dir, file)
          }))

        });

      })
    })
  }
}

