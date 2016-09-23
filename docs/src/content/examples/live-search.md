# Live Search

This feature is borrowed from Bootstrap-select. It give you ability to search through the options. To use this feature. Add `data-live-search="true"` or `live-search="true"` on the `nya-bs-select` element.

>**Note:** live-search search through your content of all direct children elements of anchor element except the `check-mark` element. If no children element exists. the text content of anchor element will be used.
> currently, only one level children element can be search through. If you want your content to be searched. don't nest too many levels of children element.


<example>
<file name="index.html">
<form class="form-inline">
  <ol class="nya-bs-select" ng-model="model" data-live-search="true">
    <li nya-bs-option="option in options">
      <!-- the text content of anchor element will be used for search -->
      <a>
        {{ option }}
        <span class="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  </ol>
  <ol class="nya-bs-select" ng-model="model" data-live-search="true">
    <li nya-bs-option="option in options2 group by option.group">
      <span class="dropdown-header">{{$group}}</span> <!-- group header cannot be searched -->
      <a>
        <span>{{ option.name }}</span> <!-- this content will be search first -->
        <span class="small">{{ option.subtitle }}</span> <!-- if the name failed, this will be used -->
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
  'Golf',
  'Hotel',
  'Juliet',
  'Kilo',
  'Lima'
];
$scope.options2 = [
  {name: 'Alpha', subtitle: 'Alice', group: 'Group1'},
  {name: 'Bravo', subtitle: 'Bob', group: 'Group2'},
  {name: 'Charlie', subtitle: 'Carl', group: 'Group1'},
  {name: 'Golf', subtitle: 'George', group: 'Group1'},
  {name: 'Hotel', subtitle: 'Harry', group: 'Group1'},
  {name: 'Juliet', subtitle: 'Joe', group: 'Group2'},
  {name: 'Kilo', subtitle: 'Kate', group: 'Group2'},
  {name: 'Lima', subtitle: 'Laura', group: 'Group2'}
];

</file>
</example>
