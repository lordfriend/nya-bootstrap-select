# Layout And Styles

nya-bootstrap-select is a Bootstrap component. Bootstrap 3's grid layout class `col-*` and button style class `btn-*` are fully supported. so is the `form-control` class.

### Layout

Just add `col-*`, `form-control` on `nya-bs-select` element to control your select size.

>Currently. The Bootstrap-select feature **data-width** is not supported. 

<example>
<file name="index.html">
<form>
  <div class="form-group">
    <label class="col-sm-3 control-label" for="form-control-example">form control example</label>
    <div class="col-sm-9">
      <ol class="nya-bs-select form-control" ng-model="model1" id="form-control-example">
        <li nya-bs-option="option in options">
          <a>
            {{option}}
            <span class="glyphicon glyphicon-ok check-mark"></span>
          </a>
        </li>
      </ol>
    </div>
  </div>
</form>
<p>col-* example</p>
<ol class="nya-bs-select col-sm-2" ng-model="model2">
  <li nya-bs-option="option in options">
    <a>
      {{option}}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<ol class="nya-bs-select col-sm-4" ng-model="model3">
  <li nya-bs-option="option in options">
    <a>
      {{option}}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<ol class="nya-bs-select col-sm-6" ng-model="model4">
  <li nya-bs-option="option in options">
    <a>
      {{option}}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.options = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Golf',
  'Hotel',
  'Juliet',
  'Kilo',
  'Lima'
];
</file>
</example>

### Styles

These Button classes are supported: `btn-primary`, `btn-success`, `btn-info`, `btn-warning`, `btn-danger`.

<example>
<file name="index.html">
<form class="form-inline">
  <ol class="nya-bs-select btn-primary" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
  <ol class="nya-bs-select btn-success" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
  <ol class="nya-bs-select btn-info" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
  <ol class="nya-bs-select btn-warning" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
  <ol class="nya-bs-select btn-danger" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
</form>
</file>
<file name="script.js">
$scope.staticModel2 = 'a';
</file>
</example>

### Button Sizes

To get larger or smaller dropdown button, Add `.btn-lg`, `.btn-sm` or `.btn-xs` to `nyBsSelect` Directive

NOTE: You must never use `form-control` class with the button size class
<example>
<file name="index.html">
<p>
  <ol class="nya-bs-select btn-lg" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
</p>
<p>
  <ol class="nya-bs-select" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
</p>
<p>
  <ol class="nya-bs-select btn-sm" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
</p>
<p>
  <ol class="nya-bs-select btn-xs" ng-model="staticModel2">
    <li class="nya-bs-option" value="a"><a>Alpha<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="b"><a>Bravo<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
    <li class="nya-bs-option" value="c"><a>Charlie<span class="glyphicon glyphicon-ok check-mark"></span></a></li>
  </ol>
</p>
</file>
<file name="script.js">
$scope.staticModel2 = "a";
</file>
</example>
