'use strict';
const fs      = require('fs');
const path    = require('path');
const resolve = require('resolve');
const extend  = require('extend');

const dir = process.env.CONFIG_DIR || 'config';
const env = process.env.NODE_ENV   || 'development';
/**
 * [load description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function load(name){
  try{
    var filename = resolve.sync(name, {
      moduleDirectory : dir,
      basedir         : process.cwd(),
      extensions      : ['.js', '.json', '.node', '.yaml', '.yml'],
    });
    if(/\.ya?ml$/.test(filename)){
      return require('js-yaml').safeLoad(fs.readFileSync(filename, 'utf8'));
    }
    return require(filename);
  }catch(e){
    return {};
  }
}
/**
 * [merge description]
 */
module.exports = extend(true,
  load('default'),
  load(env)
);
