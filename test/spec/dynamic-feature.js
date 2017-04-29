/**
 * Features which is concerns data-binding. and other angularJS features
 */

describe('Features contains ngModel, option auto generate, etc;', function() {

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

  it('should generate corresponding options with array and populate some meta property in each sub-scope of nya-bs-option', function() {
    $scope.options = changeGroups('options');

    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model">' +
      '<li nya-bs-option="option in options group by option.group">' +
      '<a>{{option.name}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    var list = selectElement.find('ul').children();
    var total = 0,
      value,
      scopeOfOption,
      i, length = list.length,
      liElement;
    for(i = 0; i < length; i++) {
      liElement = list.eq(i);
      if(liElement.hasClass('nya-bs-option')) {
        scopeOfOption = liElement.scope();
        value = {
          name: scopeOfOption.option.name,
          group: scopeOfOption.$group
        };
        expect($scope.options).toContains(value);
        total++;
      }
    }
    expect(total).toEqual($scope.options.length);
  });

  it('should generate corresponding options with object and populate some meta property in each sub-scope of nya-bs-option', function() {
    $scope.options = changeObject('options');

    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model">' +
      '<li nya-bs-option="(key, value) in options group by value.group">' +
      '<a>{{key}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    var list = selectElement.find('ul').children();
    var total = 0,
      value,
      scopeOfOption,
      i, length = list.length,
      liElement;
    for(i = 0; i < length; i++) {
      liElement = list.eq(i);
      if(liElement.hasClass('nya-bs-option')) {
        scopeOfOption = liElement.scope();
        value = {
          name: scopeOfOption.value.name,
          group: scopeOfOption.$group
        };
        expect($scope.options[scopeOfOption.key]).toDeepEqual(value);
        total++;
      }
    }
    expect(total).toEqual(Object.keys($scope.options).length);
  });

  it('should synchronize selected class with ng-model', function() {


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
          } else {
            expect(liElement).not.toHaveClass('selected');
          }
        }
      }
    }

    // string array
    $scope.options = options;
    $scope.model = changeModel($scope.options);
    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model" multiple>' +
      '<li nya-bs-option="option in options">' +
      '<a>{{option}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    check();
    var index;
    for(index = 0; index < 1000; index++) {
      $scope.model = changeModel($scope.options);
      $scope.$digest();

      check();
    }

    //object array
    $scope.options = changeGroups(options);
    $scope.model = changeModel($scope.options);
    $scope.$digest();

    check();

    for(index = 0; index < 1000; index++) {
      $scope.model = changeModel($scope.options);
      $scope.$digest();

      check();
    }

  });

  it('should modify ng-model when option collection changed', function() {

    function check() {
      $scope.model.forEach(function(value){
        expect(existInArray(value, $scope.options)).toBeTruthy();
      });
    }

    $scope.options = changeGroups(options);
    $scope.model = angular.copy($scope.options);

    $scope.$digest();

    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model" multiple>' +
      '<li nya-bs-option="option in options">' +
      '<a>{{option}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    var index, length, start, count;
    for(index = 0; index < 1000; index++) {
      length = $scope.options.length;
      if(length > 3) {
        start = Math.floor(Math.random() * length);
        count = Math.floor(Math.random() * (length - start));
        $scope.options.splice(start, count);
      } else {
        $scope.options = changeGroups(options);
        $scope.model = angular.copy($scope.options);
      }
      $scope.$digest();

      check();
    }
  });

  it('should work with array using track by', function() {
    $scope.options = changeGroups(options);
    $scope.$digest();

    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model">' +
      '<li nya-bs-option="option in options track by option.name">' +
      '<a>{{option.name}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    //what shall we test? Maybe no exception occur is enough.
  });

  it('should using result specified by the value expression', function() {
    $scope.options = changeGroups(options);
    $scope.$digest();

    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model" multiple>' +
      '<li nya-bs-option="option in options track by option.name" value="option.name">' +
      '<a>{{option.name}}</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);


    // we don't mock user click in this unit test. we will test user interaction in e2e test.

    $scope.model = changeModel($scope.options);

    $scope.$digest();

    var list = selectElement.find('ul').children(),
      index,
      length = list.length,
      liElement,
      scopeOfOption,
      value;
    for(index = 0; index < length; index++) {
      liElement = list.eq(index);
      if(liElement.hasClass('nya-bs-option')) {
        scopeOfOption = liElement.scope();
        value = scopeOfOption.option.name;
        if(indexOfWithProperty({name: value}, $scope.model, ['name']) !== -1) {
          expect(liElement).toHaveClass('selected');
        } else {
          expect(liElement).not.toHaveClass('selected');
        }
      }
    }
  });

  it('should give the first option of a group a first-in-group class whenever option collection changed', function() {
    $scope.options = changeGroups(options);

    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model">' +
    '<li nya-bs-option="option in options group by option.group">' +
    '<a>{{option.name}}</a>' +
    '</li>' +
    '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    var list = selectElement.find('ul').children(),
      index,
      length = list.length,
      liElement,
      scopeOfOption,
      group,
      lastGroup;

    for(index = 0; index < length; index++) {
      liElement = list.eq(index);
      if(liElement.hasClass('nya-bs-option')) {
        scopeOfOption = liElement.scope();
        group = scopeOfOption.$group;
        if(!lastGroup || group != lastGroup) {
          // this is the first item in the group. should have class "first-in-group"

          expect(liElement).toHaveClass('first-in-group');
        } else {

          // otherwise, shouldn't have that class.
          expect(liElement).not.toHaveClass('first-in-group');
        }
        lastGroup = group;
      }
    }

  });

  it('should work with ngRequired and required directive in single selection mode', function() {
    $scope.options = changeGroups(options);

    // single selection
    var formElement = angular.element('<form name="testForm">' +
    '<ol class="nya-bs-select" ng-model="model" required>' +
    '<li nya-bs-option="option in options group by option.group">' +
    '<a>{{option.name}}</a>' +
    '</li>' +
    '</ol>' +
    '</form>');
    $compile(formElement)($scope);

    var selectElement = formElement.children();
    $scope.$digest();

    // should have an invalid class
    expect(selectElement).toHaveClass('ng-invalid-required');
    expect(selectElement).not.toHaveClass('ng-valid-required');

    // should have an valid class

    $scope.model = $scope.options[0];

    $scope.$digest();

    expect(selectElement).toHaveClass('ng-valid-required');
    expect(selectElement).not.toHaveClass('ng-invalid-required');
  });

  it('should work with ngRequired and required directive in multiple selection mode', function() {
    $scope.options = changeGroups(options);
    $scope.model = [];
    // single selection
    var formElement = angular.element('<form name="testForm">' +
    '<ol class="nya-bs-select" ng-model="model" required multiple>' +
    '<li nya-bs-option="option in options group by option.group">' +
    '<a>{{option.name}}</a>' +
    '</li>' +
    '</ol>' +
    '</form>');
    $compile(formElement)($scope);

    var selectElement = formElement.children();
    $scope.$digest();

    // should have an invalid class
    expect(selectElement).toHaveClass('ng-invalid-required');
    expect(selectElement).not.toHaveClass('ng-valid-required');

    // should have an valid class

    $scope.model = changeModel($scope.options);

    $scope.$digest();

    expect(selectElement).toHaveClass('ng-valid-required');
    expect(selectElement).not.toHaveClass('ng-invalid-required');
  });

  it('should update button label with deepWatch options when collection changed.', function() {

    $scope.options = [
      {name: 'Alpha', value: 'a'},
      {name: 'Bravo', value: 'b'}
    ];

    $scope.model = 'b';
    $scope.$digest();

    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model">' +
    '<li nya-bs-option="option in options" value="option.value" deep-watch="true">' +
    '<a>{{option.name}}</a>' +
    '</li>' +
    '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();
    $timeout.flush();
    expect(selectElement.find('button').children().eq(0).text()).toBe('Bravo');

    // now change property of options.

    $scope.options[1].name = 'Beta';

    $scope.$digest();
    $timeout.flush();
    expect(selectElement.find('button').children().eq(0).text()).toBe('Beta');
  });

  it('should not change $dirty state when initialized', function() {
    $scope.options = [
      {name: 'Alpha', value: 'a'},
      {name: 'Bravo', value: 'b'}
    ];
    $scope.model = 'b';
    $scope.$digest();

    var selectElement = angular.element('<form name="testForm">' +
        '<ol class="nya-bs-select" ng-model="model" name="testPicker">' +
          '<li nya-bs-option="option in options" value="option.value">' +
            '<a>{{option.name}}</a>' +
          '</li>' +
        '</ol>' +
      '</form>'
      );
    $compile(selectElement)($scope);

    spyOn($scope.testForm.testPicker, '$setViewValue');

    $scope.$digest();

    expect($scope.testForm.testPicker.$setViewValue).not.toHaveBeenCalled();
  });

  it('should reset select when model is null or undefined', function () {
    $scope.options = [
      {name: 'Alpha', value: 'a'},
      {name: 'Bravo', value: 'b'}
    ];
    $scope.model = 'b';
    $scope.$digest();

    var selectElement = angular.element('<form name="testForm">' +
        '<ol class="nya-bs-select" ng-model="model" name="testPicker">' +
          '<li nya-bs-option="option in options" value="option.value">' +
            '<a>{{option.name}}</a>' +
          '</li>' +
        '</ol>' +
      '</form>'
    );
    $compile(selectElement)($scope);
    $scope.$digest();

    var selectedOptions = selectElement[0].querySelectorAll('li.selected');
    expect(selectedOptions.length).toEqual(1);

    $scope.model = null;
    $scope.$digest();
    selectedOptions = selectElement[0].querySelectorAll('li.selected');
    expect(selectedOptions.length).toEqual(0);

    $scope.model = 'a';
    $scope.$digest();

    selectedOptions = selectElement[0].querySelectorAll('li.selected');
    expect(selectedOptions.length).toEqual(1);

    $scope.model = undefined;
    $scope.$digest();

    selectedOptions = selectElement[0].querySelectorAll('li.selected');
    expect(selectedOptions.length).toEqual(0);

  });

  it('should add/remove disabled class in dropdownToggle button when using ngDisabled', function () {
    $scope.options = [
      {name: 'Alpha', value: 'a'},
      {name: 'Bravo', value: 'b'}
    ];
    $scope.model = 'b';
    $scope.$digest();
    $scope.disableMe = true;

    var selectElement = angular.element('<form name="testForm">' +
        '<ol class="nya-bs-select" ng-model="model" name="testPicker" ng-disabled="disableMe">' +
          '<li nya-bs-option="option in options" value="option.value">' +
            '<a>{{option.name}}</a>' +
          '</li>' +
        '</ol>' +
      '</form>'
    );
    $compile(selectElement)($scope);
    $scope.$digest();

    var dropdownToggle = selectElement[0].querySelector('.dropdown-toggle');
    expect(dropdownToggle.classList.contains('disabled')).toBeTruthy();

    $scope.disableMe = false;
    $scope.$digest();

    expect(dropdownToggle.classList.contains('disabled')).toBeFalsy();
  });
});
