#Migrate Instructions

This guide will help you migrate from 1.x to 2.x. If you are first time using **nya-bootstrap-select** , just ignore this section.

##Data Structure

The collection which are used to populate options and the model which are used to work with selection results don't changed.

Both array and object collection are supported by the new directive `nya-bs-option`. See the [document](#/api/nya-bs-option) to learn usage.

model of multiple selection is array and model of single selection is object or string as.

##Rewrite Template

The most changes are the template. `<select>` is totally deprecated. you need to use new directive `nya-bs-select` to build your select.
If you are using static options you should use `nya-bs-option` class and `value` attribute to identify your option. 
otherwise. the `nya-bs-option` directive must be used to populate options.

In the 1.x version:

```html
<select class="nya-selectpicker" ng-model="model" ng-options="option in options">
  ...
</select>
```

In the 2.x version:
```html
<ol class="nya-bs-select" ng-model="model">
  <li nya-bs-option="option in options">
    <a>
      {{ option }}
      <span class="glyphicon glyphicon-ok check-mark"></span>
    </a>
  </li>
</ol>
```

>Note that the element of `nya-bs-select` directive can be any block level element. To make your html semantically. we suggest use some list container tag, like ul or ol.

>Anyway you can use `<nya-bs-select>` or `<div nya-bs-option>` and other form as well. 

>The `nya-bs-option` is a different case. Which its element should aways be `<li>` element, in order to utilize the bootstrap class. So is its children `<a>`, it's also a required direct child
>of `nya-bs-option`.

For group and other usage changes, see the [examples](#/examples).

##Features of Bootstrap-select

If you have used some features of Bootstrap-select in the 1.x version. Those features may not be supported or have a different implementation at current version.

####Features Not supported

- **data-container** this feature is buggy and have compatible issue with the model dialog of ui-bootstrap. So it may not be supported any more.
- **dropup** this feature, in fact, can be supported in current version. But I found the implementation in Bootstrap-select is also not very functional. It need user to click 
  the dropdown-toggle button at least one time to calculate the height of the dropdown-menu. Then a scroll event listener is attached to calculate the distance between dropdown-toggle button and the edge of viewport.
  automatically add `dropup` class to dropdown-menu-container. This implementation may impact the performance when too many controls in a page.
  
  **to use this feature. manually add `dropup` class to the `nya-bs-select` directive if you want a drop-up menu.**
  
- **data-header** this feature may be supported in future version.

- **data-max-options** this feature may be supported in future version.

- **data-width** this feature may be supported in future version.


####Features with different implementing.

- data-style
  In current version, if you want to make a different look of the dropdown-toggle button, just add the corresponding class to the `nya-bs-select` directive.
  You can add these classes: `btn-primary` `btn-info` `btn-success` `btn-warning` `btn-danger`. `btn-inverse` are not supported.
  
- show-tick
  You don't need this class any more, because the select options are built by yourself. you can get full control of what content a select should have. so you need to add tick by yourself.
  Add `<span class="glyphicon glyphicon-ok check-mark"></span>` inside `<a>` tag which is a direct child of `nya-bs-option` directive. make sure the content of option is before the `check-mark` element.
   ```html
   ...
     <li nya-bs-option="option in options">
       <a>
         {{ option }}
         <span class="glyphicon glyphicon-ok check-mark"></span>
       </a>
     </li>
    
   ```

- style an option, custom HTML of option, data-icon, showSubText
 These features are made by yourself. See the [examples](#/examples).
 
- disable an option, disable a group.
  just add a class to nya-bs-option which you want to disable. if you need to disable a group, you have to disable its every element.

- disable a select control
  unlike Bootstrap-select to just add an attribute. you need to give `disabled` a expression which can be evaluated to true or false. when it's true, the control will be disabled.
  otherwise it will be enabled again.
