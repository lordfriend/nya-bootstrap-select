# Custom Content

As you already know, the content of `nya-bs-option` is all depend on your needs. there are only few restrictions on the content.

- Anchor element should always the child of `nya-bs-option` and parent of your content.
- Add `dropdown-header` before anchor element as a sibling.
- If you want search the content. don't nest your content elements too deep. currently we only support one level depth.
- You content element should always be `inline` element. Use `block` or `inline-block` may result in unknown behavior.
- If you use subtext or any custom content. you should wrap your text content with `<span>` or it may not be displayed on dropdown-toggle when selected.
- Only the first wrapped element will be used to be displayed on dropdown button. This is useful, when you want to ignore some extra information provided in option.

<example>
<file name="index.html">
<!-- Use label class -->
<ol class="nya-bs-select" ng-model="model1">
  <li nya-bs-option="option in options">
    <a>
      <span class="label" ng-class="option.bg">{{ option.name }}</span>
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<!-- Use icon in option -->
<ol class="nya-bs-select" ng-model="model2">
  <li nya-bs-option="option in options2">
    <a>
      <span><span class="glyphicon" ng-class="option.icon"></span> {{ option.name }}</span>
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<p>Subtext</p>
<!-- wrap whole content, subtext will displayed on dropdown-toggle button -->
<ol class="nya-bs-select" ng-model="model3">
  <li nya-bs-option="option in options3">
    <a>
      <span>
        {{ option }}
        <small>planet No.{{ $index + 1 }}</small>
      </span>
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<!-- make small element as a sibling of your content. it will ignored on dropdown-toggle button -->
<ol class="nya-bs-select" ng-model="model3">
  <li nya-bs-option="option in options3">
    <a>
      <span>{{ option }}</span>
      <small>planet No.{{ $index + 1 }}</small>
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
<p>Custom option style</p>
<ol class="nya-bs-select" ng-model="model4">
  <li nya-bs-option="option in options3">
    <a ng-style="{color: $index=== 2 ? 'blue' : 'black'}">
      {{ option }}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
</file>
<file name="script.js">
$scope.options = [
  {name: 'AngularJS', bg: 'label-danger'},
  {name: 'Bootstrap', bg: 'label-primary'},
  {name: 'Foundation', bg: 'label-success'},
  {name: 'Polymer', bg: 'label-warning'}
];
$scope.model1 = {name: 'AngularJS', bg: 'label-danger'};
$scope.options2 = [
  {name: 'Euro Dollar', icon: 'glyphicon-euro'},
  {name: 'US Dollar', icon: 'glyphicon-usd' },
  {name: 'Great Britain Pound', icon: 'glyphicon-gbp'}
];
$scope.model2 = {name: 'US Dollar', icon: 'glyphicon-usd' };
$scope.options3 = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune'
];
$scope.model3 = 'Jupiter';
</file>
</example>
