# Actions Box

Actions Box is an additional toggle button inside dropdown menu that give you ability to select/un-select all options with a single click.

<example>
<file name="index.html">
<form class="form-inline">
  <!-- title on nya-bs-select -->
  <ol class="nya-bs-select" ng-model="model" actions-box="true" multiple>
    <li nya-bs-option="option in arrayCollection">
      <a>
        {{ option.name }}
        <span class="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  </ol>
</form>
</file>
<file name="script.js">
$scope.arrayCollection = [
  {name: 'Alice', class: 'Class A'},
  {name: 'Bob', class: 'Class B'},
  {name: 'Carl', class: 'Class A'},
  {name: 'Daniel', class: 'Class B'},
  {name: 'Emi', class: 'Class A'},
  {name: 'Flank', class: 'Class B'},
  {name: 'George', class: 'Class C'},
  {name: 'Harry', class: 'Class C'}
];
</file>
</example>
