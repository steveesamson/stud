# Stud 
A very simple and fast template engine for compiling and rendering pre-compiled HTML templates in an unopinionated runtime fashion.

## Installation
```cli
    
    npm install stud

```


## Installation
```cli
    
    npm test

```

## Usage in Node

### Compiling and Rendering Templates with `Stud`

```javascript
    var stud = require('stud'),
    data = {name:'steve', age:23, location:'US'},
    tmpl = "<td class='{name}'> {name} - {age} some of them are useful at location {location} as specified in the docs.</td>";
   
    /*The template will be registered with the name 'template_reg_name' */   
    var compiledTmpl = stud.compile(tmpl,'template_reg_name');  
    eval(compiledTmpl);
    
    /*
    * Alternatively, assynchronously
    var  = stud.compile(tmpl,'template_reg_name', function(compiledTmpl){
        eval(compiledTmpl);
    });  
    */
      
    
    
    stud.render('template_reg_name', data, function(rendered){
    
    /*here is the rendered template.*/
        console.log(rendered);
        
    }); 
       
    /*
       Alternatively,synchronously
       var rendered = stud.render('template_reg_name', data);
        
        console.log(rendered);
        
     */

```

## Usage in Browser

### Compiling and Rendering Templates with `Stud`

```html
<!-- Include a copy of stud.js in the head section of your page -->
<script src='path/to/stud.js'></script>
```


```javascript

    /* You stud in the global object, window in this case */
    
    var data = {name:'steve', age:23, location:'US'},
    tmpl = "<td class='{name}'> {name} - {age} some of them are useful at location {location} as specified in the docs.</td>";
   
    /*The template will be registered with the name 'template_reg_name' */   
    var compiledTmpl = stud.compile(tmpl,'template_reg_name');  
      
    eval(compiledTmpl);
    
    stud.render('template_reg_name', data, function(rendered){
    
    /*here is the rendered template.*/
    /*
    <td class='steve'> steve - 23 some of them are useful at location US as specified in the docs.</td>
    */
        console.log(rendered);
        
    });    
        

```

That is all to it. Have fun compiling and rendering with `Stud`.
