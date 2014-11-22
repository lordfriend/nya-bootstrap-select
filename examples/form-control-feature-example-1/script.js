(function(angular) {
 'use strict';
  var myApp = angular.module('FormControlFeatureExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.disable = false;
$scope.options = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Golf',
  'Hotel'
];
  }]);
})(window.angular);
