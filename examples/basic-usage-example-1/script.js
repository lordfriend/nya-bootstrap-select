(function(angular) {
 'use strict';
  var myApp = angular.module('BasicUsageExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.model2 = ['b', 'c'];
  }]);
})(window.angular);
