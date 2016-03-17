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
          deepWatched,
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

        // deepWatch will impact performance. use with caution.
        if($attr.deepWatch === 'true') {
          deepWatched = true;
          $scope.$watch(collectionExp, nyaBsOptionAction, true);
        } else {
          deepWatched = false;
          $scope.$watchCollection(collectionExp, nyaBsOptionAction);
        }

        function nyaBsOptionAction(collection) {
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

            removedClone, // removed clone node, should also remove isolateScope data as well

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
            removedClone = getBlockNodes(block.clone);
            // remove the isolateScope data to detach scope from this clone
            removedClone.removeData('isolateScope');
            removedClone.remove();
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
                // in case of the debugInfoEnable is set to false, we have to bind the scope to the clone node.
                setElementIsolateScope(clone, scope);

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

          lastBlockMap = nextBlockMap;

          nyaBsSelectCtrl.onCollectionChange(values, deepWatched);
        }
      };
    }
  }
}]);
