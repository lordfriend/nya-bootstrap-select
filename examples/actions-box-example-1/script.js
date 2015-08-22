(function(angular) {
 'use strict';
  var myApp = angular.module('ActionsBoxExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.arrayCollection = [
  {name: 'Alice', class: 'Class A'},
  {name: 'Bob', class: 'Class B'},
  {name: 'Carl', class: 'Class A'},
  {name: 'Daniel', class: 'Class B'},
  {name: 'Emi', class: 'Class A'},
  {name: 'Flank', class: 'Class B'},
  {name: 'George', class: 'Class C'},
  {name: 'Harry', class: 'Class C'}
];
  }]);
})(window.angular);
