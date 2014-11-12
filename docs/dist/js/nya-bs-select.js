/**
 * nya-bootstrap-select v2.0.0
 * Copyright 2014 Nyasoft
 * Licensed under MIT license
 */
(function(){
  'use strict';


var uid = 0;

function nextUid() {
  return ++uid;
}

/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
  return obj && obj.window === obj;
}

/**
 * @ngdoc function
 * @name angular.isString
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value){return typeof value === 'string';}

/**
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
function isArrayLike(obj) {
  if (obj == null || isWindow(obj)) {
    return false;
  }

  var length = obj.length;

  if (obj.nodeType === 1 && length) {
    return true;
  }

  return isString(obj) || Array.isArray(obj) || length === 0 ||
    typeof length === 'number' && length > 0 && (length - 1) in obj;
}

/**
 * Creates a new object without a prototype. This object is useful for lookup without having to
 * guard against prototypically inherited properties via hasOwnProperty.
 *
 * Related micro-benchmarks:
 * - http://jsperf.com/object-create2
 * - http://jsperf.com/proto-map-lookup/2
 * - http://jsperf.com/for-in-vs-object-keys2
 *
 * @returns {Object}
 */
function createMap() {
  return Object.create(null);
}

/**
 * Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj, nextUidFn) {
  var objType = typeof obj,
    key;

  if (objType == 'function' || (objType == 'object' && obj !== null)) {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = (nextUidFn || nextUid)();
    }
  } else {
    key = obj;
  }

  return objType + ':' + key;
}

//TODO: use with caution. if an property of element in array doesn't exist in group, the resultArray may lose some element.
function sortByGroup(array ,group, property) {
  var unknownGroup = [],
    i, j,
    resultArray = [];
  for(i = 0; i < group.length; i++) {
    for(j = 0; j < array.length;j ++) {
      if(!array[j][property]) {
        unknownGroup.push(array[j]);
      } else if(array[j][property] === group[i]) {
        resultArray.push(array[j]);
      }
    }
  }

  resultArray = resultArray.concat(unknownGroup);

  return resultArray;
}

/**
 * Return the DOM siblings between the first and last node in the given array.
 * @param {Array} array like object
 * @returns {jqLite} jqLite collection containing the nodes
 */
function getBlockNodes(nodes) {
  // TODO(perf): just check if all items in `nodes` are siblings and if they are return the original
  //             collection, otherwise update the original collection.
  var node = nodes[0];
  var endNode = nodes[nodes.length - 1];
  var blockNodes = [node];

  do {
    node = node.nextSibling;
    if (!node) break;
    blockNodes.push(node);
  } while (node !== endNode);

  return angular.element(blockNodes);
}

var getBlockStart = function(block) {
  return block.clone[0];
};

var getBlockEnd = function(block) {
  return block.clone[block.clone.length - 1];
};

var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength, group) {
  // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
  scope[valueIdentifier] = value;
  if (keyIdentifier) scope[keyIdentifier] = key;
  scope.$index = index;
  scope.$first = (index === 0);
  scope.$last = (index === (arrayLength - 1));
  scope.$middle = !(scope.$first || scope.$last);
  // jshint bitwise: false
  scope.$odd = !(scope.$even = (index&1) === 0);
  // jshint bitwise: true

  if(group) {
    scope.$group = group;
  }
};

var contains = function(array, element) {
  var length = array.length,
    i;
  if(length === 0) {
    return false;
  }
  for(i = 0;i < length; i++) {
    if(deepEquals(element, array[i])) {
      return true;
    }
  }
  return false;
};

var indexOf = function(array, element) {
  var length = array.length,
    i;
  if(length === 0) {
    return -1;
  }
  for(i = 0; i < length; i++) {
    if(deepEquals(element, array[i])) {
      return i;
    }
  }
  return -1;
};

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


// map global property to local variable.
var jqLite = angular.element;

var deepEquals = angular.equals;

var deepCopy = angular.copy;

var nyaBsSelect = angular.module('nya.bootstrap.select', []);

nyaBsSelect.controller('nyaBsSelectCtrl', function(){

  var self = this;

  // keyIdentifier and valueIdentifier are set by nyaBsOption directive
  // used by nyaBsSelect directive to retrieve key and value from each nyaBsOption's child scope.
  self.keyIdentifier = null;
  self.valueIdentifier = null;

  self.isMultiple = false;

  // Should be override by nyaBsSelect directive and called by nyaBsOption directive when collection is changed.
  self.onCollectionChange = function(){};

  // for debug
  self.setId = function(id) {
    self.id = id || 'id#' + Math.floor(Math.random() * 10000);
  };

});
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

