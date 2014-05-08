'use strict';

angular.module('demoApp',['nya.bootstrap.select'])
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

    var existInArray = function(value, array) {
      return array.some(function(element){return angular.equals(element, value);});
    };

    $scope.changeModel = function(model, options) {
      var length = Math.floor(Math.random() * $scope[options].length);
      var newModel = [];
      for(var i = 0; i < length; i++) {
        var newValue = $scope[options][Math.floor(Math.random() * $scope[options].length)];
        if(newModel.length === 0 || !existInArray(newValue, newModel)) {
          newModel.push(newValue);
        }
      }
      $scope[model] = newModel;
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
        var group = Math.max(Math.ceil(Math.random() * groupCount), 1);
        newOptionArray.push({
          name: key,
          group: 'Group ' + group
        });
      });

      $scope[targetOptions] = newOptionArray;
    };
    $scope.changeGroups('options4');


    $scope.changeObject = function(targetOptions) {
      var length = Math.max(Math.min(Math.floor(Math.random() * options.length), 10), 3);
      var newOptions = {};
      var groupCount = Math.max(Math.floor(Math.random() * length / 2), 2);
      for(var i = 0; i < length; i++) {
        var newValue = options[Math.floor(Math.random() * options.length)];
        var group = Math.max(Math.ceil(Math.random() * groupCount), 1);
        newOptions[newValue] = {
          name: newValue.toLowerCase(),
          group: 'Group' + group
        };
      }
      $scope[targetOptions] = newOptions;
    };

    $scope.changeObject('options5');

    $scope.changeModelOfObject = function(model, options) {
      var keys = Object.keys($scope[options]);
      var length = Math.floor(Math.random() * keys.length);
      var newModel = [];
      var keyModel = {};
      for(var i = 0; i < length; i++) {
        keyModel[keys[Math.floor(Math.random() * keys.length)]] = true;
      }
      angular.forEach(keyModel, function(value, key) {
        newModel.push($scope[options][key]);
      });
      $scope[model] = newModel;
    };

    $scope.changeModel('model4', 'options4');

    $scope.options6 = [{label: 'Alpha', value: 'alpha', group: 'group1'}, {label: 'Bravo', value: 'bravo', group: 'group1'}, {label: 'Charlie', value: 'charlie', group: 'group1'}];

    $scope.changeModelArray = function(model, options) {
      var length = Math.max(Math.min(Math.floor(Math.random() * $scope[options].length), 10), 3);
      var newOptions = {};
      for(var i = 0; i < length; i++) {
        newOptions[$scope[options][Math.floor(Math.random() * $scope[options].length)].value] = true;
      }
      $scope[model] = Object.keys(newOptions);
    };
    $scope.model6 = $scope.changeModelArray('model6', 'options6');

    $('#ngOptions-track-by-example').on('change', function(){
      console.log($('#ngOptions-track-by-example').val());
    });
  });