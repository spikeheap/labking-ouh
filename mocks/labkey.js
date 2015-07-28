console.log("whoo");

(function (window) {
  var LABKEY = window.LABKEY = {
    requiresExt3ClientAPI: requiresExt3ClientAPI,
    Query: {
      selectRows: selectRows,
      insertRows: insertRows,
      updateRows: updateRows
    }
  };

  function requiresExt3ClientAPI(immediate, cb){
    cb();
  }

  function selectRows(options){
    console.log('selectRows', options)
    var responsePacket = {
      columnModel: [],
      metaData: [],
      rows: [],
      rowCount: 0
    }
    options.success(responsePacket);
  }

  function insertRows(options){
    console.log('insertRows', options)
    options.success();
  }

  function updateRows(options){
    console.log('updateRows', options)
    options.success();
  }
})(window);
