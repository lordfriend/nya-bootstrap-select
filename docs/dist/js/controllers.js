'use strict';

angular.module('docApp')
  //.controller('NavbarCtrl', function($scope, $location) {
  //  $scope.$location = $location;
  //})
  .controller('MainCtrl', function($scope, pages, $filter){
    $scope.articles = [];
    angular.forEach(pages, function(stateName){
      $scope.articles.push({
        state: stateName,
        title: $filter('camelCase')(stateName)
      });
    });

    $scope.options = [
      'Alpha', 'Bravo', 'Charlie', 'Delta',
      'Echo'
    ]

  });
