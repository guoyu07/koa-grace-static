## koa-grace-static

KOA-grace静态文件server中间件

### Install

    $ npm install koa-grace-static --save

### Usage

```
_static(prefix, option)
```
- prefix: {String} url prefix.
- option: {Object} 配置项 dir:文件根目录，maxage:头信息中的maxage

**app.js**

```
var koa = require('koa');
var _static = require('..');

var app = koa();

// http://127.0.0.1:3000/static/blog/test.js
// http://127.0.0.1:3000/static/test.js
app.use(_static(['/static/**/*','/*/static/**/*'], {
    dir: './example/', 
    maxage: 60 * 60 * 1000
}));

app.listen(3000, function() {
  console.log('Listening on 3000!');
});
```

### Test

    npm test

### License

MIT