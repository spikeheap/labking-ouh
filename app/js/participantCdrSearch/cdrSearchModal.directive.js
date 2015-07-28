'use strict';

module.exports = CdrSearchModal;

/** @ngInject **/
function CdrSearchModal(config) {
  return {
    template: require('./cdrSearchModal.directive.html'),
    controllerAs: 'vm',
    bindToController: true,

    /** @ngInject **/
    controller: function($modal) {
      var self = this;
    }
  };
}
