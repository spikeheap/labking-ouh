'use strict';

/* @ngInject */
function toastrConfig(toastr) {
  toastr.options.target = '.labking';
  toastr.options.timeOut = 4000;
  toastr.options.positionClass = 'toast-bottom-right';
}

var config = {
  appErrorPrefix: '[labKing Error] ',
  appTitle: 'labKing',
  subjectNoun: 'ParticipantId',
  demographicDataset: 'Database_Enrollment',
  searchFields: ['ParticipantId', 'NHSNumber', 'MRNNumber', 'FirstName', 'LastName']
  // subjectNameFields: ['FirstName', 'LastName'],
  // headlineSubjectInfoFields: ['ParticipantId', 'NHSNumber', 'MRNNumber', 'DOB']
};

/* @ngInject */
function configure() {
  // if ($logProvider.debugEnabled) {
  //   $logProvider.debugEnabled(true);
  // }
  // exceptionHandlerProvider.configure(config.appErrorPrefix);
  // routerHelperProvider.configure({docTitle: config.appTitle + ': '});

  LABKEY.Query.selectRows({
    schemaName: 'labking_ouh',
    queryName: 'preferences',
    success: function (response) {
      response.rows.forEach(function (row) {
        config[row.pref_id] = row.value;
      });
    },
    failure: function (error) {
      console.log('ERROR', error);
    },
  });


}

module.exports = {
  config: config,
  configure: configure,
  toastrConfig: toastrConfig
};
