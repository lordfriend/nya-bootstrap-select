'use strict';

/**
 * Test for special scenario
 */

describe('test for some special scenario', function() {
  var $scope, $compile, rootElement;

  var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo', 'Foxtrot', 'Golf', 'Hotel', 'Juliet', 'Kilo', 'Lima',
    'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
    'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
  ];

  // load the nyaBootstrapSelect module
  beforeEach(module('nya.bootstrap.select'));

  beforeEach(inject(function(_$rootScope_, _$compile_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  it('should refresh selector when some attribute changed', function() {
    $scope.options = options;
    $scope.enableSelector = true;
    $scope.$digest();

    rootElement = $compile('<div class="select-container">' +
        '<select class="nya-selectpicker" ng-model="myModel" ng-disabled="!enableSelector">' +
          '<option ng-repeat="option in options" value="{{option}}">{{option}}</option>' +
        '</select>' +
      '</div>')($scope);

    $scope.$digest();

    var selectElement = rootElement.children('.nya-selectpicker');
    var selectButton = selectElement.next().children('.dropdown-toggle');

    expect(selectElement).not.toHaveAttribute('disabled');
    expect(selectButton).not.toHaveClass('disabled');

    $scope.enableSelector = false;

    $scope.$digest();

    expect(selectElement).toHaveAttribute('disabled');
    expect(selectButton).toHaveClass('disabled');
  });
});