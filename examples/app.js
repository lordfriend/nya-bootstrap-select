'use strict';

angular.module('demoApp',['nyaBootstrapSelect'])
  .controller('MainCtrl', function($scope){

    var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
      'Echo', 'Foxtrot', 'Golf', 'Hotel', 'Juliet', 'Kilo', 'Lima',
      'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
      'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
    ];

    $scope.options1 = [
      'Alpha',
      'Bravo',
      'Charlie'
    ];

    $scope.myModel = ['Bravo'];

    $scope.changeOptions = function(targetOption) {
      var length = Math.max(Math.min(Math.floor(Math.random() * options.length), 10), 3);
      var newOptions = {};
      for(var i = 0; i < length; i++) {
        newOptions[options[Math.floor(Math.random() * options.length)]] = true;
      }
      $scope[targetOption] = Object.keys(newOptions);
    };

    $scope.options2 = options.splice(0, 6);

    $scope.changeModel = function(model) {
      var length = Math.floor(Math.random() * $scope.options2.length);
      var newModel = {};
      for(var i = 0; i < length; i++) {
        newModel[$scope.options2[Math.floor(Math.random() * $scope.options2.length)]] = true;
      }
      $scope[model] = Object.keys(newModel);
    };

    $scope.options3 = options.splice(0,6);

    $scope.changeGroups = function(targetOptions) {
      var length = Math.max(Math.min(Math.floor(Math.random() * options.length), 10), 3);
      var newOptions = {};
      for(var i = 0; i < length; i++) {
        newOptions[options[Math.floor(Math.random() * options.length)]] = true;
      }
      var newOptionArray = [];
      var groupCount = Math.max(Math.floor(Math.random() * length / 2), 2);
      angular.forEach(newOptions, function(value, key) {
        var group = Math.max(Math.floor(Math.random() * groupCount), 1);
        newOptionArray.push({
          name: key,
          group: 'Group ' + group
        });
      });

      $scope[targetOptions] = newOptionArray;
    };
    $scope.changeGroups('options4');


  });