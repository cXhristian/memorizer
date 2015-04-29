(function() {
    var Form = function(form) {
        this.element = form;
        this.url = form.dataset.url;
        this.create = form.dataset['new'] !== undefined;
        this.method =  this.create ? 'POST' : 'PUT';
        
        // Form submit
        this.element.addEventListener('submit', function(e) {
            this.save(e);
        }.bind(this), false);
    };

    Form.prototype.save = function(e) {
        e.preventDefault();
        var data = {};
        // Loop through all input fields and get name, value pairs
        this.forEachInput(function(input) {
            data[input.name] = input.value;
        });
        // Send post request
        Ajax({url: this.url, data: data, method: this.method}, {
            success: function(data) {
                if(data.success) {
                    // Form was successfully submitted
                    this.forEachInput(function(input) {
                        if(input.type == 'hidden') {
                            // Ignore hidden fields
                            return;
                        }
                        this.emptyField(input.parentNode);
                        if(this.create) {
                            // Empty fields for creation of new objects
                            input.value = '';
                        }
                    });
                    Alert('Fullført', 'success');
                }
                else {
                    // Show valiations status
                    var errors = data.errors;
                    this.forEachInput(function(input) {
                        var field = input.parentNode;
                        var exists = this.emptyField(field);
                        if(!exists) {
                            return;
                        }
                        var errorList = field.getElementsByClassName('errors')[0];
                        if(input.name in errors) {
                            // Validation failed for field
                            field.classList.add('error');
                            // Add errors
                            errors[input.name].forEach(function(error) {
                                var li = document.createElement('li');
                                li.textContent = error;
                                errorList.appendChild(li);
                            });
                        }
                        else {
                            // Validation passed for field
                            field.classList.add('success');
                        }
                    });
                }
            }.bind(this),
            error: function() {
                Alert('Noe gikk forferdelig galt', 'error');
            }
        });
    };
    Form.prototype.inputs = function() {
        return this.element.querySelectorAll('input');
    };
    // Helper method to loop input elements with a callback function
    Form.prototype.forEachInput = function(callback) {
        var inputs = this.inputs();
        for(var i in inputs) {
            var input = inputs[i];
            if(input.name !== undefined && input.name !== '') {
                callback(input);
            }
        }
    };
    Form.prototype.emptyField = function(field) {
        if(field === undefined || !field.classList.contains('field')) {
            return false;
        }
        field.classList.remove('success', 'error');
        var errorList = field.getElementsByClassName('errors')[0];
        if(errorList === undefined) {
            // The field is missing an errorlist element and is probably hidden
            return false;
        }
        // Empty error list
        while(errorList.lastChild) {
            errorList.removeChild(errorList.lastChild);
        }
        return true;
    };
    // Initialize admin forms
    var forms = document.getElementsByClassName('form-admin');
    for (var i = 0; forms[i]; i++) {
        var form = new Form(forms[i]);
    }
})();
