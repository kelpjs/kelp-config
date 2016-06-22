'use strict';
const fs      = require('fs');
const path    = require('path');
const extend  = require('extend');
const resolve = require('resolve');
const pkg     = require('./package');

const dir = process.env.CONFIG_DIR || 'config';
const env = process.env.NODE_ENV   || 'development';

/**
 * [print message]
 * @param  {[type]} msg [message]
 */
function print(msg){
  console.error('\x1b[31m[%s] %s\x1b[0m', pkg.name, msg);
};

/**
 * load config
 * @param  {[type]} name [env filename]
 * @return {[type]}      [config]
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
    if(/\.ya?ml$/.test(filename)){ // yaml loader
      var content = fs.readFileSync(filename, 'utf8');
      try{
        return require('js-yaml').safeLoad(content);
      }catch(e){
        print('`js-yaml` is required when you use yaml files .');
      }
    }else{ // js, json, and otherwise .
      try{
        return require(filename);
      }catch(e){
        print('cannot read config from: ' + filename);
      }
    }
  }
  return {};
};

/**
 * [command-line arguments supports]
 */
var argv = {};
if(process.argv.length > 2){
  try{
    argv = require('minimist')(process.argv.slice(2));
    delete argv[ '_' ];
  }catch(e){
    print('`minimist` is required when you use command-line arguments .');
  }
};

/**
 * [merge config]
 */
module.exports = extend(true,
  load('default'),
  load(env),
  argv
);
