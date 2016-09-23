# nyaBsConfigProvider

This provider help the developer configure the default text appearance of nya-bs-select base on user-agent localization. Default implementation of the locale text is `en-us`. 

There are three default text can be configured. Each one has two form, pure text and custom html template. The priority of template configuration is higher than pure text.

<table class="table table-striped">
<thead>
<tr>
  <th>Text</th>
  <th>Template</th>
  <th>Details</th>
</tr>
</thead>
<tbody>
<tr>
  <td>defaultNoneSelection</td>
  <td>defaultNoneSelectionTpl</td>
  <td>defaultNoneSelection is appeared on dropdown toggle when nothing is selected.</td>
</tr>
<tr>
  <td>noSearchResult</td>
  <td>noSearchResultTpl</td>
  <td>noSearchResult is appeared on dropdown menu when using live search and nothing match the filter text</td>
</tr>
<tr>
  <td>numberItemSelected</td>
  <td>numberItemSelectedTpl</td>
  <td>
    <p>numberItemSelected is appeared when <code>select-text-format</code> attribute is set to count or count>x and when user selected multiple items. dropdown button text will be replaced by this text.</p>
    
    <p>**To show a count of selected items. this text string or template should contains a `%d` which will be replaced with number**</p>
  </td>
</tr>
<tr>
  <td>selectAll</td>
  <td>selectAllTpl</td>
  <td>selectAll is the action button to select all options by a single click. It is available by setting actions-box="true"</td>
</tr>
<tr>
  <td>deselectAll</td>
  <td>deselectAllTpl</td>
  <td>deselectAll is the action button to deselect all options by a single click. It is available by setting actions-box="true"</td>
</tr>
</tbody>
</table>

>NOTE: You shouldn't use any angular directive or expression in template, it will not be parsed. 

### Methods

#### `setLocalizedText(localeId, configObj);`

Register a new locale configuration or override an existing locale configuration.

- `localeId` a string formatted as languageId-countryId, e.g. en-us
- `configObj` a localized configuration object. should contain one of the five properties.

```javascript
{
  defaultNoneSelection: 'Nothing selected',
  noSearchResult: 'NO SEARCH RESULT',
  numberItemSelected: '%d item selected',
  selectAll: 'Select All',
  deselectAll: 'Deselect All'
}
```

#### `useLocale(localeId);`

Force to use a special locale configuration with given localeId.

- `localeId` a string formatted as languageId-countryId, e.g. en-us



