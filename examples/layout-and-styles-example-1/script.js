(function(angular) {
 'use strict';
  var myApp = angular.module('LayoutAndStylesExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.options = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Golf',
  'Hotel',
  'Juliet',
  'Kilo',
  'Lima'
];
  }]);
})(window.angular);
