'use strict';

module.exports = CdrSearchButton;

/** @ngInject **/
function CdrSearchButton(config) {
  return {
    scope: {},
    template: require('./cdrSearchButton.directive.html'),
    controllerAs: 'vm',
    bindToController: true,

    /** @ngInject **/
    controller: function($modal, $scope) {
      var self = this;
      var modalInstance;

      var modalScope = $scope.$new();
      modalScope.ok = function () {
        modalInstance.close();
      };
      modalScope.cancel = function () {
        modalInstance.dismiss('cancel');
      };

      self.openModal = function() {
        modalInstance = $modal.open({
            animation: true,
            scope: modalScope,
            template: '<cdr-search-modal></cdr-search-modal>',
          });
      }
    }
  };
}
