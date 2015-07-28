'use strict';
require('ui.router');
require('toastr.tpls');

var config = require('./config');

var moduleName = 'ouh.labking.core';

require('angular')
  .module(moduleName, [
      'ui.router',
      'toastr'
  ])
  .value('config', config.config)
  // .config(config.configure)
  //.config(config.toastrConfig)
;

module.exports = moduleName;
