(function(angular) {
 'use strict';
  var myApp = angular.module('LayoutAndStylesExample2App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.staticModel2 = 'a';
  }]);
})(window.angular);
