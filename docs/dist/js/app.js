'use strict';

angular.module('docApp', ['ui.router', 'nya.bootstrap.select'])
  .config(function($stateProvider, $urlRouterProvider){

    var pages = {
      main: [
        'getting-started',
        'migrate-instructions'
      ]
      //examples: [
      //
      //],
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

    //$stateProvider.state('main', {
    //  templateUrl: 'partials/main.html',
    //  url: '/main'
    //})
    //  .state('gettingstarted',{
    //    templateUrl: 'partials/main/gettingstarted.html',
    //    url: '/gettingstarted',
    //    parent: 'main'
    //  });
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

  });
