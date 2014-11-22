(function(angular) {
 'use strict';
  var myApp = angular.module('GettingStartedExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
    $scope.options = [
    'Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo'
  ];
  }]);
})(window.angular);
