# Groups And More

### Group features
The native `<select>` element support `optgroup` tag which can divide options to different groups. So is Bootstrap-select. Although nya-bootstrap-select doesn't use `select` tag anymore, nevertheless, nya-bootstrap-select also supports group features.

The key of this feature is sort the list element by its group property. then using some css to stylize the group header which already implemented in Bootstrap, the `dropdown-header` class.

When using group features, like `ng-options`, you need to use `group by` expression after the `collection` expression in the expression of `nya-bs-option` directive.

For example:

An array of object, group by the `class` property

```
nya-bs-option="student in students group by student.class"
```

An object collection, group by the `group` property of each value

```
nya-bs-option="(key, value) in options group by value.group"
```

With `group by ` expression, `nya-bs-option` directive will sort the options by their group and expose an `$group` property in each scope of its child. To show the group header, you need to add an header for each group.

<example>
<file name="index.html">
<form>
  <div class="form-group">
    <p class="form-control-static">select: {{ model }}</p>
    <label for="array-collection">Array Collection</label>
    <ol id="array-collection" class="nya-bs-select" ng-model="model">
      <li nya-bs-option="option in arrayCollection group by option.class">
        <span class="dropdown-header">{{$group}}</span>
        <a>
          {{option.name}}
        </a>
      </li>
    </ol>
  </div>
  <div class="form-group">
  <p class="form-control-static">select: {{ model2 }}</p>
    <label for="object-collection">Object Collection, select: {{ model2 }}</label>
    <ol id="object-collection" class="nya-bs-select" ng-model="model2">
      <li nya-bs-option="(key, value) in objCollection group by value.group">
        <span class="dropdown-header">{{$group}}</span>
        <a>
          {{key}}
        </a>
      </li>
    </ol>
  </div>
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
$scope.objCollection = {
  wheat: {name: 'wheat', group: 'grain'},
  barley: {name: 'barley', group: 'grain'},
  pork: {name: 'pork', group: 'protein'},
  chicken: {name: 'chicken', group: 'protein'},
  orange: {name: 'orange', group: 'fruit'},
  apple: {name: 'apple', group: 'fruit'}
};
</file>
</example>

### data-value Expression

Sometimes, you may want to use one property instead the object in collection as the result(model) of your selection. The **data-value expression** give an solution for this.
 
**data-value expression** is an attribute `data-value` add to `nya-bs-option` directive element. But unlike the `data-value` attribute used in static options. This `data-value`
attribute is an expression which will evaluated in the child scope of `nya-bs-option`.

<example>
<file name="index.html">
<form>
  <div class="form-group">
    <p class="form-control-static">select: {{ model }}</p>
    <label for="array-collection">Array Collection</label>
    <ol id="array-collection" class="nya-bs-select" ng-model="model">
      <li nya-bs-option="option in arrayCollection group by option.class" data-value="option.name">
        <span class="dropdown-header">{{$group}}</span>
        <a>
          {{option.name}}
        </a>
      </li>
    </ol>
  </div>
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

### Track By Expression

track by expression is very similar with `ng-repeat` which allow you to identify collection element with some unique property. It is useful when the element may be empty or duplicated. But a select component shouldn't have an duplicated option.
 So In our case, this is not very useful, however, you can use this to improve performance when your array elements are very large.
 
<example>
<file name="index.html">
<form>
  <div class="form-group">
    <p class="form-control-static">select: {{ model }}</p>
    <label for="array-collection">Array Collection</label>
    <ol id="array-collection" class="nya-bs-select" ng-model="model">
      <li nya-bs-option="option in arrayCollection group by option.class track by option.name" data-value="option.name">
        <span class="dropdown-header">{{$group}}</span>
        <a>
          {{option.name}}
        </a>
      </li>
    </ol>
  </div>
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
