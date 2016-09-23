# Control Dropdown Menu Size

This feature is borrowed from Bootstrap-select. It give you ability to control the height of dropdown menu to display certain number of options. To use this feature, add an attribute `data-size` or `size`
on `nya-bs-select` element. the value of the attribute is the max number of options you want to display. If the number exceed the limit, an scrollbar will be shown on the dropdown menu.

The default value is `auto` which does not limit the size of dropdown menu.

<example>
<file name="index.html">
<p><code>data-size="auto"</code> or not set</p>
<ol class="nya-bs-select" ng-model="model" data-size="auto">
  <li nya-bs-option="option in options">
    <a>
      {{ option }}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<p><code>data-size="5"</code></p>
<ol class="nya-bs-select" ng-model="model" data-size="5">
  <li nya-bs-option="option in options">
    <a>
      {{ option }}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.options = ['Alpha', 'Bravo', 'Charlie', 'Delta',
  'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
  'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra',
  'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
];
</file>
</example>
