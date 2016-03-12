## koa-grace-static

KOA-grace静态文件server中间件

### Install

    $ npm install koa-grace-static --save

### Usage

```
_static(prefix, dir)
```
- prefix: {String} url prefix.
- dir: {String} koa-grace app dir

**app.js**

```
var koa = require('koa');
var _static = require('koa-grace-static');

var app = koa();

// http://127.0.0.1:3000/static/blog/test.js
app.use(_static('/static', './example'));

app.listen(3000, function() {
  console.log('Listening on 3000!');
});
```

### Test

    npm test

### License

MIT