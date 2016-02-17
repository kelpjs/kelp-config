var path   = require('path');
var should = require('should');

describe('default config', function () {
  it('default', function () {
    require('..').name.should.be.exactly('config/default');
    delete require.cache[path.join(__dirname, '../index.js')];
  });
  it('production', function () {
    process.env.NODE_ENV = 'production';
    require('..').name.should.be.exactly('config/production');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('test', function () {
    process.env.NODE_ENV = 'test';
    require('..').name.should.be.exactly('config/test');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('CONFIG_DIR', function () {
    process.env.NODE_ENV = 'test';
    process.env.CONFIG_DIR = path.join(__dirname, 'config2');
    require('..').name.should.be.exactly('config2/test');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
    delete process.env.CONFIG_DIR;
  });
});
