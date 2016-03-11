#Advanced Static Usage

With Angular it's easy to create static `nys-bs-option`s that have dynamic labels. Under basic usage the `nya-bs-select` button will not reflect the changes made to the options
until an option is re-selected. The attribute `update-button-on` can be placed on the `nya-bs-select` element to cause the button to update whenever the given expression changes.

###Static Button Update

Use the `update-button-on` attribute on the `nya-bs-select` element to reflect changes to the static options:

<example>
<file name="index.html">
<ol class="nya-bs-select" ng-model="interval">
  <li class="nya-bs-option" value="1">
    <a>1</a>
  </li>
  <li class="nya-bs-option" value="2">
    <a>2</a>
  </li>
  <li class="nya-bs-option" value="3">
    <a>3</a>
  </li>
</ol>
<ol class="nya-bs-select" ng-model="units" update-button-on="interval">
  <li class="nya-bs-option" value="DAY">
    <a>day{{interval != '1' ? 's' : ''}}</a>
  </li>
  <li class="nya-bs-option" value="WEEK">
    <a>week{{interval != '1' ? 's' : ''}}</a>
  </li>
  <li class="nya-bs-option" value="MONTH">
    <a>month{{interval != '1' ? 's' : ''}}</a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.interval='1';
$scope.units='WEEK';
</file>
</example>