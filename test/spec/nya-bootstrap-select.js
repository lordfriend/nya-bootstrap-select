'use strict';

/**
 * This test contains basic usage of the directive.
 */
describe('nya-bootstrap-select default config test', function(){

  var $scope, $compile, rootElement;

  var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo', 'Foxtrot', 'Golf', 'Hotel', 'Juliet', 'Kilo', 'Lima',
    'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
    'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
  ];
  // change $scope.options randomly.
  var changeOptions = function() {
    var length = Math.max(Math.min(Math.floor(Math.random() * options.length), 10), 3);
    var newOptions = {};
    for(var i = 0; i < length; i++) {
      newOptions[options[Math.floor(Math.random() * options.length)]] = true;
    }
    $scope.options = Object.keys(newOptions);
  };

  // load the nyaBootstrapSelect module
  beforeEach(module('nyaBootstrapSelect'));

  beforeEach(inject(function(_$rootScope_, _$compile_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  beforeEach(function(){
    changeOptions();
    rootElement = $compile('<div class="select-container">' +
      '<select class="nya-selectpicker" ng-model="myModel" multiple>' +
      '<option ng-repeat="option in options" value="{{option}}">{{option}}</option>' +
      '</select>' +
      '</div>')($scope);
    $scope.$digest();
  });

  it('should make a bootstrap-select button use class directive', function(){


    var selectElement = rootElement.children('select');

    expect(rootElement.children().length).toEqual(2);

    expect(selectElement.next()).toHaveClass('bootstrap-select');

    var selectPicker = selectElement.next();

    expect(selectPicker.children('button')).toHaveClass('dropdown-toggle');
    expect(selectPicker.children('button')).toHaveClass('selectpicker');

    expect(selectPicker.children('button').children('span.filter-option').text()).toBe('Nothing selected');

  });


  it('should make a dropdown-menu use class directive', function(){

    var selectElement = rootElement.find('.nya-selectpicker');

    expect(selectElement.length).toBe(1);

    expect(selectElement.next()).toHaveClass('bootstrap-select');

    var selectPicker = selectElement.next();

    expect(selectPicker.children('.dropdown-menu').length).toBe(1);

  });

  it('should change dropdown-menu when options change', function(){
    var menu = rootElement.children('.bootstrap-select').find('ul.dropdown-menu');
    var lis = menu.children('li');
    // make sure our menu is built probably.
    expect(lis.length).toBe($scope.options.length);
    lis.each(function(index, element){
      expect($(element).find('span.text').text()).toEqual($scope.options[index]);
    });

    // change $scope.options;
    changeOptions();
    $scope.$digest();
    // because old element reference has been removed from dom. we need to get its again.
    menu = rootElement.children('.bootstrap-select').find('ul.dropdown-menu');
    lis = menu.children('li');
    // make sure new menu is built probably.
    expect(lis.length).toBe($scope.options.length);
    lis.each(function(index, element){
      expect($(element).find('span.text').text()).toEqual($scope.options[index]);
    });

  });

  it('should change selection when model change', function(){
    $scope.myModel = [];
    // our model should be empty array.
    expect($scope.myModel.length).toBe(0);

    // nothing should selected.
    // we use bootstrap-select API to check the value.
    var selectpicker = rootElement.children('.nya-selectpicker');
    expect(selectpicker.val()).toBeNull();

    // change models.
    var length = Math.max(Math.min(Math.floor(Math.random() * $scope.options.length), 5), 1);
    var newModels = {};
    for(var i = 0; i < length; i++) {
      newModels[$scope.options[Math.floor(Math.random() * $scope.options.length)]] = true;
    }
    $scope.myModel = Object.keys(newModels);

    $scope.$digest();

    // selectpicker not guarrantee the order. we need to deal with this.
    var selection = {};
    angular.forEach(selectpicker.val(), function(value) {
      selection[value] = true;
    });

    expect(selection).toEqual(newModels);

  });

  it('should change model when bootstrap-select change selection', function(){

    var selectpicker = rootElement.children('.nya-selectpicker');
    expect(selectpicker.val()).toBeNull();

    // change selection via bootstrap-select API.
    var length = Math.max(Math.min(Math.floor(Math.random() * $scope.options.length), 5), 1);
    var newSelection = {};
    for(var i = 0; i < length; i++) {
      newSelection[$scope.options[Math.floor(Math.random() * $scope.options.length)]] = true;
    }

    selectpicker.selectpicker('val', Object.keys(newSelection));

    $scope.$digest();

    // something must be selected.
    expect($scope.myModel.length).toBeGreaterThan(0);

    // the selection array's order doesn't equal to the models.
    // we need to transform the data structure.
    var modelMap = {};
    angular.forEach($scope.myModel, function(value) {
      modelMap[value] = true;
    });

    expect(modelMap).toEqual(newSelection);

  });
});