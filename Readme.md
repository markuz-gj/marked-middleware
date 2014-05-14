
# markdown-middleware

  middleware
  for
  serving
  markdown
  files
  as
  rendered
  HTML.
  It makes an effort to render a closely as possible to the style of github but stops short of actually using githubs API to keep performance snappy.

## Installation

	$ npm install markdown-middleware --save

then in your app:

```js
var markdown = require('markdown-middleware')
```

## Usage

just make sure you `use` it before static or similar middleware

```js
app.use(markdown({
  // files will be looked for relative to
  // to this path
  directory: __dirname + '/public'
}))
```

#### For those contributing
before anything, just install the dependecies ...

```bash
$ npm install
```

#### Running the mocha tests

```bash
$ ./node_module/.bin/gulp test:mocha
```

#### Running the istanbul coverage

```bash
$ ./node_module/.bin/gulp test:istanbul
```

#### auto reloading watching
point your browser to `localhost:3001/coverage` for auto-reloaded coverage page :)

```bash
$ npm install
$ ./node_module/.bin/gulp watch
```