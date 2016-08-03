/**
 * Features for static option data-value
 */

describe('static feature', function() {
  var $scope,
    $compile,
    $timeout;

  beforeEach(module('nya.bootstrap.select'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  it('should update ngModel value when click some option', function() {
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
          value = liElement.attr('data-value');
          if(value === $scope.model) {
            expect(liElement).toHaveClass('selected');
          } else {
            expect(liElement).not.toHaveClass('selected');
          }
        }
      }
    }
    $scope.model = 'a';

    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model">' +
      '<li class="nya-bs-option" data-value="a">' +
      '<a>Alpha</a>' +
      '</li>' +
      '<li class="nya-bs-option" data-value="b">' +
      '<a>Bravo</a>' +
      '</li>' +
      '<li class="nya-bs-option" data-value="c">' +
      '<a>Charlie</a>' +
      '</li>' +
      '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    check();

    $scope.model = 'b';
    $scope.$digest();

    check();

  });

});
