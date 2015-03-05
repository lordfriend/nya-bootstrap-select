nyaBsSelect.directive('nyaBsSelect', ['$parse', '$document', '$timeout', 'nyaBsConfig', function ($parse, $document, $timeout, nyaBsConfig) {

  var DEFAULT_NONE_SELECTION = 'Nothing selected';

  var DROPDOWN_TOGGLE = '<button class="btn btn-default dropdown-toggle" type="button">' +
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
      console.log(tElement.attr('id') + ' compiled');

      tElement.addClass('btn-group');

      var getDefaultNoneSelectionContent = function() {
        // text node or jqLite element.
        var content;

        if(tAttrs.titleTpl) {
          // use title-tpl attribute value.
          content = jqLite(tAttrs.titleTpl);
        } else if(tAttrs.title) {
          // use title attribute value.
          content = document.createTextNode(tAttrs.title);
        } else if(localizedText.defaultNoneSelectionTpl){
          // use localized text template.
          content = jqLite(localizedText.defaultNoneSelectionTpl);
        } else if(localizedText.defaultNoneSelection) {
          // use localized text.
          content = document.createTextNode(localizedText.defaultNoneSelection);
        } else {
          // use default.
          content = document.createTextNode(DEFAULT_NONE_SELECTION);
        }
        return content;
      };

      var options = tElement.children(),
        dropdownToggle = jqLite(DROPDOWN_TOGGLE),
        dropdownContainer = jqLite(DROPDOWN_CONTAINER),
        dropdownMenu = jqLite(DROPDOWN_MENU),
        searchBox,
        noSearchResult,
        classList,
        length,
        index,
        liElement,
        localizedText = nyaBsConfig;

      classList = getClassList(tElement[0]);
      classList.forEach(function(className) {
        if(/btn-(?:primary|info|success|warning|danger|inverse)/.test(className)) {
          tElement.removeClass(className);
          dropdownToggle.removeClass('btn-default');
          dropdownToggle.addClass(className);
        }

        //if(/btn-(?:lg|sm|xs)/.test(className)) {
        //  tElement.removeClass(className);
        //  dropdownToggle.addClass(className);
        //}

        if(className === 'form-control') {
          dropdownToggle.addClass(className);
        }
      });

      dropdownMenu.append(options);

      // add tabindex to children anchor elements if not present.
      // tabindex attribute will give an anchor element ability to be get focused.
      length = options.length;
      for(index = 0; index < length; index++) {
        liElement = options.eq(index);
        if(liElement.hasClass('nya-bs-option') || liElement.attr('nya-bs-option')) {
          liElement.find('a').attr('tabindex', '0');
        }
      }

      if(tAttrs.liveSearch === 'true') {
        searchBox = jqLite(SEARCH_BOX);

        // set localized text
        if(localizedText.noSearchResultTpl) {
          NO_SEARCH_RESULT = NO_SEARCH_RESULT.replace('NO SEARCH RESULT', localizedText.noSearchResultTpl);
        } else if(localizedText.noSearchResult) {
          NO_SEARCH_RESULT = NO_SEARCH_RESULT.replace('NO SEARCH RESULT', localizedText.noSearchResult);
        }

        noSearchResult = jqLite(NO_SEARCH_RESULT);
        dropdownContainer.append(searchBox);
        dropdownMenu.append(noSearchResult);
      }

      // set default none selection text
      dropdownToggle.children().eq(0).append(getDefaultNoneSelectionContent());

      dropdownContainer.append(dropdownMenu);

      tElement.append(dropdownToggle);
      tElement.append(dropdownContainer);

      return function nyaBsSelectLink ($scope, $element, $attrs, ctrls) {
        console.log($element.attr('id') + ' linked');
        var ngCtrl = ctrls[0],
          nyaBsSelectCtrl = ctrls[1],
          liHeight,
          isDisabled = false,
          previousTabIndex,
          valueExpFn,
          valueExpGetter = $parse(nyaBsSelectCtrl.valueExp),
          isMultiple = typeof $attrs.multiple !== 'undefined';

        // find element from current $element root. because the compiled element may be detached from DOM tree by ng-if or ng-switch.
        var dropdownToggle = queryChildren($element, ['dropdown-toggle']),
          dropdownContainer = dropdownToggle.next(),
          dropdownMenu = queryChildren(dropdownContainer, ['dropdown-menu', 'inner']),
          searchBox = queryChildren(dropdownContainer, ['bs-searchbox']),
          noSearchResult = queryChildren(dropdownMenu, ['no-search-result']);

        if(nyaBsSelectCtrl.valueExp) {
          valueExpFn = function(scope, locals) {
            return valueExpGetter(scope, locals);
          };
        }

        // for debug
        nyaBsSelectCtrl.setId($element.attr('id'));

        if (isMultiple) {
          nyaBsSelectCtrl.isMultiple = true;

          // required validator
          ngCtrl.$isEmpty = function(value) {
            return !value || value.length === 0;
          };
        }
        if(typeof $attrs.disabled !== 'undefined') {
          $scope.$watch($attrs.disabled, function(disabled){
            if(!!disabled) {
              dropdownToggle.addClass('disabled');
              previousTabIndex = dropdownToggle.attr('tabindex');
              dropdownToggle.attr('tabindex', '-1');
              isDisabled = true;
            } else {
              dropdownToggle.removeClass('disabled');
              if(previousTabIndex) {
                dropdownToggle.attr('tabindex', previousTabIndex);
              } else {
                dropdownToggle.removeAttr('tabindex');
              }
              isDisabled = false;
            }
          });
        }

        /**
         * Do some check on modelValue. remove no existing value
         * @param values
         */
        nyaBsSelectCtrl.onCollectionChange = function (values) {
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
          if(isDisabled) {
            return;
          }

          if(jqLite(event.target).hasClass('dropdown-header')) {
            return;
          }
          var nyaBsOptionNode = filterTarget(event.target, dropdownMenu[0], 'nya-bs-option'),
            nyaBsOption;

          if(nyaBsOptionNode !== null) {
            nyaBsOption = jqLite(nyaBsOptionNode);
            if(nyaBsOption.hasClass('disabled')) {
              return;
            }
            selectOption(nyaBsOption);
          }
        });

        // if click the outside of dropdown menu, close the dropdown menu
        $document.on('click', function(event) {
          if(filterTarget(event.target, $element.parent()[0], $element[0]) === null) {
            if($element.hasClass('open')) {
              $element.triggerHandler('blur');
            }
            $element.removeClass('open');
          }
        });
        console.log(dropdownToggle[0]==$element.find('button').eq(0)[0]);

        dropdownToggle.on('blur', function() {
          if(!$element.hasClass('open')) {
            $element.triggerHandler('blur');
          }
        });
        dropdownToggle.on('click', function() {
          var nyaBsOptionNode;
          $element.toggleClass('open');
          if($element.hasClass('open') && typeof liHeight === 'undefined') {
            calcMenuSize();
          }
          if($attrs.liveSearch === 'true' && $element.hasClass('open')) {
            searchBox.children().eq(0)[0].focus();
            nyaBsOptionNode = findFocus(true);
            if(nyaBsOptionNode) {
              dropdownMenu.children().removeClass('active');
              jqLite(nyaBsOptionNode).addClass('active');
            }
          } else if($element.hasClass('open')) {
            nyaBsOptionNode = findFocus(true);
            if(nyaBsOptionNode) {
              setFocus(nyaBsOptionNode);
            }
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
              option,
              nyaBsOptionNode;

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

            nyaBsOptionNode = findFocus(true);

            if(nyaBsOptionNode) {
              options.removeClass('active');
              jqLite(nyaBsOptionNode).addClass('active');
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

        // simple keyboard support
        $element.on('keydown', function(event){
          var keyCode = event.keyCode;

          if(keyCode !== 27 && keyCode !== 13 && keyCode !== 38 && keyCode !== 40) {
            // we only handle special keys. don't waste time to traverse the dom tree.
            return;
          }

          // prevent a click event to be fired.
          event.preventDefault();
          if(isDisabled) {
            event.stopPropagation();
            return;
          }
          var toggleButton = filterTarget(event.target, $element[0], dropdownToggle[0]),
            menuContainer,
            searchBoxContainer,
            liElement,
            nyaBsOptionNode;

          if($attrs.liveSearch === 'true') {
            searchBoxContainer = filterTarget(event.target, $element[0], searchBox[0]);
          } else {
            menuContainer = filterTarget(event.target, $element[0], dropdownContainer[0])
          }

          if(toggleButton) {
            console.log('toggleButton');

            // press enter to active dropdown
            if((keyCode === 13 || keyCode === 38 || keyCode === 40) && !$element.hasClass('open')) {

              event.stopPropagation();

              $element.addClass('open');

              // calculate menu size
              if(typeof liHeight === 'undefined') {
                calcMenuSize();
              }

              // if live search enabled. give focus to search box.
              if($attrs.liveSearch === 'true') {
                searchBox.children().eq(0)[0].focus();
                // find the focusable node but we will use active
                nyaBsOptionNode = findFocus(true);
                if(nyaBsOptionNode) {
                  // remove previous active state
                  dropdownMenu.children().removeClass('active');
                  // set active to first focusable element
                  jqLite(nyaBsOptionNode).addClass('active');
                }
              } else {
                // otherwise, give focus to first menu item.
                nyaBsOptionNode = findFocus(true);
                if(nyaBsOptionNode) {
                  setFocus(nyaBsOptionNode);
                }
              }
            }

            // press enter or escape to de-active dropdown
            //if((keyCode === 13 || keyCode === 27) && $element.hasClass('open')) {
            //  $element.removeClass('open');
            //  event.stopPropagation();
            //}
          } else if(menuContainer) {

            if(keyCode === 27) {
              // escape pressed
              dropdownToggle[0].focus();
              if($element.hasClass('open')) {
                $element.triggerHandler('blur');
              }
              $element.removeClass('open');
              event.stopPropagation();

            } else if(keyCode === 38) {
              event.stopPropagation();
              // up arrow key
              nyaBsOptionNode = findNextFocus(event.target.parentNode, 'previousSibling');
              if(nyaBsOptionNode) {
                setFocus(nyaBsOptionNode);
              } else {
                nyaBsOptionNode = findFocus(false);
                if(nyaBsOptionNode) {
                  setFocus(nyaBsOptionNode);
                }
              }
            } else if(keyCode === 40) {
              event.stopPropagation();
              // down arrow key
              nyaBsOptionNode = findNextFocus(event.target.parentNode, 'nextSibling');
              if(nyaBsOptionNode) {
                setFocus(nyaBsOptionNode);
              } else {
                nyaBsOptionNode = findFocus(true);
                if(nyaBsOptionNode) {
                  setFocus(nyaBsOptionNode);
                }
              }
            } else if(keyCode === 13) {
              event.stopPropagation();
              // enter pressed
              liElement = jqLite(event.target.parentNode);
              if(liElement.hasClass('nya-bs-option')) {
                selectOption(liElement);
                if(!isMultiple) {
                  dropdownToggle[0].focus();
                }
              }
            }
          } else if(searchBoxContainer) {
            if(keyCode === 27) {
              dropdownToggle[0].focus();
              $element.removeClass('open');
              event.stopPropagation();
            } else if(keyCode === 38) {
              // up
              event.stopPropagation();

              liElement = findActive();
              if(liElement) {
                nyaBsOptionNode = findNextFocus(liElement[0], 'previousSibling');
                if(nyaBsOptionNode) {
                  liElement.removeClass('active');
                  jqLite(nyaBsOptionNode).addClass('active');
                } else {
                  nyaBsOptionNode = findFocus(false);
                  if(nyaBsOptionNode) {
                    liElement.removeClass('active');
                    jqLite(nyaBsOptionNode).addClass('active');
                  }
                }
              }

            } else if(keyCode === 40) {
              // down
              event.stopPropagation();

              liElement = findActive();
              if(liElement) {
                nyaBsOptionNode = findNextFocus(liElement[0], 'nextSibling');
                if(nyaBsOptionNode) {
                  liElement.removeClass('active');
                  jqLite(nyaBsOptionNode).addClass('active');
                } else {
                  nyaBsOptionNode = findFocus(true);
                  if(nyaBsOptionNode) {
                    liElement.removeClass('active');
                    jqLite(nyaBsOptionNode).addClass('active');
                  }
                }
              }
            } else if(keyCode === 13) {
              // select an option.
              liElement = findActive();
              if(liElement) {
                selectOption(liElement);
                if(!isMultiple) {
                  dropdownToggle[0].focus();
                }
              }
            }
          }
        });

        function findActive() {
          var list = dropdownMenu.children(),
            i, liElement,
            length = list.length;
          for(i = 0; i < length; i++) {
            liElement = list.eq(i);
            if(liElement.hasClass('active') && liElement.hasClass('nya-bs-option')) {
              return liElement;
            }
          }
          return null;
        }

        /**
         * setFocus on a nya-bs-option element. it actually set focus on its child anchor element.
         * @param elem a nya-bs-option element.
         */
        function setFocus(elem) {
          var childList = elem.childNodes,
            length = childList.length,
            child;
          for(var i = 0; i < length; i++) {
            child = childList[i];
            if(child.nodeType === 1 && child.tagName.toLowerCase() === 'a') {
              child.focus();
              break;
            }
          }
        }

        function findFocus(fromFirst) {
          var firstLiElement;
          if(fromFirst) {
            firstLiElement = dropdownMenu.children().eq(0);
          } else {
            firstLiElement = dropdownMenu.children().eq(dropdownMenu.children().length - 1);
          }

          // focus on selected element
          for(var i = 0; i < dropdownMenu.children().length; i++) {
            if(dropdownMenu.children().eq(i).hasClass('selected')) {
              return dropdownMenu.children().eq(i)[0];
            }
          }

          if(firstLiElement.hasClass('nya-bs-option') && !firstLiElement.hasClass('disabled') && !firstLiElement.hasClass('not-match')) {
            return firstLiElement[0];
          } else {
            if(fromFirst) {
              return findNextFocus(firstLiElement[0], 'nextSibling');
            } else {
              return findNextFocus(firstLiElement[0], 'previousSibling');
            }
          }
        }

        /**
         * find next focusable element on direction
         * @param from the element traversed from
         * @param direction can be 'nextSibling' or 'previousSibling'
         * @returns the element if found, otherwise return null.
         */
        function findNextFocus(from, direction) {
          if(from && !hasClass(from, 'nya-bs-option')) {
            return;
          }
          var next = from;
          while ((next = sibling(next, direction)) && next.nodeType) {
            if(hasClass(next,'nya-bs-option') && !hasClass(next, 'disabled') && !hasClass(next, 'not-match')) {
              return next
            }
          }
          return null;
        }

        /**
         * select an option represented by nyaBsOption argument. Get the option's value and update model.
         * if isMultiple = true, doesn't close dropdown menu. otherwise close the menu.
         * @param nyaBsOption the jqLite wrapped `nya-bs-option` element.
         */
        function selectOption(nyaBsOption) {
          var value,
            viewValue,
            modelValue = ngCtrl.$modelValue,
            index;
          // if user specify the value attribute. we should use the value attribute
          // otherwise, use the valueIdentifier specified field in target scope

          value = getOptionValue(nyaBsOption);

          if(typeof value !== 'undefined') {
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
          }
          // update view value regardless
          ngCtrl.$setViewValue(viewValue);
          $scope.$digest();

          if(!isMultiple) {
            // in single selection mode. close the dropdown menu
            if($element.hasClass('open')) {
              $element.triggerHandler('blur');
            }
            $element.removeClass('open');
          }
          updateButtonContent();
        }

        /**
         * get a value of current nyaBsOption. according to different setting.
         * - if `nya-bs-option` directive is used to populate options and a `value` attribute is specified. use expression of the attribute value.
         * - if `nya-bs-option` directive is used to populate options and no other settings, use the valueIdentifier or keyIdentifier to retrieve value from scope of current nyaBsOption.
         * - if `nya-bs-option` class is used on static options. use literal value of the `value` attribute.
         * @param nyaBsOption a jqLite wrapped `nya-bs-option` element
         */
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
          $element.triggerHandler('change');

          var filterOption = dropdownToggle.children().eq(0);
          if(typeof modelValue === 'undefined') {
            /**
             * Select empty option when model is undefined.
             */
            filterOption.empty();
            filterOption.append(getDefaultNoneSelectionContent());
            return;
          }
          if(isMultiple && modelValue.length === 0) {
            filterOption.empty();
            filterOption.append(getDefaultNoneSelectionContent());
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
                if ( $attrs.countSelectedText ) {
                  filterOption.append(document.createTextNode($attrs.countSelectedText));
                } else if(localizedText.numberItemSelectedTpl) {
                  filterOption.append(jqLite(localizedText.numberItemSelectedTpl.replace('%d', modelValue.length)));
                } else if(localizedText.numberItemSelected) {
                  filterOption.append(document.createTextNode(localizedText.numberItemSelected.replace('%d', modelValue.length)));
                } else {
                  filterOption.append(document.createTextNode(modelValue.length + ' items selected'));
                }
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
                filterOption.empty();
                filterOption.append(getDefaultNoneSelectionContent());
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
