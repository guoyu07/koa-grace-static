'use strict';

const path = require('path');
const debug = require('debug')('koa-grace:static');
const mount = require('koa-mount');
const koastatic = require('koa-static');

/**
 * 生成路由控制
 * @param {String} prefix url prefix
 * @param {Object} options 配置项
 * @param {String} options.dir koa-grace app dir
 * @param {object} options.vhost options.vhost config
 * @param {object} options.maxage options.maxage config
 * @return {function}       
 */
function _static(prefix, options) {

  return function*(next) {

    let curPath = this.path;

    if (curPath.indexOf(prefix) != 0) return yield * next;

    let pathList = curPath.split('/');
    let appPath = pathList[2];
    let staticList = ['js', 'javascript', 'css', 'style', 'img', 'image', 'images', 'swf'];

    if (!appPath) return yield * next;

    let downstream, curDir, staticPath;
    if (staticList.indexOf(appPath) > -1 || pathList.length == 3) {
      // staticList.indexOf(appPath) > -1 : http://127.0.0.1:3000/static/js/test.js
      // pathList.length : http://127.0.0.1:3000/static/test.js

      if (!options.vhost) return yield * next;

      let appName = options.vhost[this.hostname];
      if (!appName) return yield * next;

      appPath = '/' + appName;
      staticPath = options.dir + appPath + prefix;
      downstream = mount(prefix, koastatic(staticPath, { maxage: options.maxage }));

      curDir = curPath.replace(prefix, '');
    } else {
      // http://127.0.0.1:3000/static/blog/test.js
      staticPath = options.dir + appPath + prefix;
      appPath = '/' + appPath;
      downstream = mount(prefix + appPath, koastatic(staticPath, { maxage: options.maxage }));

      curDir = curPath.replace(prefix + appPath, '');
    }

    debug(path.resolve(staticPath + curDir));

    yield * downstream.call(this, function*() {
      yield * next;
    }.call(this));
  }
};

module.exports = _static;
