'use strict';

const debug = require('debug')('koa-grace:static');
const mount = require('koa-mount');
const koastatic = require('koa-static');

/**
 * 生成路由控制
 * @param {String} prefix url prefix
 * @param {String} dir koa-grace app dir
 * @return {function}       
 */
function _static(prefix, dir){
  
  return function *(next){

    let path = this.path;

    if(path.indexOf(prefix) != 0) return yield* next;

    let appPath = path.split('/')[2];
    let staticList = ['js','javascript','css','style','img','image','images','swf'];
    
    if(!appPath || staticList.indexOf(appPath) > -1) return yield* next;

    appPath = '/' + appPath;

    let downstream = mount('/static' + appPath , koastatic(dir + appPath + '/static'));

    yield* downstream.call(this, function *(){
      yield* next;
    }.call(this));
  }
};

module.exports = _static;