# Form Control Feature

Because we don't have an form element to build a form control. Some form features which provided by angular need to be implemented specially.

Currently form control valid and disabled are supported.

### Disable a select

To disable a select. Use `ng-disabled="true"` as an attribute on `nya-bs-select` element. the value of this attribute is a data-binding to current scope. So you can use model to control
an select being disabled or enabled. Note that in the early version `disabled` is used to support this feature, you can still use disabled but this could cause buggy in IE.

<example>
<file name="index.html">
<form>
<button class="btn btn-default" ng-click="disable=!disable">
  {{ disable ? "Enable select" : "Disable select" }}
</button>
<ol class="nya-bs-select" ng-model="model" ng-disabled="disable">
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

### ng-required

`ng-required` and `required` directive are supported. when you add one of these directives. it will check your ng-model and set its `$valid` and `$invalid` property. For details, see [ngModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController)
When selection is multiple, an empty array or undefined model is invalid. When selection is single, an undefined, empty string, NaN, null model is invalid.

When using with form or ngForm, the valid status of form is also affected by this directive.

>Note that, the `ng-valid-required` and `ng-invalid-required` class are add to the container element. but the dropdown toggle button is its child element. so you need to define a style using a descendant selector.

<example>
<file name="index.html">
<form class="form-horizontal" name="myForm">
  <div class="form-group" ng-class="{'has-error': myForm.select1.$invalid}">
    <label class="control-label col-sm-3">required example</label>
    <div class="col-sm-9">
      <ol name="select1" class="nya-bs-select" ng-model="model" required multiple>
        <li nya-bs-option="option in options">
          <a>
            {{option}}
            <span class="glyphicon glyphicon-ok check-mark"></span>
          </a>
        </li>
      </ol>
      <p class="text-danger" ng-show="myForm.select1.$invalid">Please select at least one option</p>
    </div>
  </div>
  <div class="form-group" ng-class="{'has-error': myForm.select2.$invalid}">
    <label class="control-label col-sm-3">ng-required example</label>
    <div class="col-sm-9">
      <ol name="select2" class="nya-bs-select" ng-model="model2" ng-required="select2Required">
        <li nya-bs-option="option in options">
          <a>
            {{option}}
            <span class="glyphicon glyphicon-ok check-mark"></span>
          </a>
        </li>
      </ol>
      <button class="btn btn-default" ng-click="select2Required=!select2Required" type="button">select2 required: {{select2Required}}</button>
    </div>
  </div>
</form>
<p>
  myForm.$pristine: {{!!myForm.$pristine}}
</p>
<p>
  myForm.$dirty: {{!!myForm.$dirty}}
<p>
  myForm.$valid: {{!!myForm.$valid}}
</p>
<p>
  myForm.$invalid: {{!!myForm.$invalid}}
</p>
</file>
<file name="script.js">
  $scope.select2Required = true;
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
