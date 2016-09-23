# nyaBsSelect

nyaBsSelect is the main directive of this module. You can consider it as a select directive. It manipulates the the dropdown-toggle content and all user interaction. 

### Usage

as element:
```html
<nya-bs-select
  ng-mode=""
  [multiple=""]
  [live-search=""]
  [required=""]
  [ng-required=""]
  [disabled=""]
  [size=""]
  [selected-text-format=""]
  [title=""]
  [actions-box=""]>
...
</nya-bs-select>
```

as attribute:
```html
<ANY
  nya-bs-select
  ng-mode=""
  [multiple=""]
  [live-search=""]
  [required=""]
  [ng-required=""]
  [disabled=""]
  [size=""]
  [selected-text-format=""]
  [title=""]
  [actions-box=""]>
...
</ANY>
```

as class:
```html
<ANY
  class="nya-bs-select"
  ng-mode=""
  [multiple=""]
  [live-search=""]
  [required=""]
  [ng-required=""]
  [disabled=""]
  [size=""]
  [selected-text-format=""]
  [title=""]
  [actions-box=""]>
...
</ANY>
```

### Arguments

<table class="table table-striped">
<thead>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Details</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>ngModel</td>
    <td><small class="label label-primary">string</small></td>
    <td>Assignable angular expression to data-bind to</td>
  </tr>
  <tr>
    <td>multiple(optional)</td>
    <td><small class="label label-primary">string</small></td>
    <td>Act as a multiple select control if multiple attribute is set.</td>
  </tr>
  <tr>
    <td>live-search(optional)</td>
    <td><small class="label label-primary">string</small></td>
    <td>Provide a input box to search through all option content only if `live-search="true"`</td>
  </tr>
  <tr>
    <td>required</td>
    <td><small class="label label-primary">string</small></td>
    <td>The control is considered valid if ngModel value is defined or not an empty array(for multiple)</td>
  </tr>
  <tr>
    <td>ng-required</td>
    <td><small class="label label-primary">string</small></td>
    <td>Adds required attribute and required validation constraints to the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of required when you want to data-bind to the required attribute</td>
  </tr>
  <tr>
    <td>disabled</td>
    <td><small class="label label-info">expression</small></td>
    <td>if the expression is truthy, then the whole control will be disabled.</td>
  </tr>
  <tr>
    <td>size</td>
    <td><small class="label label-danger">number</small></td>
    <td>Sets max number which the dropdown-menu can show. if the number of options exceed the limit. an scrollbar will be shown.</td>
  </tr>
  <tr>
    <td>selected-text-format</td>
    <td><small class="label label-primary">string</small></td>
    <td>
      <span>Sets the content format of dropdown-toggle.</span>
      <ul>
        <li>
          if sets to `value`, the dropdown-toggle button will show content user has selected, this is default value.
        </li>
        <li>
          if sets to `count`, the dropdown-toggle button will show the number of options user has selected.
          </li>
        <li>
          if sets to `count>x`, the dropdown-toggle button will show the number of user selected options when the number of options greater than x. otherwise, show the content.
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>title</td>
    <td><small class="label label-primary">string</small></td>
    <td>provide a replacement for default text when nothing is selected.</td>
  </tr>
  <tr>
      <td>actions-box(optional)</td>
      <td><small class="label label-primary">string</small></td>
      <td>Enable the actions box which contains two action select all and deselect all to do batch operation</td>
    </tr>
</tbody>
</table>
