'use strict';

require('angular')
  .module('ouh.labking.participantCdrSearch', [])
  .directive('cdrSearchModal', require('./cdrSearchModal.directive'))
  .directive('cdrSearchButton', require('./cdrSearchButton.directive'))
  ;

module.exports = 'ouh.labking.participantCdrSearch';
