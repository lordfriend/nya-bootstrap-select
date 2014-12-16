/**
 * nya-bs-config service unit test
 */

describe('nyaBsConfig service', function() {
  var $scope,
    $compile,
    $timeout,
    $locale,
    nyaBsConfig;

  var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
    'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
    'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
  ];

  beforeEach(module('nya.bootstrap.select'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _nyaBsConfig_, _$locale_){
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;
    nyaBsConfig = _nyaBsConfig_;
    $locale = _$locale_;
  }));

  it('should set new locale text', function() {
    var localizedText = {
      defaultNoneSelection: 'Nothing',
      noSearchResult: 'NOT MATCHED',
      numberItemSelected: '%d selected'
    };
    nyaBsConfig.setLocalizedText('en-gb', localizedText);

    // change locale
    $locale.id = 'en-gb';

    expect(nyaBsConfig.getLocalizedText()).toDeepEqual(localizedText);

  });

  it('should use set locale instead of default', function() {
    var localizedText = {
      defaultNoneSelection: 'Nothing',
      noSearchResult: 'NOT MATCHED',
      numberItemSelected: '%d selected'
    };
    nyaBsConfig.setLocalizedText('en-gb', localizedText);

    nyaBsConfig.useLocale('en-gb');
    // change locale
    $locale.id = 'en-us';

    expect(nyaBsConfig.getLocalizedText()).toDeepEqual(localizedText);
  });

  it('should use template', function() {
    var localizedText = {
      defaultNoneSelectionTpl: '<span class="nothing">Nothing</span>',
      noSearchResultTpl: '<span class="nothing">NOT MATCHED</span>',
      numberItemSelectedTpl: '<span class="item-count">%d selected</span>'
    };
    nyaBsConfig.setLocalizedText('en-us', localizedText);

    // change locale
    $locale.id = 'en-us';

    $scope.options = options;
    $scope.model = [];
    $scope.$digest();
    var selectElement = angular.element('<ol class="nya-bs-select" ng-model="model" multiple data-selected-text-format="count" live-search="true">' +
    '<li nya-bs-option="option in options">' +
    '<a>{{option}}</a>' +
    '</li>' +
    '</ol>');
    $compile(selectElement)($scope);

    $scope.$digest();

    var list = selectElement.find('ul').children();
    expect(list.eq(list.length - 1).children().children()).toHaveClass('nothing');

    $timeout.flush();

    expect(selectElement.find('button').children().eq(0).children()).toHaveClass('nothing');

    $scope.model = options.slice(0, 5);

    $scope.$digest();

    $timeout.flush();

    expect(selectElement.find('button').children().eq(0).children()).toHaveClass('item-count');
  });
});
