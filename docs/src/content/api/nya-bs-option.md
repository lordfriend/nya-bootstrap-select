# nyaBsOption

The main function of this directive is manipulating an option list base on given collection. 
its expression is very similar as `ng-repeat` but add a little magic to support the special scenario of select component.

The `nyaBsOption` instantiates a template once per item from a collection. Each template instance gets its own scope, 
where the given loop variable is set to the current collection item,
and `$index` is set to the item index or key. If `group by` expression is provided. 
the generated options list will resorted by the result of the expression, and `$group` is set to each template scope.

**Special properties are exposed on the local scope of each template instance, including:**
<table class="table table-striped">
<thead>
 <tr>
  <th>Variable</th>
  <th>Type</th>
  <th>Details</th>
 </tr>
</thead>
<tbody>
  <tr>
    <td>$index</td>
    <td><span class="label label-danger">number</span></td>
    <td>
      iterator offset of the repeated element (0..length-1). Note: if you using group by expression. 
      the order of generated list may be different with the collection.
    </td>
  </tr>
  <tr>
    <td>$first</td>
    <td><span class="label label-success">boolean</span></td>
    <td>true if the repeated element is first in the iterator.</td>
  </tr>
  <tr>
    <td>$middle</td>
    <td><span class="label label-success">boolean</span></td>
    <td>true if the repeated element is between the first and last in the iterator.</td>
  </tr>
  <tr>
    <td>$last</td>
    <td><span class="label label-success">boolean</span></td>
    <td>true if the repeated element is last in the iterator.</td>
  </tr>
  <tr>
    <td>$even</td>
    <td><span class="label label-success">boolean</span></td>
    <td>true if the iterator position $index is even (otherwise false).</td>
  </tr>
  <tr>
    <td>$odd</td>
    <td><span class="label label-success">boolean</span></td>
    <td>true if the iterator position $index is odd (otherwise false).</td>
  </tr>
  <tr>
    <td>$group</td>
    <td><span class="label label-primary">string</span></td>
    <td>the group by expression result of each repeated element.</td>
  </tr>
</tbody>
</table>

### Special class generated on each element.

When using `group by` expression, the `nyaBsOption` will generate a class `group-item` on each repeated element. 
To identify the first element of each group. It will also add a class `first-in-group` on the first element of a group.
Theses class has some special styles to build the group header.

### Directive Info
This directive creates new scope.
This directive executes at priority level 1000.

### Usage

as attribute:
```html
<li
  nya-bs-option=""
  [data-value=""]
  [deep-watch=""]>
  <a>
    ...
  </a>
</li>
```

### Arguments
<table class="table table-striped">
<thead>
 <tr>
  <th style="min-width: 120px;">Param</th>
  <th>Type</th>
  <th>Details</th>
 </tr>
</thead>
<tbody>
  <tr>
    <td>nya-bs-option</td>
    <td><span class="label label-default">comprehension_expression</span></td>
    <td>
      <p>The expression indicate hwo to enumerate a collection. It support both object and array collection.</p>
      <ul>
        <li>
          <span>for array collection:</span>
          <ul>
            <li>`variable in expression`</li>
          
            <li>`variable in expression track by tracking_expression`</li>
          
            <li>`variable in expression group by grouping_expression`</li>
          
            <li>`variable in expression group by grouping_expression track by tracking_expression`</li>
          </ul>
        </li>
        <li>
          <span>for object collection:</span>
          <ul>
            <li>`(key, value) in expression`</li>
        
            <li>`(key, value) in expression track by tracking_expression`</li>
            
            <li>`(key, value) in expression group by grouping_expression`</li>
            
            <li>`(key, value) in expression group by grouping_expression track by tracking_expression`</li>
          </ul>
        </li>
      </ul>
      <p>
        The basic form: `variable in expression` and `(key, value) in expression` define a loop variable to enumerate the `expression`. 
        This is very similar with `ng-repeat`.
      </p>
      <p>
        For example: `album in artist.albums` and `(name, info) in doc.people`
      </p>
      <p>
        The `track by` feature use a `tracking_expression` evaluated with the loop variable to identify an element in collection.
         This is not very useful in select option. because we don't want to our option duplicated.
      </p>
      <p>
        The `group by` feature use a `grouping_expression` evaluated with the loop variable to sort the collection by group.
         If this expression is used, a class `group-item` is added to each repeated element. and `first-in-group` class is add to the first element of each group.
      </p>
      <p>
        if you use `group by` and `track by`, make sure the track by is the last part.
      </p>
    </td>
  </tr>
  <tr>
    <td>data-value</td>
    <td><span class="label label-default">comprehension_expression</span></td>
    <td>
      <p>
        The result of this expression will be the value of current option. 
        if this attribute is omitted, use the loop variable of each instance as option value. 
        if loop variable is `(key, value)`, `key` is prior to `value`.
      </p>
      <p>
        For example: `<li nya-bs-option="album in artist.albums" data-value="album.album_name"></li>`. 
        the value of each option will be album_name instead of the album object.
      </p>
    </td>
  </tr>
  <tr>
    <td>deep-watch</td>
    <td><span class="label label-primary">string</span></td>
    <td>
      When set to true, enable a deep watch to collection_expression. `nyaBsOption` will use $watch(exp, listener, true) to make a deep watch. Turn on this feature will impact the performance. even cause expection.
      It is not recommended.
      By default. `nyaBsOption` will use $watchCollection to watch the collection_expression.
    </td>
  </tr>
</tbody>
</table>
