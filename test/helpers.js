
var hasGroup = function(array) {
  return array.every(function(element) {
    return element.hasOwnProperty('group');
  });
};

var limitEquals = function(o1, o2, properties) {
  return properties.every(function (prop) {
    return angular.equals(o1[prop], o2[prop]);
  });
};

/**
 * get the index of object in array. you can limit the equality check properties.
 * @param object ,{Object} the object which you want to search in array
 * @param array ,{Array} target array which you want search in.
 * @param properties ,(Optional){Array} the you can specify limited properties to check two elements equality
 * @returns {number}
 */
var indexOfWithProperty = function(object, array, properties) {
  var index = -1;
  for(var i = 0; i < array.length; i++) {
    var isEqual = false;

    if(properties) {
      isEqual = limitEquals(object, array[i], properties);
    } else {
      isEqual = angular.equals(object, array[i]);
    }

    if(isEqual) {
      index = i;
      break;
    }
  }
  return index;
};

var existInArray = function(value, array) {
  return array.some(function(element){return angular.equals(element, value);});
};

var changeGroups = function(options) {
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

  return newOptionArray;
};

var changeObject = function(options) {
  var length = Math.max(Math.min(Math.floor(Math.random() * options.length), 10), 3);
  var newOptions = {};
  var groupCount = Math.max(Math.floor(Math.random() * length / 2), 2);
  for(var i = 0; i < length; i++) {
    var newValue = options[Math.floor(Math.random() * options.length)];
    var group = Math.max(Math.ceil(Math.random() * groupCount), 1);
    newOptions[newValue] = {
      name: newValue.toLowerCase(),
      group: 'Group' + group
    };
  }
  return newOptions;
};

var changeModel = function(options) {
  var length = Math.max(Math.floor(Math.random() * options.length), 1);
  var newModel = [];
  for(var i = 0; i < length; i++) {
    var newValue = options[Math.floor(Math.random() * options.length)];
    if(newModel.length === 0 || !existInArray(newValue, newModel)) {
      newModel.push(newValue);
    }
  }
  return newModel;
};

var changeModelOfObject = function(options) {
  var keys = Object.keys(options);
  var length = Math.floor(Math.random() * keys.length);
  var newModel = [];
  var keyModel = {};
  for(var i = 0; i < length; i++) {
    keyModel[keys[Math.floor(Math.random() * keys.length)]] = true;
  }
  angular.forEach(keyModel, function(value, key) {
    newModel.push(options[key]);
  });
  return newModel;
};

beforeEach(function() {
  this.addMatchers({

    // jasmine matcher for expecting an element to have a css class
    // https://github.com/angular/angular.js/blob/master/test/matchers.js
    toHaveClass: function(cls) {
      this.message = function() {
        return "Expected '" + angular.mock.dump(this.actual) + "' to have class '" + cls + "'.";
      };

      return this.actual.hasClass(cls);
    },
//    toHaveAttribute: function(cls) {
//      this.message = function() {
//        return "Expected '" + angular.mock.dump(this.actual) + "' to have attribute '" + cls + "'.";
//      };
//      return this.actual.is('['+cls+']');
//    },
    toContains: function(value) {
      this.message = function() {
        return "Expected '" + angular.mock.dump(this.actual) + "' to contains '" + angular.mock.dump(value) + "'.";
      };
      return existInArray(value, this.actual);
    },
    toDeepEqual: function(value) {
      this.message = function() {
        return "Expected '" + angular.mock.dump(this.actual) + "' to deep equal '" + angular.mock.dump(value) + "'.";
      };
      return angular.equals(this.actual, value);
    }
  });
});
