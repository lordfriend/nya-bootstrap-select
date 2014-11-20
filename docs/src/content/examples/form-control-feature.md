#Form Control Feature

Because we don't have an form element to build a form control. Some form features which provided by angular need to be implemented specially.

Currently form control valid and disabled are supported.

###Disable a select

To disable a select. Use `disabled="true"` as an attribute on `nya-bs-select` element. the value of this attribute is a data-binding to current scope. So you can use model to control
an select being disabled or enabled. Note that `ng-disabled` are not supported.

<example>
<file name="index.html">
<form>
<button class="btn btn-default" ng-click="disable=!disable">
  {{ disable ? "Enable select" : "Disable select" }}
</button>
<ol class="nya-bs-select" ng-model="model" disabled="disable">
  <li nya-bs-option="option in options">
    <a>
      {{option}}
    </a>
  </li>
</ol>
</form>
</file>
<file name="script.js">
$scope.disable = false;
$scope.options = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Golf',
  'Hotel'
];
</file>
</example>

###ng-required

`ng-required` and `required` directive are supported. when you add one of these directives. it will check your ng-model and add `ng-valid-required` or `ng-invalid-required` class
on your `nya-bs-select` element. You need to define the css by yourself.

When selection is multiple, an empty array or undefined model is invalid. When selection is single, an undefined model is invalid.

>Note that, the `ng-valid-required` and `ng-invalid-required` class are add to the container element. but the dropdown toggle button is its child element. so you need to define a style using a descendant selector.

<example>
<file name="index.html">
<style>
form {
  margin: 20px;
  border: 1px solid;
}
form.ng-invalid-required {
  border-color: red;
}
form.ng-valid-required {
  border-color: green;
}
form.ng-valid-required .info {
  visibility: hidden;
}
form.ng-invalid-required .info {
  visibility: visible;
}
.ng-invalid-required .dropdown-toggle {
  border-color: red;
}
.ng-valid-required .dropdown-toggle {
  border-color: green;
}
</style>
<form>
  <p class="alert-danger info">please select at least one option!</p>
  <ol class="nya-bs-select" ng-model="model" required multiple>
    <li nya-bs-option="option in options">
      <a>
        {{option}}
        <span class="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  </ol>
</form>
</file>
<file name="script.js">
  $scope.options = [
    'Alpha',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Fox',
    'Golf'
  ];
</file>
</example>
