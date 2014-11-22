(function(angular) {
 'use strict';
  var myApp = angular.module('ControlDropdownMenuSizeExample1App', ['nya.bootstrap.select']);

  myApp.controller('MainController', ['$scope', function($scope){
  $scope.options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
  'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
  'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
  'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
];
  }]);
})(window.angular);
