'use strict';

var angular = require('angular');

// require('../../bower_components/angular-i18n/en-gb');
require('labking');

angular
  .module('labking.ouh', [
    require('./core/core.module.js'),
    require('./layout/layout.module.js'),
    require('./participantCdrSearch/participantCdrSearch.module.js'),
    'labking',
    'labking.participantFilter'
  ]);
