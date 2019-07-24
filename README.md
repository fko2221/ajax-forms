# AJAX Form validation & submission
### Author: Kent Oyer
Dependencies
- Bootstrap 3
- JQuery

Forms that have data-submit="ajax" are converted to AJAX forms. When a form is submitted the form data is submitted via AJAX. 
The server should respond with a JSON object with the following structure:
 
```sh
{
   ok: true or false,           
   errors: [{
      field: "field_name",
      msg: "error message"
   }],
   redirect: "url"
}
```

Errors can also be returned as an object like this:

```sh
{
   ok: true or false,           
   errors: {
      field1name: "error message for field 1"
      field2name: "error message for field 2"
   }],
   message: "Display this as a popup message",
   redirect: "url"
}
```
If ok evaluates to true, the page is redirected to the redirect url. If no redirect url is returned from the server, the page simply reloads. If ok evaluates to false, the error messages are displayed next to the appropriate form fields.

