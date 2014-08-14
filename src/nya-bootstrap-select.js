/**
 * @license nya-bootstrap-select v2.0.0+alpha001
 * Copyright 2014 nyasoft
 * Licensed under MIT license
 */

'use strict';
angular.module('nya.bootstrap.select',[])
  .controller('nyaBsSelectCtrl', ['$scope', function($scope){
    var self = this;

  }])
  .directive('nyaBsSelect', ['$parse', function ($parse) {

    var DROPDOWN_TOGGLE = '<button class="btn dropdown-toggle">' +
        '<span class="pull-left filter-option"></span>' +
        '<span class="caret"></span>' +
      '</button>';

    var DROPDOWN_MENU = '<ul class="dropdown-menu"></ul>';

    return {
      restrict: 'ECA',
      scope: true,
      require: ['ngModel', 'nyaBsSelect'],
      controller: 'nyaBsSelectCtrl',
      compile: function(tElement, tAttrs){
        tElement.addClass('btn-group');
        var options = tElement.children().detach();
        var dropdownToggle = angular.element(DROPDOWN_TOGGLE);
        var dropdownMenu = angular.element(DROPDOWN_MENU);
        dropdownMenu.append(options);
        tElement.append(dropdownToggle);
        tElement.append(dropdownMenu);
        return function(scope, element, attrs, ctrls) {
          var BS_ATTR = ['container', 'countSelectedText', 'dropupAuto', 'header', 'hideDisabled', 'selectedTextFormat', 'size', 'showSubtext', 'showIcon', 'showContent', 'style', 'title', 'width', 'disabled'];
          var ngCtrl = ctrls[0];
          var nyaBsSelectCtrl = ctrls[1];
          scope.$watch(attrs.bsOptions, function(options) {
            if(angular.isUndefined(options)) {
              return;
            }
            nyaBsSelectCtrl.bsOptions = options;
          }, true);
        };
      }
    };
  }])
  .directive('nyaBsOption', ['$parse', function($parse){

    var BS_OPTION_REGEX = /^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/;

    return {
      restrict: 'ECA',
      require: '^nyaBsSelect',
      link: function postLink(scope, element, attrs, nyaBsSelectController, transcludeFn) {

      }
    }
  }]);
