'use strict';

angular.module('docApp')
  .filter('camelCase', function(){
    return function(input) {
      var words = input.split('-');
      return words.map(function(value){
        return value.charAt(0).toUpperCase() + value.slice(1);
      }).join(' ');
    }
  });
