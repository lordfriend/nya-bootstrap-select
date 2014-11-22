(function(angular) {
 'use strict';
  var myApp = angular.module('AlternativeDisplayExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.options = [
  {name: 'apple', title: 'c1: apple'},
  {name: 'orange', title: 'c2: orange'},
  {name: 'berry', title: 'c3: berry'}
];
$scope.model2 = {name: 'berry', title: 'c3: berry'};
  }]);
})(window.angular);
