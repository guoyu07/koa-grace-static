var koa = require('koa');
var _static = require('..');

var app = koa();

// http://127.0.0.1:3000/static/blog/test.js
app.use(_static('/static', './example'));

app.listen(3000, function() {
  console.log('Listening on 3000!');
});