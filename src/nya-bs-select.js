nyaBsSelect.directive('nyaBsSelect', ['$parse', '$document', '$timeout', function ($parse, $document, $timeout) {

  var DEFAULT_NONE_SELECTION = 'Nothing selected';

  var DROPDOWN_TOGGLE = '<button class="btn btn-default dropdown-toggle">' +
    '<span class="pull-left filter-option"></span>' +
    '&nbsp;' +
    '<span class="caret"></span>' +
    '</button>';

  var DROPDOWN_CONTAINER = '<div class="dropdown-menu open"></div>';

  var SEARCH_BOX = '<div class="bs-searchbox">' +
    '<input type="text" class="form-control">' +
    '</div>';

  var DROPDOWN_MENU = '<ul class="dropdown-menu inner"></ul>';

  var NO_SEARCH_RESULT = '<li class="no-search-result"><span>NO SEARCH RESULT</span></li>';

  return {
    restrict: 'ECA',
    require: ['ngModel', 'nyaBsSelect'],
    controller: 'nyaBsSelectCtrl',
    compile: function nyaBsSelectCompile (tElement, tAttrs){

      tElement.addClass('btn-group');

      var options = tElement.children(),
        dropdownToggle = jqLite(DROPDOWN_TOGGLE),
        dropdownContainer = jqLite(DROPDOWN_CONTAINER),
        dropdownMenu = jqLite(DROPDOWN_MENU),
        searchBox,
        noSearchResult,
        classList;

      classList = getClassList(tElement[0]);
      classList.forEach(function(className) {
        if(/btn-(?:primary)|(?:info)|(?:success)|(?:warning)|(?:danger)|(?:inverse)/.test(className)) {
          tElement.removeClass(className);
          dropdownToggle.removeClass('btn-default');
          dropdownToggle.addClass(className);
        }

        if(/btn-(?:lg)|(?:sm)|(?:xs)/.test(className)) {
          tELement.removeClass(className);
          dropdownToggle.addClass(className);
        }

        if(className = 'form-control') {
          dropdownToggle.addClass(className);
        }
      });

      dropdownMenu.append(options);

      var isMultiple = typeof tAttrs.multiple !== 'undefined';

      if(tAttrs.liveSearch === 'true') {
        searchBox = jqLite(SEARCH_BOX);
        noSearchResult = jqLite(NO_SEARCH_RESULT);
        dropdownContainer.append(searchBox);
        dropdownMenu.append(noSearchResult);
      }

      // set default none selection text
      if(tAttrs.title) {
        dropdownToggle.children().eq(0).text(tAttrs.title);
      } else {
        dropdownToggle.children().eq(0).text(DEFAULT_NONE_SELECTION);
      }

      dropdownContainer.append(dropdownMenu);

      tElement.append(dropdownToggle);
      tElement.append(dropdownContainer);

      return function nyaBsSelectLink ($scope, $element, $attrs, ctrls) {

        var ngCtrl = ctrls[0];
        var nyaBsSelectCtrl = ctrls[1];

        var liHeight;

        // for debug
        nyaBsSelectCtrl.setId($element.attr('id'));

        // required validator
        if (isMultiple) {
          ngCtrl.$isEmpty = function(value) {
            return !value || value.length === 0;
          };
        }

        var valueExpFn,
          valueExpGetter = $parse(nyaBsSelectCtrl.valueExp);
        if(nyaBsSelectCtrl.valueExp) {
          valueExpFn = function(scope, locals) {
            return valueExpGetter(scope, locals);
          };
        }

        if(isMultiple) {
          nyaBsSelectCtrl.isMultiple = true;
        }

        /**
         * Do some check on modelValue. remove no existing value
         * @param values
         */
        nyaBsSelectCtrl.onCollectionChange = function (values) {
          console.log('collection changed! ', values);
          var valuesForSelect = [],
            index,
            length,
            modelValue = ngCtrl.$modelValue;

          if(!modelValue) {
            return;
          }

          if(!values || values.length === 0) {
            if(isMultiple) {
              modelValue = [];
            } else {
              modelValue = null;
            }
          } else {

            if(valueExpFn) {
              for(index = 0; index < values.length; index++) {
                valuesForSelect.push(valueExpFn($scope, values[index]));
              }
            } else {
              for(index = 0; index < values.length; index++) {
                if(nyaBsSelectCtrl.valueIdentifier) {
                  valuesForSelect.push(values[index][nyaBsSelectCtrl.valueIdentifier]);
                } else if(nyaBsSelectCtrl.keyIdentifier) {
                  valuesForSelect.push(values[index][nyaBsSelectCtrl.keyIdentifier]);
                }
              }

            }

            if(isMultiple) {
              length = modelValue.length;
              for(index = 0; index < modelValue.length; index++) {
                if(!contains(valuesForSelect, modelValue[index])) {
                  modelValue.splice(index, 1);
                  index--;
                }
              }

              if(length !== modelValue.length) {
                // modelValue changed.
                // Due to ngModelController compare reference with the old modelValue, we must set an new array instead of modifying the old one.
                // See: https://github.com/angular/angular.js/issues/1751
                modelValue = deepCopy(modelValue);
              }

            } else {
              if(!contains(valuesForSelect, modelValue)) {
                modelValue = valuesForSelect[0];
              }
            }

          }

          ngCtrl.$setViewValue(modelValue);

          updateButtonContent();

        };

        // view --> model

        dropdownMenu.on('click', function menuEventHandler (event) {
          if(jqLite(event.target).hasClass('dropdown-header')) {
            return;
          }
          var nyaBsOptionNode = filterTarget(event.target, dropdownMenu[0], 'nya-bs-option'),
            nyaBsOption,
            value,
            viewValue,
            modelValue = ngCtrl.$modelValue,
            index;
          if(nyaBsOptionNode !== null) {
            nyaBsOption = jqLite(nyaBsOptionNode);
            if(nyaBsOption.hasClass('disabled')) {
              return;
            }
            // if user specify the value attribute. we should use the value attribute
            // otherwise, use the valueIdentifier specified field in target scope

            value = getOptionValue(nyaBsOption);

            if(value) {
              if(isMultiple) {
                // make a deep copy enforce ngModelController to call its $render method.
                // See: https://github.com/angular/angular.js/issues/1751
                viewValue = Array.isArray(modelValue) ? deepCopy(modelValue) : [];
                index = indexOf(viewValue, value);
                if(index === -1) {
                  // check element
                  viewValue.push(value);
                  nyaBsOption.addClass('selected');

                } else {
                  // uncheck element
                  viewValue.splice(index, 1);
                  nyaBsOption.removeClass('selected');

                }

              } else {
                dropdownMenu.children().removeClass('selected');
                viewValue = value;
                nyaBsOption.addClass('selected');

              }
              ngCtrl.$setViewValue(viewValue);
              $scope.$digest();
            }

            if(!isMultiple) {
              // in single selection mode. close the dropdown menu
              $element.removeClass('open');
            }
            updateButtonContent();
          }
        });

        // if click the outside of dropdown menu, close the dropdown menu
        $document.on('click', function(event) {
          if(filterTarget(event.target, $element.parent()[0], $element[0]) === null) {
            $element.removeClass('open');
          }
        });

        dropdownToggle.on('click', function() {
          $element.toggleClass('open');
          if($element.hasClass('open') && typeof liHeight === 'undefined') {
            calcMenuSize();
          }
          if($attrs.liveSearch === 'true' && $element.hasClass('open')) {
            searchBox.children().eq(0)[0].focus();
          }
        });

        // live search
        if($attrs.liveSearch === 'true') {
          searchBox.children().on('input', function(){

            var searchKeyword = searchBox.children().val(),
              found = 0,
              options = dropdownMenu.children(),
              length = options.length,
              index,
              option;

            if(searchKeyword) {
              for(index = 0; index < length; index++) {
                option = options.eq(index);
                if(option.hasClass('nya-bs-option')) {
                  if(!hasKeyword(option.find('a'), searchKeyword)) {
                    option.addClass('not-match');
                  } else {
                    option.removeClass('not-match');
                    found++;
                  }
                }
              }

              if(found === 0) {
                noSearchResult.addClass('show');
              } else {
                noSearchResult.removeClass('show');
              }
            } else {
              for(index = 0; index < length; index++) {
                option = options.eq(index);
                if(option.hasClass('nya-bs-option')) {
                  option.removeClass('not-match');
                }
              }
              noSearchResult.removeClass('show');
            }

          });
        }


        // model --> view

        ngCtrl.$render = function() {
          console.log(nyaBsSelectCtrl.id + ' render start', ' ngModel: ', ngCtrl.$modelValue);
          var modelValue = ngCtrl.$modelValue,
            index,
            bsOptionElements = dropdownMenu.children(),
            length = bsOptionElements.length,
            value;
          if(typeof modelValue === 'undefined') {
            // if modelValue is undefined. uncheck all option
            for(index = 0; index < length; index++) {
              if(bsOptionElements.eq(index).hasClass('nya-bs-option')) {
                bsOptionElements.eq(index).removeClass('selected');
              }
            }
          } else {
            for(index = 0; index < length; index++) {
              if(bsOptionElements.eq(index).hasClass('nya-bs-option')) {

                value = getOptionValue(bsOptionElements.eq(index));
                if(isMultiple) {
                  if(contains(modelValue, value)) {
                    bsOptionElements.eq(index).addClass('selected');
                  } else {
                    bsOptionElements.eq(index).removeClass('selected');
                  }
                } else {
                  if(deepEquals(modelValue, value)) {
                    bsOptionElements.eq(index).addClass('selected');
                  } else {
                    bsOptionElements.eq(index).removeClass('selected');
                  }
                }

              }
            }
          }
          console.log(nyaBsSelectCtrl.id + ' render end');
          updateButtonContent();
        };

        function getOptionValue(nyaBsOption) {
          var scopeOfOption;
          if(valueExpFn) {
            scopeOfOption = nyaBsOption.scope();
            return valueExpFn(scopeOfOption);
          } else {
            if(nyaBsSelectCtrl.valueIdentifier || nyaBsSelectCtrl.keyIdentifier) {
              scopeOfOption = nyaBsOption.scope();
              return scopeOfOption[nyaBsSelectCtrl.valueIdentifier] || scopeOfOption[nyaBsSelectCtrl.keyIdentifier];
            } else {
              return nyaBsOption.attr('value');
            }
          }

        }

        function getOptionText(nyaBsOption) {
          var item = nyaBsOption.find('a');
          if(item.children().length === 0 || item.children().eq(0).hasClass('check-mark')) {
            // if the first child is check-mark or has no children, means the option text is text node
            return item[0].firstChild.cloneNode(false);
          } else {
            // otherwise we clone the first element of the item
            return item.children().eq(0)[0].cloneNode(true);
          }
        }

        function updateButtonContent() {
          var modelValue = ngCtrl.$modelValue;
          var filterOption = dropdownToggle.children().eq(0);
          if(!modelValue) {
            return;
          }
          if(isMultiple && modelValue.length === 0) {
            if($attrs.title) {
              // use title attribute value.
              filterOption.empty();
              filterOption.append(document.createTextNode($attrs.title));
            } else {
              // use default text.
              filterOption.empty();
              filterOption.append(document.createTextNode(DEFAULT_NONE_SELECTION));
            }
          } else {
            $timeout(function() {

              var bsOptionElements = dropdownMenu.children(),
                value,
                nyaBsOption,
                index,
                length = bsOptionElements.length,
                optionTitle,
                selection = [],
                match,
                count;

              if(isMultiple && $attrs.selectedTextFormat === 'count') {
                count = 1;
              } else if(isMultiple && $attrs.selectedTextFormat && (match = $attrs.selectedTextFormat.match(/\s*count\s*>\s*(\d+)\s*/))) {
                count = parseInt(match[1], 10);
              }

              // data-selected-text-format="count" or data-selected-text-format="count>x"
              if((typeof count !== 'undefined') && modelValue.length > count) {
                filterOption.empty();
                filterOption.append(document.createTextNode(modelValue.length + ' items selected'));
                return;
              }

              // data-selected-text-format="values" or the number of selected items is less than count
              for(index = 0; index < length; index++) {
                nyaBsOption = bsOptionElements.eq(index);
                if(nyaBsOption.hasClass('nya-bs-option')) {

                  value = getOptionValue(nyaBsOption);

                  if(isMultiple) {
                    if(Array.isArray(modelValue) && contains(modelValue, value)) {
                      // if option has an title attribute. use the title value as content show in button.
                      // otherwise get very first child element.
                      optionTitle = nyaBsOption.attr('title');
                      if(optionTitle) {
                        selection.push(document.createTextNode(optionTitle));
                      } else {
                        selection.push(getOptionText(nyaBsOption));
                      }

                    }
                  } else {
                    if(deepEquals(modelValue, value)) {
                      optionTitle = nyaBsOption.attr('title');
                      if(optionTitle) {
                        selection.push(document.createTextNode(optionTitle));
                      } else {
                        selection.push(getOptionText(nyaBsOption));
                      }
                    }
                  }

                }
              }

              if(selection.length === 0) {
                if($attrs.title) {
                  // use title attribute value.
                  filterOption.empty();
                  filterOption.append(document.createTextNode($attrs.title));
                } else {
                  // use default text.
                  filterOption.empty();
                  filterOption.append(document.createTextNode(DEFAULT_NONE_SELECTION));
                }
              } else if(selection.length === 1) {
                // either single or multiple selection will show the only selected content.
                filterOption.empty();
                filterOption.append(selection[0]);
              } else {
                filterOption.empty();
                for(index = 0; index < selection.length; index++) {
                  filterOption.append(selection[index]);
                  if(index < selection.length -1) {
                    filterOption.append(document.createTextNode(', '));
                  }
                }
              }

            });
          }

        }

        // will called only once.
        function calcMenuSize(){

          var liElements = dropdownMenu.find('li'),
            length = liElements.length,
            liElement,
            i;
          for(i = 0; i < length; i++) {
            liElement = liElements.eq(i);
            if(liElement.hasClass('nya-bs-option') || liElement.attr('nya-bs-option')) {
              liHeight = liElement[0].clientHeight;
              console.log('liHeight', liHeight);
              break;
            }
          }

          if(/\d+/.test($attrs.size)) {
            var dropdownSize = parseInt($attrs.size, 10);
            dropdownMenu.css('max-height', (dropdownSize * liHeight) + 'px');
            dropdownMenu.css('overflow-y', 'auto');
          }

        }

      };
    }
  };
}]);
