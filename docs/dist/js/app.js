'use strict';

angular.module('filters', [])
  .filter('camelCase', function(){
    return function(input) {
      var words = input.split('-');
      return words.map(function(value){
        return value.charAt(0).toUpperCase() + value.slice(1);
      }).join(' ');
    }
  });

angular.module('controllers', [])
  .controller('MainCtrl', function($scope, pages, $filter){
    $scope.articles = [];
    angular.forEach(pages, function(stateName){
      $scope.articles.push({
        state: stateName,
        title: $filter('camelCase')(stateName)
      });
    });
  })
  .controller('ExamplesCtrl', function($scope, pages, $filter){
    $scope.articles = [];
    angular.forEach(pages, function(stateName){
      $scope.articles.push({
        state: stateName,
        title: $filter('camelCase')(stateName)
      });
    });
  });


angular.module('docApp', ['ui.router', 'nya.bootstrap.select', 'filters', 'controllers'])
  .config(function($stateProvider, $urlRouterProvider){

    var pages = {
      main: [
        'getting-started',
        'migrate-instructions'
      ],
      examples: [
        'basic-usage',
        'groups-and-more',
        'form-control-feature',
        'layout-and-styles'
      ]
      //api: [
      //
      //]
    };

    $urlRouterProvider
      .when('/main', '/main/'+ pages.main[0]);

    angular.forEach(pages, function(children, stateName){
      $stateProvider.state(stateName, {
        templateUrl: 'partials/' + stateName + '.html',
        controller: capitalize(stateName) + 'Ctrl',
        url: '/' + stateName,
        resolve: {
          pages: function() {
            return children;
          }
        }
      });

      angular.forEach(children, function(childState) {
        console.log('partials/' + stateName + '/' + childState + '.html');
        $stateProvider.state(childState, {
          templateUrl: 'partials/' + stateName + '/' + childState + '.html',
          url: '/' + childState,
          parent: stateName
        });
      });
    });

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

  });