nyaBsSelect.directive('nyaBsOption', ['$parse', function($parse){

                        //00000011111111111111100000000022222222222222200000003333333333333330000000000000004444444444000000000000000000055555555550000000000000000000006666666666000000
  var BS_OPTION_REGEX = /^\s*(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/;

  return {
    restrict: 'A',
    transclude: 'element',
    priority: 1000,
    terminal: true,
    require: ['^nyaBsSelect', '^ngModel'],
    compile: function nyaBsOptionCompile (tElement, tAttrs) {

      var expression = tAttrs.nyaBsOption;
      var nyaBsOptionEndComment = document.createComment(' end nyaBsOption: ' + expression + ' ');
      var match = expression.match(BS_OPTION_REGEX);

      if(!match) {
        throw new Error('invalid expression');
      }

      // we want to keep our expression comprehensible so we don't use 'select as label for value in collection' expression.
      var valueExp = tAttrs.value,
        valueExpGetter = valueExp ? $parse(valueExp) : null;

      var valueIdentifier = match[3] || match[1],
        keyIdentifier = match[2],
        collectionExp = match[4],
        groupByExpGetter = match[5] ? $parse(match[5]) : null,
        trackByExp = match[6];

      var trackByIdArrayFn,
        trackByIdObjFn,
        trackByIdExpFn,
        trackByExpGetter;
      var hashFnLocals = {$id: hashKey};
      var groupByFn, locals = {};

      if(trackByExp) {
        trackByExpGetter = $parse(trackByExp);
      } else {
        trackByIdArrayFn = function(key, value) {
          return hashKey(value);
        };
        trackByIdObjFn = function(key) {
          return key;
        };
      }
      return function nyaBsOptionLink($scope, $element, $attr, ctrls, $transclude) {

        var nyaBsSelectCtrl = ctrls[0],
          ngCtrl = ctrls[1],
          valueExpFn,
          valueExpLocals = {};

        if(trackByExpGetter) {
          trackByIdExpFn = function(key, value, index) {
            // assign key, value, and $index to the locals so that they can be used in hash functions
            if (keyIdentifier) {
              hashFnLocals[keyIdentifier] = key;
            }
            hashFnLocals[valueIdentifier] = value;
            hashFnLocals.$index = index;
            return trackByExpGetter($scope, hashFnLocals);
          };
        }

        if(groupByExpGetter) {
          groupByFn = function(key, value) {
            if(keyIdentifier) {
              locals[keyIdentifier] = key;
            }
            locals[valueIdentifier] = value;
            return groupByExpGetter($scope, locals);
          }
        }

        // set keyIdentifier and valueIdentifier property of nyaBsSelectCtrl
        if(keyIdentifier) {
          nyaBsSelectCtrl.keyIdentifier = keyIdentifier;
        }
        if(valueIdentifier) {
          nyaBsSelectCtrl.valueIdentifier = valueIdentifier;
        }

        if(valueExpGetter) {
          nyaBsSelectCtrl.valueExp = valueExp;
          valueExpFn = function(key, value) {
            if(keyIdentifier) {
              valueExpLocals[keyIdentifier] = key;
            }
            valueExpLocals[valueIdentifier] = value;
            return valueExpGetter($scope, valueExpLocals);
          }

        }


        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        //
        // We are using no-proto object so that we don't need to guard against inherited props via
        // hasOwnProperty.
        var lastBlockMap = createMap();

        $scope.$watchCollection(collectionExp, function nyaBsOptionAction(collection) {
          console.log(nyaBsSelectCtrl.id + ' option watch start', ' ngModel: ', ngCtrl.$modelValue);
          var index,

            previousNode = $element[0],     // node that cloned nodes should be inserted after
          // initialized to the comment node anchor

            key, value,
            trackById,
            trackByIdFn,
            collectionKeys,
            collectionLength,
          // Same as lastBlockMap but it has the current state. It will become the
          // lastBlockMap on the next iteration.
            nextBlockMap = createMap(),
            nextBlockOrder,
            block,
            groupName,
            nextNode,
            group,
            lastGroup,

            values = [],
            valueObj; // the collection value

          if(groupByFn) {
            group = [];
          }

          if(isArrayLike(collection)) {
            collectionKeys = collection;
            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
          } else {
            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            collectionKeys = [];
            for (var itemKey in collection) {
              if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) != '$') {
                collectionKeys.push(itemKey);
              }
            }
            collectionKeys.sort();
          }
          collectionLength = collectionKeys.length;
          nextBlockOrder = new Array(collectionLength);

          for(index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            trackById = trackByIdFn(key, value, index);

            // copy the value with scope like structure to notify the select directive.
            valueObj = {};
            if(keyIdentifier) {
              valueObj[keyIdentifier] = key;
            }

            valueObj[valueIdentifier] = value;
            values.push(valueObj);

            if(groupByFn) {
              groupName = groupByFn(key, value);
              if(group.indexOf(groupName) === -1 && groupName) {
                group.push(groupName);
              }
            }

            if(lastBlockMap[trackById]) {
              // found previously seen block
              block = lastBlockMap[trackById];
              delete lastBlockMap[trackById];

              // must update block here because some data we stored may change.
              if(groupByFn) {
                block.group = groupName;
              }
              block.key = key;
              block.value = value;

              nextBlockMap[trackById] = block;
              nextBlockOrder[index] = block;
            } else if(nextBlockMap[trackById]) {
              //if collision detected. restore lastBlockMap and throw an error
              nextBlockOrder.forEach(function(block) {
                if(block && block.scope) {
                  lastBlockMap[block.id] = block;
                }
              });
              throw new Error("Duplicates in a select are not allowed. Use 'track by' expression to specify unique keys.");
            } else {
              // new never before seen block
              nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined, key: key, value: value};
              nextBlockMap[trackById] = true;
              if(groupName) {
                nextBlockOrder[index].group = groupName;
              }
            }
          }

          // only resort nextBlockOrder when group found
          if(group && group.length > 0) {

            nextBlockOrder = sortByGroup(nextBlockOrder, group, 'group');
          }

          // remove DOM nodes
          for( var blockKey in lastBlockMap) {
            block = lastBlockMap[blockKey];
            getBlockNodes(block.clone).remove();
            block.scope.$destroy();
          }

          for(index = 0; index < collectionLength; index++) {
            block = nextBlockOrder[index];
            if(block.scope) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element

              nextNode = previousNode;
              if(getBlockStart(block) != nextNode) {
                jqLite(previousNode).after(block.clone);
              }
              previousNode = getBlockEnd(block);

              updateScope(block.scope, index, valueIdentifier, block.value, keyIdentifier, block.key, collectionLength, block.group);
            } else {
              $transclude(function nyaBsOptionTransclude(clone, scope) {
                block.scope = scope;

                var endNode = nyaBsOptionEndComment.cloneNode(false);
                clone[clone.length++] = endNode;

                jqLite(previousNode).after(clone);

                // add nya-bs-option class

                clone.addClass('nya-bs-option');

                // for newly created item we need to ensure its selected status from the model value.
                if(valueExpFn) {
                  value = valueExpFn(block.key, block.value);
                } else {
                  value = block.value || block.key;
                }

                if(nyaBsSelectCtrl.isMultiple) {
                  if(Array.isArray(ngCtrl.$modelValue) && contains(ngCtrl.$modelValue, value)) {
                    clone.addClass('selected');
                  }
                } else {
                  if(deepEquals(value, ngCtrl.$modelValue)) {
                    clone.addClass('selected');
                  }
                }

                previousNode = endNode;
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block.clone = clone;
                nextBlockMap[block.id] = block;
                updateScope(block.scope, index, valueIdentifier, block.value, keyIdentifier, block.key, collectionLength, block.group);
              });

            }

            // we need to mark the first item of a group
            if(group) {
              if(!lastGroup || lastGroup !== block.group) {
                block.clone.addClass('first-in-group');
              } else {
                block.clone.removeClass('first-in-group');
              }

              lastGroup = block.group;

              // add special class for indent
              block.clone.addClass('group-item');
            }
          }

          console.log(nyaBsSelectCtrl.id + ' option watch finished');

          lastBlockMap = nextBlockMap;

          nyaBsSelectCtrl.onCollectionChange(values);
        });
      };
    }
  }
}]);

})();