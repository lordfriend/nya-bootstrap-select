# Tick Icon

Tick icon can be add via a special class `check-mark` on a `span` element as the last child of the anchor element. The icon can be any Bootstrap glyphon icon or even FontAwesome Icon.
  
<example>
<file name="index.html">
<ol class="nya-bs-select" ng-model="model1">
  <li nya-bs-option="option in options">
    <a>
      {{ option }}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<!-- You can use other glyph icon from Bootstrap -->
<ol class="nya-bs-select" ng-model="model2" multiple>
  <li nya-bs-option="option in options">
    <a>
      {{ option }}
      <span class="glyphicon glyphicon-pushpin check-mark"></span>
    </a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.options=['Alpha', 'Bravo', 'Charlie'];
</file>
</example>
