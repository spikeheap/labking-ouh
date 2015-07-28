'use strict';

require('angular')
  .module('ouh.labking.layout', ['labking.participantFilter'])
  .directive('ouhParticipantEditor', require('./participantEditor.directive'))
  ;

module.exports = 'ouh.labking.layout';
