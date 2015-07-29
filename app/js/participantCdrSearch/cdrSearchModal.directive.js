'use strict';

var _ = require('lodash');

module.exports = CdrSearchModal;

/** @ngInject **/
function CdrSearchModal(config) {
  return {
    template: require('./cdrSearchModal.directive.html'),
    controllerAs: 'vm',
    bindToController: true,

    /** @ngInject **/
    controller: function($modal, CDRService) {
      var self = this;

      self.FORM_STEPS = {
        ENTRY: 'entry',
        LOADING: 'loading',
        RESULTS: 'results'
      };

      self.formFields = [
        {
          name: 'nhsnumber',
          label: 'NHS Number',
          placeholder: 'NHS Number'
        },{
          name: 'mrnnumber',
          label: 'MRN Number',
          placeholder: 'MRN Number'
        },{
          name: 'name',
          label: 'Name',
          placeholder: 'Name'
        },
      ];

      self.searchResultFields = [
        'nhsnumber',
        'name'
      ]

      self.search = search;
      self.selectRecord = selectRecord;
      self.getFieldLabel = getFieldLabel;

      init();

      /// private functions ///

      function init () {
        delete self.results;
        self.formStep = self.FORM_STEPS.ENTRY;
      }

      function search(searchParams) {
        self.formStep = self.FORM_STEPS.LOADING;

        CDRService.search(searchParams)
          .then(function (results) {
            self.results = results;
            if(self.results && self.results.length > 0){
              selectRecord(self.results[0]);
            }
            self.formStep = self.FORM_STEPS.RESULTS;
          });
      }

      function selectRecord(record) {
        self.selectedRecord = record;
      }

      function getFieldLabel(fieldName){
        var field = _.find(self.formFields, 'name', fieldName);
        if(field){
          return field.label;
        }
      }


    }
  };
}
