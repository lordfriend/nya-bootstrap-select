
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

var setElementIsolateScope = function(element, scope) {
  element.data('isolateScope', scope);
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

// work with node element
var hasClass = function(element, className) {
  var classList = getClassList(element);
  return classList.indexOf(className) !== -1;
};

// query children by class(one or more)
var queryChildren = function(element, classList) {
  var children = element.children(),
    length = children.length,
    child,
    valid,
    classes;
  if(length > 0) {
    for(var i = 0; i < length; i++) {
      child = children.eq(i);
      valid = true;
      classes = getClassList(child[0]);
      if(classes.length > 0) {
        for(var j = 0; j < classList.length; j++) {
          if(classes.indexOf(classList[j]) === -1) {
            valid = false;
            break;
          }
        }
      }
      if(valid) {
        return child;
      }
    }
  }
  return [];
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

function sibling( cur, dir ) {
  while ( (cur = cur[dir]) && cur.nodeType !== 1) {}
  return cur;
}


// map global property to local variable.
var jqLite = angular.element;

var deepEquals = angular.equals;

var deepCopy = angular.copy;

var extend = angular.extend;

var nyaBsSelect = angular.module('nya.bootstrap.select', []);
