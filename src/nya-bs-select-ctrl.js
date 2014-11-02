
nyaBsSelect.controller('nyaBsSelectCtrl', function(){

  var self = this;

  // keyIdentifier and valueIdentifier are set by nyaBsOption directive
  // used by nyaBsSelect directive to retrieve key and value from each nyaBsOption's child scope.
  self.keyIdentifier = null;
  self.valueIdentifier = null;

  self.isMultiple = false;

  // Should be override by nyaBsSelect directive and called by nyaBsOption directive when collection is changed.
  self.onCollectionChange = function(){};

  // for debug
  self.setId = function(id) {
    self.id = id || 'id#' + Math.floor(Math.random() * 10000);
  };

});