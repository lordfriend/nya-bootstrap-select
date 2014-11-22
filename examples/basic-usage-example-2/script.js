(function(angular) {
 'use strict';
  var myApp = angular.module('BasicUsageExample2App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
  'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
  'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
  'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
];
// randomly generate options from options array
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


$scope.changeGroups('options');
  }]);
})(window.angular);
