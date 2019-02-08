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
					// hide previous error messages
					//$.each(ajax_forms.errorElements,function(key,element) {
					//	element.hide();
					//});
					
					// loop through errors
					var messages = '';
					$.each(data.errors,function(index,error) {
						if ( error.field ) {
							// get the input element
							var element = $('[name='+error.field+']').first();
							ajax_forms.showError(element,error.msg);
						} else {
							messages = messages + error.msg + "<br />";
						}
					});
					
					// set focus on first error
					$('#'+data.errors[0].field).focus();
					
					// Display popup if necessay
					if ( messages ) {
						if ( typeof bootbox !== 'undefined' ) {
							bootbox.alert({title: '<i class="fa fa-exclamation-circle text-danger"></i> Error',
										   message: messages
										  });
						} else {
							alert(messages);
						}
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
		name = element.attr('name');
		errorElement = ajax_forms.errorElements[name];
		if ( errorElement !== undefined ) {
			errorElement.hide();
		}
	},
	
	showError: function(element,error) {
		// set error class on form-group
		var formGroup = element.closest('.form-group');
		formGroup.addClass('has-error');

		// get the error element
		name = element.attr('name');
		errorElement = ajax_forms.errorElements[name];
		if ( errorElement === undefined ) {
			// create new error element
			errorElement = $('<span></span>')
							.addClass("help-block")
							.text(error);
			// insert error element 
			if (element.prop('type') === 'radio') {
				errorElement.prependTo(formGroup);
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
	
} /* ajax_forms */

