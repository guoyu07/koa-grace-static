'use strict';

const path = require('path');
const debug = require('debug')('koa-grace:static');
const mount = require('koa-mount');
const koastatic = require('koa-static');

/**
 * 生成路由控制
 * @param {String} prefix url prefix
 * @param {String} dir koa-grace app dir
 * @param {object} vhost vhost config
 * @return {function}       
 */
function _static(prefix, dir, vhost) {

  return function*(next) {

    let curPath = this.path;

    if (curPath.indexOf(prefix) != 0) return yield * next;

    let pathList = curPath.split('/');
    let appPath = pathList[2];
    let staticList = ['js', 'javascript', 'css', 'style', 'img', 'image', 'images', 'swf'];

    if (!appPath) return yield * next;

    let downstream,curDir;
    let staticPath = dir + appPath + prefix;
    if (staticList.indexOf(appPath) > -1 || pathList.length == 3) {
      // staticList.indexOf(appPath) > -1 : http://127.0.0.1:3000/static/js/test.js
      // pathList.length : http://127.0.0.1:3000/static/test.js

      if (!vhost) return yield * next;

      let appName = vhost[this.hostname];
      if (!appName) return yield * next;

      appPath = '/' + appName;
      curDir = curPath.replace(prefix,'');
      downstream = mount(prefix, koastatic(staticPath));
    } else {
      // http://127.0.0.1:3000/static/blog/test.js

      appPath = '/' + appPath;
      curDir = curPath.replace(prefix + appPath,'');
      downstream = mount(prefix + appPath, koastatic(staticPath));
    }

    debug(path.resolve(staticPath + curDir));

    yield * downstream.call(this, function*() {
      yield * next;
    }.call(this));
  }
};

module.exports = _static;
