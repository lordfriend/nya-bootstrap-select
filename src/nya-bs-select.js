nyaBsSelect.directive('nyaBsSelect', ['$parse', '$document', '$timeout', function ($parse, $document, $timeout) {

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

  var DEFAULT_NONE_SELECTION = 'Nothing selected';

  /**
   * filter the event target for the nya-bs-option element.
   * Use this method with event delegate. (attach a event handler on an parent element and listen the special children elements)
   * @param target event.target node
   * @param parent {object} the parent, where the event handler attached.
   * @param selector {string}|{object} a class or DOM element
   * @return the filtered target or null if no element satisfied the selector.
   */
  var filterTarget = function(target, parent, selector) {
    var elem = target,
      className, type = typeof selector;

    if(target == parent) {
      return null;
    } else {
      do {
        if(type === 'string') {
          className = ' ' + elem.className + ' ';
          if(elem.nodeType === 1 && className.replace(/[\t\r\n\f]/g, ' ').indexOf(selector) >= 0) {
            return elem;
          }
        } else {
          if(elem == selector) {
            return elem;
          }
        }

      } while((elem = elem.parentNode) && elem != parent && elem.nodeType !== 9);

      return null;
    }

  };

  var getClassList = function(element) {
    var classList,
      className = element.className.replace(/[\t\r\n\f]/g, ' ').trim();
    classList = className.split(' ');
    for(var i = 0; i < classList.length; i++) {
      if(/\s+/.test(classList[i])) {
        classList.splice(i, 1);
        i--;
      }
    }
    return classList;

  };

  /**
   * Current support only drill down one level.
   * case insensitive
   * @param element
   * @param keyword
   */
  var hasKeyword = function(element, keyword) {
    var childElements,
      index, length;
    if(element.text().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
      return true;
    } else {
      childElements = element.children();
      length = childElements.length;
      for(index = 0; index < length; index++) {
        if(childElements.eq(index).text().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    }
  };

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

      dropdownContainer.append(dropdownMenu);

      tElement.append(dropdownToggle);
      tElement.append(dropdownContainer);

      return function nyaBsSelectLink ($scope, $element, $attrs, ctrls) {

        var ngCtrl = ctrls[0];
        var nyaBsSelectCtrl = ctrls[1];

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
              for(index = 0; index < modelValue.length; index++) {
                if(!contains(valuesForSelect, modelValue[index])) {
                  modelValue.splice(index, 1);
                  index--;
                }
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
            // if user specify the value attribute. we should use the value attribute
            // otherwise, use the valueIdentifier specified field in target scope

            value = getOptionValue(nyaBsOption);

            if(value) {
              if(isMultiple) {
                viewValue = Array.isArray(modelValue) ? modelValue : [];
                index = viewValue.indexOf(value);
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
              console.log(viewValue);
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
          }

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
          if(item.children().eq(0).hasClass('check-mark')) {
            // if the first child is check-mark, means the option text is text node
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
                filterOption.empty();
                filterOption.append(document.createTextNode(modelValue.length + ' items selected'));
                return;
              } else if(isMultiple && $attrs.selectedTextFormat && (match = $attrs.selectedTextFormat.match(/\s*count\s*>\s*(\d+)\s*/))) {
                count = parseInt(match[1], 10);
                if(modelValue.length > count) {
                  filterOption.empty();
                  filterOption.append(document.createTextNode(modelValue.length + ' items selected'));
                  return;
                }
              }

              for(index = 0; index < length; index++) {
                nyaBsOption = bsOptionElements.eq(index);
                if(nyaBsOption.hasClass('nya-bs-option')) {

                  value = getOptionValue(nyaBsOption);

                  if(isMultiple) {
                    if(contains(modelValue, value)) {
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

      };
    }
  };
}]);