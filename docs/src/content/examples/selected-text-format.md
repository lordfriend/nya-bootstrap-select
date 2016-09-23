# Selected Text Format

This is a feature borrowed from Bootstrap-select. Add an attribute `data-selected-text-format` or `select-texted-format` on `nya-bs-select` element. Then configure its value with the following formats:

- `values` A comma delimited list of selected values. (default)
- `count` If one item is selected, then the value is shown, if more than one is selected then the number of selected items is displayed.
- `count > x` If more than x items selected, the number of selected items is displayed, otherwise, the selected items are displayed.

<example>
<file name="index.html">
<ul>
  <li>
    <p><code>values</code></p>

    <form class="form-inline">
      <ol id="values-example" class="nya-bs-select" ng-model="model1" data-selected-text-format="values" multiple>
        <li nya-bs-option="option in options1">
          <a>
            {{option}}
            <span class="glyphicon glyphicon-ok check-mark"></span>
          </a>
        </li>
      </ol>
    </form>
  </li>
  <li>
    <p><code>count</code></p>
    <form class="form-inline">
      <ol id="count-example" class="nya-bs-select" ng-model="model1" data-selected-text-format="count" multiple>
        <li nya-bs-option="option in options1">
          <a>
            {{option}}
            <span class="glyphicon glyphicon-ok check-mark"></span>
          </a>
        </li>
      </ol>
    </form>
  </li>
  <li>
    <p><code>count > 3</code></p>
    <form class="form-inline">
      <ol id="count-number-example" class="nya-bs-select" ng-model="model1" data-selected-text-format="count>3" multiple>
        <li nya-bs-option="option in options1">
          <a>
            {{option}}
            <span class="glyphicon glyphicon-ok check-mark"></span>
          </a>
        </li>
      </ol>
    </form>
  </li>
</ul>
</file>
<file name="script.js">
$scope.options1 = [
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
