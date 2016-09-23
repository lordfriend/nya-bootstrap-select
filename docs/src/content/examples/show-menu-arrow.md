# Show Menu Arrow

To enable an menu arrow on dropdown menu. just add a class `show-menu-arrow` on `nya-bs-select` element.

<example>
<file name="index.html">
<ol class="nya-bs-select show-menu-arrow" ng-model="model">
  <li nya-bs-option="option in options">
    <a>
      {{ option }}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.options=['Alpha', 'Bravo', 'Charlie'];
</file>
</example>
