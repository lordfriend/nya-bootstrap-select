'use strict';
/**
 * This test use ngOptions directive instead of ngRepeat
 */
describe('nya-bootstrap-select with ngOptions support', function() {
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
    var newOptionArray = [];
    var groupCount = Math.max(Math.floor(Math.random() * length / 2), 2);
    angular.forEach(newOptions, function(value, key) {
      var group = Math.max(Math.ceil(Math.random() * groupCount), 1);
      newOptionArray.push({
        name: key,
        group: 'Group ' + group
      });
    });

    $scope.options = newOptionArray;
  };

  // load the nyaBootstrapSelect module
  beforeEach(module('nya.bootstrap.select'));

  beforeEach(inject(function(_$rootScope_, _$compile_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  beforeEach(function(){
    changeOptions();
    rootElement = $compile('<div class="select-container">' +
      '<select class="nya-selectpicker" ng-model="myModel" multiple ng-options="c.name group by c.group for c in options">' +
      '</select>' +
      '</div>')($scope);
    $scope.$digest();
  });

  it('should make a bootstrap-select component and has a grouped drop-down with corresponding options', function(){

    var selectElement = rootElement.children('select');

    expect(rootElement.children().length).toEqual(2);

    // a bootstrap component
    expect(selectElement.next()).toHaveClass('bootstrap-select');

    var menu = rootElement.children('.bootstrap-select').find('ul.dropdown-menu');
    var lis = menu.children('li');
    var firstOptOfGroup = 0;
    selectElement.children('optgroup').each(function(groupIndex, group){
      var optionCount = $(group).children('option').length;

//      console.log(groupIndex, optionCount);
      var groupLabel = lis.eq(firstOptOfGroup).find('dt').children('span.text').text();
      console.log(groupLabel);
      // validate group label
      expect($(group).attr('label')).toEqual(groupLabel);

      // validate option of each group

      $(group).children('option').each(function(optionIndex, option) {
        var optionText = lis.eq(firstOptOfGroup + optionIndex).find('a').children('span.text').text();
        expect($(option).text()).toEqual(optionText);
      });

      firstOptOfGroup += optionCount;
    });

  });
});
