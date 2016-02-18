'use strict';
const fs      = require('fs');
const path    = require('path');
const extend  = require('extend');
const resolve = require('resolve');

const dir = process.env.CONFIG_DIR || 'config';
const env = process.env.NODE_ENV   || 'development';
/**
 * [load description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function load(name){
  var filename = '';
  try{
    filename = resolve.sync(name, {
      moduleDirectory : dir,
      basedir         : process.cwd(),
      extensions      : ['.js', '.json', '.node', '.yaml', '.yml'],
    });
  }catch(e){}
  if(filename){
    // yaml loader
    if(/\.ya?ml$/.test(filename)){
      try{
        return require('js-yaml').safeLoad(fs.readFileSync(filename, 'utf8'));
      }catch(e){
        console.error('\x1b[31m[kelp-config] `js-yaml` is required when you use yaml files .\x1b[0m');
      }
    }else{
      // js, json, and otherwise .
      try{
        return require(filename);
      }catch(e){
        console.error('\x1b[31m[kelp-config] Cannot read config from %s\x1b[0m', filename);
      }
    }
  }
  return {};
}
/**
 * [slice description]
 * @param  {[type]} 2 [description]
 * @return {[type]}   [description]
 */
var argv = {};
if(process.argv.length > 2){
  try{
    argv = require('minimist')(process.argv.slice(2));
    delete argv[ '_' ];
  }catch(e){
    console.error('\x1b[31m[kelp-config] `minimist` is required when you use command-line arguments .\x1b[0m');
  }
}
/**
 * [merge description]
 */
module.exports = extend(true,
  load('default'),
  load(env),
  argv
);
