/**
 * e2e test for basic usage
 */

var PageObject = function() {
  this.select = element(by.model('model'));

  this.selectOptions = element.all(by.css('#singleSelection .nya-bs-option'));

  this.select2 = element(by.model('model2'));

  this.result = element(by.binding('model'));

  this.result2 = element(by.binding('model2'));

};

describe('Basic Usage', function() {
  it('should allow user select an element and change the model', function(){
    var pageObject = new PageObject();
    // load page
    browser.get('basic-usage-example-1/index.html');

    // click the dropdown toggle button to open dropdown menu.
    pageObject.select.click();

    // select an option randomly
    var indexToBeSelected = Math.floor(Math.random() * 3);
    expect(pageObject.selectOptions.count()).toBe(3);
    console.log(indexToBeSelected);
    // get picked option value.
    var value = pageObject.selectOptions.get(indexToBeSelected).getAttribute('value');
    pageObject.selectOptions.get(indexToBeSelected).getInnerHtml().then(function(v) {console.log(v)});

    // click the option
    pageObject.selectOptions.get(indexToBeSelected).click();

    expect(value).toEqual(pageObject.result.getText());

  });
});
