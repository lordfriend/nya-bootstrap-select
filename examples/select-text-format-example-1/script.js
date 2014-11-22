(function(angular) {
 'use strict';
  var myApp = angular.module('SelectTextFormatExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.options1 = [
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
