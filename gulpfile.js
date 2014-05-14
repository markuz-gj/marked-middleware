var gulp = require("gulp")
, gutil = require("gulp-util")
, thr = require("super-stream.through")

, etc = require('./etc')

, SRC = './index.js'
, SPEC = './spec.js'
, FIXTURE = './fixture.js'
, ETC = './etc/*.js'

, log = gutil.log
;

gulp.task("test:mocha", etc.mocha(SPEC));
gulp.task("test:istanbul", etc.istanbul(SPEC));
gulp.task("test", ["test:istanbul"]);

if (process.argv.slice(-1)[0] === 'watch') {
  gulp.task("server", ["test"], etc.server({port: 4001}));
}

gulp.task("watch", ["server"], function(done){
  gulp.watch([__filename, ETC], etc.exit);
  gulp.watch([SRC, SPEC, FIXTURE], function(evt){
    gulp.start('test')
  });
});

gulp.task("default", ["test"]);
