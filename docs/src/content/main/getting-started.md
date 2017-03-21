#Getting started

###Different from 1.x

Unlike nya-bootstrap-select v1.x which is a wrapper for [Bootstrap-select](https://github.com/silviomoreto/bootstrap-select). This project
is a totally independent one which only fork most of the features of Bootstrap-select without any code dependency.

If you are using the 1.x and want migrate to 2.x. follow the [migrate instructions](#/main/migrate-instructions).

##Dependencies and compatibility:

This directive only requires AngularJS v1.2 or later and the css of Bootstrap. No other dependencies.
 
##Installation.

Install via npm.

```bash
$ npm install @lordfriend/nya-bootstrap-select --save
```

or via [Bower](http://bower.io)

```bash
$ bower install nya-bootstrap-select --save
```

Load the script and css and other dependencies **jquery and bootstrap script are not required!** .

```html
<link href="node_modules/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
<link href="node_modules/nya-bootstrap-select/dist/css/nya-bs-select.css" rel="stylesheet">

<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/nya-bootstrap-select/dist/js/nya-bs-select.js"></script>
```

make 'nya.bootstrap.select' module as your application dependency.

```javascript
angular.module('myApp', ['nya.bootstrap.select']);
```

##Make your select component.

In view file, use `nya-bs-select` as element, attribute or class to build an bootstrap select component. the `ng-model` is also required on the element.
To make your select options, you will need `nya-bs-option` directive to populate options from an collection, or you can using `nya-bs-option` as an class
of `<li>` element to make static options. If you are using static options, you should also add an value attribute on `<li>` element to explicitly set to value of each option.

<example>
<file name="index.html">
<p class="bg-info">model1 is {{model1}}</p>
<p class="bg-info">model2 is {{model2}}</p>
<form>
  <!-- options from collection -->
  <ol id="dynamic-options" class="nya-bs-select" ng-model="model1">
    <li nya-bs-option="option in options">
      <a>{{ option }}</a>
    </li>
  </ol>
  <!-- options in static -->
  <ol id="static-options" class="nya-bs-select" ng-model="model2">
    <li class="nya-bs-option" value="alpha">
      <a>Alpha</a>
    </li>
    <li class="nya-bs-option" value="bravo">
      <a>Bravo</a>
    </li>
    <li class="nya-bs-option" value="charlie">
      <a>Charlie</a>
    </li>
  </ol>
</form>
</file>
<file name="script.js">
  $scope.options = [
    'Alpha', 'Bravo', 'Charlie', 'Delta',
    'Echo'
  ];
</file>
</example>
