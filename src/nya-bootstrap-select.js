'use strict';

angular.module('nyaBootstrapSelect',[])
  .directive('nyaSelectpicker', function () {
    return {
      restrict: 'CA',
      scope: false,
      require: ['^ngModel', 'select'],

      link: function(scope, element, attrs, ctrls) {
        var ngCtrl = ctrls[0];
        var selectCtrl = ctrls[1];
        // prevent selectDirective render an unknownOption.
        selectCtrl.renderUnknownOption = angular.noop;
        var optionArray = [];
        scope.$watch(function optionDOMWatch(){
          // check every option if has changed.
          var optionElements = $(element).find('option.ng-scope');

          if(optionElements.length !== optionArray.length) {
            optionArray = makeOptionArray(optionElements);
            buildSelector();
          } else {
            var hasChanged = false;
            optionElements.each(function(index, value){
              if(optionArray[index].text !== value.text || optionArray[index].value !== value.value) {
                hasChanged = true;

              }
            });
            if(hasChanged) {
              buildSelector();
            }
            optionArray = makeOptionArray(optionElements);
          }

        });

        ngCtrl.$render = function() {
          // model -> view
          var data = $(element).data('selectpicker');
          if(data) {
            $(element).val(ngCtrl.$viewValue).selectpicker('render');
          }
        };

        function makeOptionArray(optionElements) {
          var optionArray = [];
          optionElements.each(function(index, childNode){
            optionArray.push({
              value: childNode.value,
              text: childNode.text
            });
          });
          return optionArray;
        }

        function buildSelector() {
          // build new selector. if previous select exists. remove previous data and DOM
          var oldSelectPicker = $(element).data('selectpicker');
          if(oldSelectPicker) {
            oldSelectPicker.$menu.parent().remove();
            oldSelectPicker.$newElement.remove();
            $(element).removeData('selectpicker');
          }
          $(element).selectpicker();
//          console.log(ngCtrl.$modelValue);
          $(element).val(ngCtrl.$modelValue).selectpicker('render');
        }

      }
    };
  });
