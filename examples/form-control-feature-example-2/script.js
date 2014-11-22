(function(angular) {
 'use strict';
  var myApp = angular.module('FormControlFeatureExample2App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
    $scope.options = [
    'Alpha',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Fox',
    'Golf'
  ];
  }]);
})(window.angular);
