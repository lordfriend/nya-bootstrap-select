# Alternative Display

This is a feature borrowed from Bootstrap-select. Add a `title` attribute to each `nya-bs-option`, when an option is selected, the `title` value will be displayed in dropdown-toggle button instead of the content of option.

By the way, `title` attribute can also be used on `nya-bs-select` directive. It will replace the default no select text `Nothing selected`.

<example>
<file name="index.html">
<form class="form-inline">
  <!-- title on nya-bs-select -->
  <ol class="nya-bs-select" ng-model="model" title="Choose one of the following" multiple>
    <li nya-bs-option="option in options">
      <a>
        {{ option.name }}
        <span class="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  </ol>
  <!-- title on nya-bs-option -->
  <ol class="nya-bs-select" ng-model="model2">
    <li nya-bs-option="option in options" title="{{option.title}}">
      <a>
        {{ option.name }}
        <span class="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  </ol>
</form>
</file>
<file name="script.js">
$scope.options = [
  {name: 'apple', title: 'c1: apple'},
  {name: 'orange', title: 'c2: orange'},
  {name: 'berry', title: 'c3: berry'}
];
$scope.model2 = {name: 'berry', title: 'c3: berry'};
</file>
</example>
