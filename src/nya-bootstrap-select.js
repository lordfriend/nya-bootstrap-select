/**
 * @license nya-bootstrap-select v2.0.0+alpha001
 * Copyright 2014 nyasoft
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

  //TODO: have a bug, may lost element in array
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

  // map global property to local variable.
  var jqLite = angular.element;

  angular.module('nya.bootstrap.select',[])
    .controller('nyaBsSelectCtrl', ['$scope', function($scope){
      var self = this;

    }])
    .directive('nyaBsSelect', ['$parse', function ($parse) {

      var DROPDOWN_TOGGLE = '<button class="btn dropdown-toggle">' +
        '<span class="pull-left filter-option"></span>' +
        '<span class="caret"></span>' +
        '</button>';

      var DROPDOWN_MENU = '<ul class="dropdown-menu-no-style"></ul>';

      return {
        restrict: 'ECA',
        scope: true,
        require: ['ngModel', 'nyaBsSelect'],
        controller: 'nyaBsSelectCtrl',
        compile: function(tElement, tAttrs){
          tElement.addClass('btn-group');
          var options = tElement.children().detach();
          var dropdownToggle = jqLite(DROPDOWN_TOGGLE);
          var dropdownMenu = jqLite(DROPDOWN_MENU);
          dropdownMenu.append(options);
          tElement.append(dropdownToggle);
          tElement.append(dropdownMenu);
          return function(scope, element, attrs, ctrls) {
            var BS_ATTR = ['container', 'countSelectedText', 'dropupAuto', 'header', 'hideDisabled', 'selectedTextFormat', 'size', 'showSubtext', 'showIcon', 'showContent', 'style', 'title', 'width', 'disabled'];
            var ngCtrl = ctrls[0];
            var nyaBsSelectCtrl = ctrls[1];
            scope.$watch(attrs.bsOptions, function(options) {
              if(angular.isUndefined(options)) {
                return;
              }
              nyaBsSelectCtrl.bsOptions = options;
            }, true);
          };
        }
      };
    }])
    .directive('nyaBsOption', ['$parse', function($parse){

                            //00000011111111111111100000000022222222222222200000003333333333333330000000000000004444444444000000000000000000055555555550000000000000000000006666666666000000
      var BS_OPTION_REGEX = /^\s*(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/;

      return {
        restrict: 'A',
        transclude: 'element',
        priority: 1000,
        terminal: true,
        require: '^nyaBsSelect',
        compile: function nyaBsOptionCompile (tElement, tAttrs) {
          var expression = tAttrs.nyaBsOption;
          var nyaBsOptionEndComment = document.createComment(' end nyaBsOption: ' + expression + ' ');
          var match = expression.match(BS_OPTION_REGEX);

          if(!match) {
            throw new Error('invalid expression');
          }

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
          return function nyaBsOptionLink($scope, $element, $attr, ctrl, $transclude) {
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

            // Store a list of elements from previous run. This is a hash where key is the item from the
            // iterator, and the value is objects with following properties.
            //   - scope: bound scope
            //   - element: previous element.
            //   - index: position
            //
            // We are using no-proto object so that we don't need to guard against inherited props via
            // hasOwnProperty.
            var lastBlockMap = createMap();

            $scope.$watch(collectionExp, function nyaBsOptionAction(collection) {
              var index, length,

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
                group;

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
                console.log('trackById: ', trackById);
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
                  nextBlockMap[trackById] = block;
                  nextBlockOrder[index] = block
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
              console.log('nextBlockOrder: ', nextBlockOrder);
              // only resort nextBlockOrder when group found
              if(group && group.length > 0) {

                nextBlockOrder = sortByGroup(nextBlockOrder, group, 'group');
              }

              console.log('nextBlockOrder: ', nextBlockOrder, 'collectionLength: ', collectionLength);
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

                    previousNode = endNode;
                    // Note: We only need the first/last node of the cloned nodes.
                    // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                    // by a directive with templateUrl when its template arrives.
                    block.clone = clone;
                    nextBlockMap[block.id] = block;
                    updateScope(block.scope, index, valueIdentifier, block.value, keyIdentifier, block.key, collectionLength, block.group);
                  });
                }
              }
              lastBlockMap = nextBlockMap;
            });
          };
        }
      }
    }]);

})();
