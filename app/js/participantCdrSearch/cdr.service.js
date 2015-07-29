'use strict';

var _ = require('lodash');

class CDRService {

  /** @ngInject **/
  constructor($http, $q, $timeout)  {
    console.log("got this far!")
    this.$http = $http;
    this.$q = $q;
    this.$timeout = $timeout;
  }

  search(searchParams) {
    var deferred = this.$q.defer();
    this.$timeout(function () {
      deferred.resolve([{name: 'john'}]);
    }, 1000)
    return deferred.promise;
  }
}

module.exports = CDRService;
