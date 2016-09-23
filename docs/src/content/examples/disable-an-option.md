# Disable An Option

To disable an option, just add `disabled` class to `nya-bs-option` element. But when your want to disable an entire group of options. you may need to add disabled on every option of the group.

<example>
<file name="index.html">
<!-- we disable the second option -->
<ol class="nya-bs-select" ng-model="model">
  <li nya-bs-option="option in options" ng-class="{disabled: $index ===1 }">
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
