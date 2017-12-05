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

    selectElement[0].querySelector('.bs-actionsbox .bs-select-all').click();

    $scope.$digest();

    check();
  });

 it('should clear live-search', function() {
    // get amount of available li
    function get_amount() {
      var list = selectElement.find('ul').children();
      var i, k, length = list.length,
          liElement,
          classList,
          check,
          counter = 0;
      for(i = 0; i < length; i++) {
        liElement = list.eq(i);
        if(liElement.hasClass('nya-bs-option')) {
          classList = liElement[0].classList;
          check = false;
          for(k = 0; k < classList.length; k++){
            if(classList[k] === 'not-match'){
                check = true;
            }
          }
          if(check === false){
            counter++;
          }
        }
      }
      return counter;
    }

    // string array
    $scope.options = options;
    $scope.model = [];
    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model" live-search="true">' +
                                        '<li nya-bs-option="option in options">' +
                                        '<a>{{option}}</a>' +
                                        '</li>' +
                                        '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();
    //open dropdown
    selectElement.find('button')[0].click();
    //get amount of options
	  var before_change = get_amount(selectElement, 'amount');
    //set live-search
    selectElement.find('input').val('o');
    //trigger live-search
    selectElement.find('input').triggerHandler('input');
    //trigger digest cycle
    $scope.$digest();
    //check if value is set
    expect(selectElement.find('input').val()).toBe('o');
	  //check amount of options vs new amount
    expect(get_amount(selectElement, 'amount')).not.toBe(before_change);
    //close dropdown
    selectElement.find('button')[0].click();
    //open dropdown
    selectElement.find('button')[0].click();
    //check if value is empty
    expect(selectElement.find('input').val()).toBe('');
    //check amount of options vs new amount
    expect(get_amount(selectElement, 'amount')).toBe(before_change);
  });
  
});
