# Basic Usage

nya-bootstrap-select is an directive combination. The main directive is `nya-bs-select`. This directive maintain the value of ng-model and dropdown and toggle button presentation.
You need to add your options using `<li>` element as children of `nya-bs-select`. You can either add static options or generate options using `nya-bs-option`.

An option is, in fact, an dropdown list element. So you need to add an anchor element as a direct child of `<li>` element, then add your own content as the menu item.

To make multiple selection. just add `multiple` into `nya-bs-select` element.

### Static Options

Static Options don't change. you need to add `nya-bs-option` class to each of your `<li>` element to make them as options. Beside, you also need to use `data-value` attribute to specify the value of each option.

<example>
<file name="index.html">
<p class="alert-info">Single Selection, model is <span>{{model}}</span></p>
<ol id="singleSelection" class="nya-bs-select" ng-model="model">
  <li class="nya-bs-option" data-value="a">
    <a>Alpha</a>
  </li>
  <li class="nya-bs-option" data-value="b">
    <a>Bravo</a>
  </li>
  <li class="nya-bs-option" data-value="c">
    <a>Charlie</a>
  </li>
</ol>
<p class="alert-info">Multiple Selection, model2 is <span>{{model2}}</span></p>
<ol id="multipleSelection" class="nya-bs-select" ng-model="model2" multiple>
  <li class="nya-bs-option" data-value="a">
    <a>Alpha</a>
  </li>
  <li class="nya-bs-option" data-value="b">
    <a>Bravo</a>
  </li>
  <li class="nya-bs-option" data-value="c">
    <a>Charlie</a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.model2 = ['b', 'c'];
</file>
</example>


### Dynamic Options

If you want to generate options from a collection, `nya-bs-option` directive is right for you. Just think it is an alias of `ng-repeat`, with some tweak and magic to support our options and groups.

This example demonstrate how how to use `nya-bs-option` directive to generate options from collections.

<example>
<file name="index.html">
<form class="form-inline">
  <p class="alert-info"> You have select {{dynModel}}</p>
  <p class="alert-info"> options is {{options}}</p>
  <button class="btn btn-default" ng-click="changeGroups('options')">Change Option</button>
  <ol class="nya-bs-select" ng-model="dynModel">
    <li nya-bs-option="option in options">
      <a>
        {{option.name}}
      </a>
    </li>
  </ol>
</form>
</file>
<file name="script.js">
var options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
  'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
  'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
  'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
];
// randomly generate options from options array
$scope.changeGroups = function(targetOptions) {
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

  $scope[targetOptions] = newOptionArray;
};


$scope.changeGroups('options');

</file>
</example>
