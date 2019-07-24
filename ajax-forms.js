// JavaScript Document
$(document).on('ready',function() {
    $('form[data-submit="ajax"]')
        .on('submit',ajax_forms.process_form)
        .on('change keyup paste','input,textarea,select',function() {
            ajax_forms.hideError($(this));
        });
});

var ajax_forms = {

    process_form: function(event) {

        event.preventDefault();

        var form = $(this);
        var data = form.serialize();
        var url = form.attr('action');
        data.responseType = 'json';

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function(data) {
                if ( data.ok ) {
                    if ( ! data.redirect ) {
                        data.redirect = window.location.href;
                    }
                    window.location.href = data.redirect;
                } else {

                    let messages = [];
                    if ( data.message ) {
                        messages.push(data.message);
                    }

                    let errors = [];
                    if ( typeof data.errors === 'object' ) {
                        Object.keys(data.errors).forEach(function(key,index) {
                            errors.push({field:key,msg:data.errors[key]});
                        });
                    } else {
                        errors = data.errors;
                    }

                    if ( errors.length ) {

                        // show errors
                        $.each(errors,function(index,error) {
                            // get the input element
                            let element = $('[name='+error.field+']',form).first();
                            if ( element.length ) {
                                ajax_forms.showError(element,error.msg);
                            } else {
                                messages.push(error.field+": "+error.msg);
                            }
                        });

                        // set focus on first error
                        $('#'+errors[0].field).focus();
                    }

                    // Display popup if necessary
                    if ( messages.length ) {
                        alert(messages.join("\n"));
                    }

                }
            },
            error: function(xhr,status) {
                alert(xhr.responseText);
            }
        }); /* $.ajax */

    }, /* process_form */

    hideError: function(element) {
        element.closest('.form-group').removeClass('has-error');
        let name = element.attr('name');
        let errorElement = ajax_forms.errorElements[name];
        if ( errorElement !== undefined ) {
            errorElement.hide();
        }
    },

    showError: function(element,error) {
        // set error class on form-group
        var formGroup = element.closest('.form-group');
        formGroup.addClass('has-error');

        // get the error element
        let name = element.attr('name');
        let errorElement = ajax_forms.errorElements[name];
        if ( errorElement === undefined ) {
            // create new error element
            errorElement = $('<span></span>')
                .addClass("help-block")
                .text(error);
            // insert error element
            if (element.prop('type') === 'radio') {
                errorElement.appendTo(element.closest('div'));
            } else if (element.parent('.input-group').length || element.prop('type') === 'checkbox' ) {
                errorElement.insertAfter(element.parent());
            } else {
                errorElement.insertAfter(element);
            }
            // save error element for later
            ajax_forms.errorElements[name] = errorElement;
        } else {
            // use existing error element
            errorElement.text(error).show();
        }
    },

    errorElements: {}

}; /* ajax_forms */
