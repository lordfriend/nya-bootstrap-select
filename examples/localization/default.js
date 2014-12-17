'use strict';

angular.module('demoApp', ['nya.bootstrap.select'])
  .config(function(nyaBsConfigProvider) {
    nyaBsConfigProvider.setLocalizedText('zh-cn', {
      defaultNoneSelection: '无选择',
      noSearchResult: '无匹配结果',
      numberItemSelected: '选中%d项'
    });
    nyaBsConfigProvider.setLocalizedText('en-us', {
      defaultNoneSelectionTpl: '<span class="label label-warning">Nothing selected</span>',
      noSearchResultTpl: '<span style="color: red;">NO MATCHED RESULT</span>',
      numberItemSelectedTpl: '<strong>%d items selected</strong>'
    });
  })
  .controller('MainCtrl', function($scope){

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
