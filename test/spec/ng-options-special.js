'use strict';
/**
 * This test use ngOptions directive and each test use special scenario
 */
describe('nya-bootstrap-select with ngOptions support and special scenario', function() {
  var $scope, $compile, rootElement;

  var hasGroup = function(array) {
    return array.every(function(element) {
      return element.hasOwnProperty('group');
    });
  };

  var limitEquals = function(o1, o2, properties) {
    return properties.every(function (prop) {
      return angular.equals(o1[prop], o2[prop]);
    });
  };

  /**
   * get the index of object in array. you can limit the equality check properties.
   * @param object ,{Object} the object which you want to search in array
   * @param array ,{Array} target array which you want search in.
   * @param properties ,(Optional){Array} the you can specify limited properties to check two elements equality
   * @returns {number}
   */
  var indexOf = function(object, array, properties) {
    var index = -1;
    for(var i = 0; i < array.length; i++) {
      var isEqual = false;

      if(properties) {
        isEqual = limitEquals(object, array[i], properties);
      } else {
        isEqual = angular.equals(object, array[i]);
      }

      if(isEqual) {
        index = i;
        break;
      }
    }
    return index;
  };

  var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo', 'Foxtrot', 'Golf', 'Hotel', 'Juliet', 'Kilo', 'Lima',
    'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
    'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
  ];
  var existInArray = function(value, array) {
    return array.some(function(element){return angular.equals(element, value);});
  };

  var changeGroups = function(targetOptions) {
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

  var changeModel = function(model, options) {
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

  // load the nyaBootstrapSelect module
  beforeEach(module('nya.bootstrap.select'));

  beforeEach(inject(function(_$rootScope_, _$compile_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  it('should select options using default model value', function(){
    // define options and models before compile
    changeGroups('options');
    changeModel('myModel', 'options');

    $scope.$digest();

    rootElement = $compile('<div class="select-container">' +
      '<select class="nya-selectpicker" ng-model="myModel" multiple ng-options="c.name group by c.group for c in options">' +
      '</select>' +
      '</div>')($scope);
    $scope.$digest();

    var selectElement = rootElement.children('.nya-selectpicker');
    var dropdown = selectElement.next().find('.dropdown-menu.selectpicker');
    var selectedListElement = dropdown.children('.selected');

    expect(selectedListElement.length).toEqual($scope.myModel.length);

    selectedListElement.each(function() {
      var text = $(this).find('a > span.text').text();
      var indexOfModel = indexOf({name: text}, $scope.myModel, ['name']);
      expect(indexOfModel).toBeGreaterThan(-1);
    });
  });

  it('should change select when model changed while ng-options contains track by', function(){
    // define options and models before compile
    $scope.options = [
      {label: 'Alpha', value: 'alpha', group: 'group1'},
      {label: 'Bravo', value: 'bravo', group: 'group1'},
      {label: 'Charlie', value: 'charlie', group: 'group1'},
      {label: 'Delta', value: 'delta', group: 'group2'},
      {label: 'Echo', value: 'echo', group: 'group2'},
      {label: 'Fox', value: 'fox', group: 'group2'}
    ];

    $scope.$digest();

    rootElement = $compile('<div class="select-container">' +
      '<select class="nya-selectpicker" ng-model="myModel" multiple ng-options="c.value as c.label group by c.group for c in options track by c.value">' +
      '</select>' +
      '</div>')($scope);
    $scope.$digest();

    $scope.myModel = ['bravo', 'delta', 'fox'];

    $scope.$digest();

    var selectElement = rootElement.children('.nya-selectpicker');
    var dropdown = selectElement.next().find('.dropdown-menu.selectpicker');
    var selectedListElement = dropdown.children('.selected');

    expect(selectedListElement.length).toEqual($scope.myModel.length);

    selectedListElement.each(function(index) {
      var text = $(this).find('a > span.text').text();
      expect($scope.myModel[index]).toEqual(text.toLowerCase());
    });
  });
});
