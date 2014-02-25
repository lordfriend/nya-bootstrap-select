# nya-bootstrap-select #

[![Build Status](https://travis-ci.org/lordfriend/nya-bootstrap-select.png?branch=master)](https://travis-ci.org/lordfriend/nya-bootstrap-select)

An AngularJS directive wrapper for silviomoreto's [Bootstrap-select](https://github.com/silviomoreto/bootstrap-select), which supports `ngRepeat` in options to dynamically build a Bootstrap-select.

**Requirements:** AngularJS 1.0+, jQuery 1.7+, Bootstrap-select 1.3+

## Usage ##

1. install via bower
```
$ bower install nya-bootstrap-select
```
2. include the nyaBootstrapSelect module as a dependency for your app.
```javascript
angular.module('myApp', ['nya.bootstrap.select'])
```
3. include the bootstrap-select js and css file in your html.

4. Create your `<select>` with the `.nya-selectpicker` class or 'nya-selectpicker' attribute. You can use `ngRepeat` or `ngOptions` directive to generate `<option>`. 'ngRepeat' directive is only preferred to use in simple situations. ngOptions is a good choice for generating both `<option>` and `<optgroup>`.  if you use ng-repeat to generate your `option` tags. add an `ng-model` directive to bind a model to your `<select>`. In order to update the model according to your select, your should bind `value` with your models.
```html
<select class="nya-selectpicker" ng-model="myModel">
  <option ng-repeat="option in options" value="{{option}}">{{option}}</option>
</select>
```
`ngOptions` example:
```html
<select class="nya-selectpicker" ng-model="myModel" ng-options="c.name for c in options">
</select>
```
Note that you shouldn't use both two method at same time.

5. init your options model. you can retrieve your model from server any time. when options model changes. `ng-repeat` will update the `<option>` s. nya-bootstrap-select directive will update your select as well.
```javascripts
$scope.options = ['alpha', 'bravo', 'charlie'];
```

6. Fire up your angular app.

## License ##

Licensed under the MIT license
