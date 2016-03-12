'use strict';

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
function _static(prefix, dir, vhost){
  
  return function *(next){

    let path = this.path;

    if(path.indexOf(prefix) != 0) return yield* next;

    let pathList = path.split('/'); 
    let appPath = pathList[2];
    let staticList = ['js','javascript','css','style','img','image','images','swf'];
    
    if(!appPath) return yield* next;

    let downstream;
    if(staticList.indexOf(appPath) > -1 || pathList.length == 3){
      // http://127.0.0.1:3000/static/test.js
      // http://127.0.0.1:3000/static/js/test.js
      
      if(!vhost) return yield* next;

      let appName = vhost[this.hostname];
      if(!appName) return yield* next;

      appPath = '/' + appName;
      downstream = mount(prefix , koastatic(dir + appPath + prefix));
    }else{
      // http://127.0.0.1:3000/static/blog/test.js
      
      appPath = '/' + appPath;
      downstream = mount(prefix + appPath , koastatic(dir + appPath + prefix));
    }

    yield* downstream.call(this, function *(){
      yield* next;
    }.call(this));
  }
};

module.exports = _static;