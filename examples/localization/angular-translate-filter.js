'use strict';

angular.module('demoApp', ['nya.bootstrap.select', 'pascalprecht.translate'])
  .config(function($translateProvider, nyaBsConfigProvider) {
    $translateProvider.translations('en', {
      LANG: 'English',
      NOTHING: 'Nothing Selected!'
    });
    $translateProvider.translations('jp', {
      LANG: '日本語',
      NOTHING: '未選択'
    });
  })
  .controller('MainCtrl', function($scope, $translate){

    $translate.use('en');

    $scope.changeLocale = function(locale) {
      $translate.use(locale);
    };


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
  });
