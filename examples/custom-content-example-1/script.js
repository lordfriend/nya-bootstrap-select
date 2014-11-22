(function(angular) {
 'use strict';
  var myApp = angular.module('CustomContentExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.options = [
  {name: 'AngularJS', bg: 'label-danger'},
  {name: 'Bootstrap', bg: 'label-primary'},
  {name: 'Foundation', bg: 'label-success'},
  {name: 'Polymer', bg: 'label-warning'}
];
$scope.model1 = {name: 'AngularJS', bg: 'label-danger'};
$scope.options2 = [
  {name: 'Euro Dollar', icon: 'glyphicon-euro'},
  {name: 'US Dollar', icon: 'glyphicon-usd' },
  {name: 'Great Britain Pound', icon: 'glyphicon-gbp'}
];
$scope.model2 = {name: 'US Dollar', icon: 'glyphicon-usd' };
$scope.options3 = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune'
];
$scope.model3 = 'Jupiter';
  }]);
})(window.angular);
