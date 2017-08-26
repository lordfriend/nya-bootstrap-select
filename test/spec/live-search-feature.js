/**
 * Features which is concerns data-binding. and other angularJS features
 */

describe('features about live search related, etc;', function() {

  var $scope,
    $compile,
    $timeout;


  var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
    'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
    'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
  ];

  beforeEach(module('nya.bootstrap.select'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  it('should select filtered item using select-all with live-search', function() {


    // check list whether an selected element has a selected class
    function check() {
      var list = selectElement.find('ul').children();
      var i, length = list.length,
        liElement,
        scopeOfOption,
        value;
      for(i = 0; i < length; i++) {
        liElement = list.eq(i);
        if(liElement.hasClass('nya-bs-option')) {
          scopeOfOption = liElement.scope();
          value = scopeOfOption.option;
          if(existInArray(value, $scope.model)) {
            expect(liElement).toHaveClass('selected');
            expect(liElement).not.toHaveClass('not-match');
          } else {
            expect(liElement).not.toHaveClass('selected');
          }
        }
      }
    }

    // string array
    $scope.options = options;
    // $scope.model = changeModel($scope.options);
    $scope.model = [];
    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model" multiple live-search="true" actions-box="true">' +
      '<li nya-bs-option="option in options">' +
      '<a>{{option}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();
    selectElement.triggerHandler('click');
    var inputElement = selectElement.find('input');
    inputElement.val('o');
    inputElement.triggerHandler('input');

    selectElement[0].querySelector('.nya-bs-actionsbox .bs-select-all').click();

    $scope.$digest();

    check();
  });

});
