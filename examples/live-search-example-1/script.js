(function(angular) {
 'use strict';
  var myApp = angular.module('LiveSearchExample1App', ['nya.bootstrap.select']);

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
$scope.options2 = [
  {name: 'Alpha', subtitle: 'Alice', group: 'Group1'},
  {name: 'Bravo', subtitle: 'Bob', group: 'Group2'},
  {name: 'Charlie', subtitle: 'Carl', group: 'Group1'},
  {name: 'Golf', subtitle: 'George', group: 'Group1'},
  {name: 'Hotel', subtitle: 'Harry', group: 'Group1'},
  {name: 'Juliet', subtitle: 'Joe', group: 'Group2'},
  {name: 'Kilo', subtitle: 'Kate', group: 'Group2'},
  {name: 'Lima', subtitle: 'Laura', group: 'Group2'}
];
  }]);
})(window.angular);
