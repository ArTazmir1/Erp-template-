function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrfToken;
}

function getMapAPIKey() {
    const api_key = document.getElementById('id_maps_api_key').value;
    return api_key;
}

function fnSuccessSwalMessage(message, messageTitle = "Success!") {
    Swal.fire({
        title: messageTitle,
        text: message,
        icon: "success",
        customClass: {
            confirmButton: "btn btn-primary w-xs me-2 mt-2",
        },
        buttonsStyling: false,
        timer: 1500
    });
}

function fnFailedSwalMessage(message, messageTitle = "Failed!") {
    Swal.fire({
        title: messageTitle,
        text: message,
        icon: "error",
        customClass: {
            confirmButton: "btn btn-primary w-xs mt-2"
        },
        buttonsStyling: false,
        showCloseButton: true
    });
}

function fnFailedSwalHTMLMessage(message, messageTitle = "Failed!") {
    Swal.fire({
        title: messageTitle,
        html: message,
        icon: "error",
        customClass: {
            confirmButton: "btn btn-primary w-xs mt-2"
        },
        buttonsStyling: false,
        showCloseButton: true
    });
}

async function fnSwalAskConfirmation(message, messageTitle = "Are you sure?") {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success m-2",
            cancelButton: "btn btn-danger m-2",
        },
        buttonsStyling: false,
    });
    let data = await swalWithBootstrapButtons
        .fire({
            title: messageTitle,
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, do it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                return false;
            }
        });
    return data;
}

function roundNumber(values) {
    const output_data = (Math.round(values * 100) / 100);
    return output_data;
}


function fnGetBranchCode() {
    const branchCodeElement = document.getElementById('id_branch_code');
    if (branchCodeElement) {
        return branchCodeElement.value;
    } else {
        return document.getElementById('id_global_branch_code').value;
    }
}


function initializeSelect2(elementId) {
    try {
        const selectElement = document.getElementById(elementId);
        if (selectElement) {
            $(selectElement).select2();
        }
    } catch (e) {
        console.error(e);
    }
}

function selectFieldOnClick(elementId) {
    try {
        const clickElement = document.getElementById(elementId);
        if (clickElement) {
            clickElement.addEventListener("click", function() {
                clickElement.select();
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function clearSelect2Value(elementId) {
    try {
        const selectElement = document.getElementById(elementId);
        if (selectElement) {
            $(selectElement).val(null).trigger('change');
        }
    } catch (e) {
        console.error(e);
    }
}

function getElementValue(elementId) {
    try {
        const selectElement = document.getElementById(elementId);
        if (selectElement) {
            return selectElement.value;
        } else {
            console.warn(`Element with ID "${elementId}" not found.`);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function setElementValue(elementId, value) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
        } else {
            console.warn(`Element with ID "${elementId}" not found.`);
        }
    } catch (e) {
        console.error(`Error setting value for element with ID "${elementId}":`, e);
    }
}

async function generateAndAssignChoiceList(url, requestType, inputData, choiceValue, displayValue, elementId, isEmpyAdd = false, selectedValue = null) {
    try {
        const response = await fetch(url, {
            method: requestType,
            body: inputData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        let json_data;
        if (requestType == 'POST') {
            json_data = data.data;
        } else {
            json_data = data;
        }

        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.innerHTML = '';
            if (isEmpyAdd) {
                const option = document.createElement('option');
                option.value = ''; // Assign the value from the specified key
                option.textContent = '---------'; // Set the display text
                targetElement.appendChild(option);
            }
            json_data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[choiceValue]; // Assign the value from the specified key
                option.textContent = item[displayValue]; // Set the display text

                if (selectedValue !== null && String(item[choiceValue]) === String(selectedValue)) {
                    option.selected = true;
                }

                targetElement.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error generating choice list:', error);
    }
}

/* ********************************************************
To send form data, which must be reset after a successful operation. It will also show a proper alert.
/* *******************************************************/
async function submitFormData(formId, submitButtonId, insertRecord, tableId = '#tran-data-table') {
    const form = document.getElementById(formId);
    const url = form.getAttribute('data-url');
    const formData = new FormData(form);
    const submitButton = document.getElementById(submitButtonId);
    const loadingModal = document.getElementById('page_loading');
    loadingModal.style.display = 'block';
    loadingModal.classList.add('show');
    submitButton.disabled = true;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
        });

        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        submitButton.disabled = false;

        if (response.ok) {
            const result = await response.json();
            if (result.form_is_valid) {
                if (insertRecord) {
                    await fnSuccessSwalMessage(result.success_message, "Save Successfully!");
                    form.reset();
                } else {
                    await fnSuccessSwalMessage(result.success_message, "Update Successfully!");
                    if (editModalInstance) {
                        editModalInstance.hide();
                    }
                }
                if (tableId) {
                    $(tableId).DataTable().ajax.reload();
                }
                return true;
            } else {
                if (result.form_validation_failed) {
                    let errorMessages = "";
                    for (const [label, messages] of Object.entries(result.error_message)) {
                        errorMessages += `<strong style="color: red;">${label}:</strong> ${messages.join(', ')}<br>`;
                    }
                    fnFailedSwalHTMLMessage(errorMessages, "Ops. Validation Failed!");
                } else {
                    fnFailedSwalMessage(result.error_message, "Ops. Validation Failed!")
                }
                return false;
            }
        } else {
            fnFailedSwalMessage("Server Response Not Found!", "HTTP Request Failed!")
            return false;
        }
    } catch (error) {
        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        submitButton.disabled = false;
        fnFailedSwalMessage(error, "Unexpected Error!")
        return false; // Return false on error
    }
}

/* ********************************************************
    Other than form data submission, any transaction that needs to block the user screen and 
    show an alert message to the user. This function must be used to communicate with the backend. 
/* *******************************************************/
async function fnSendLockPostRequest(formData, requestUrl) {
    const loadingModal = document.getElementById('page_loading');
    loadingModal.style.display = 'block';
    loadingModal.classList.add('show');
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
        });
        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        if (response.ok) {
            const result = await response.json();
            if (result.form_is_valid) {
                return result;
            } else {
                if (result.form_validation_failed === true) {
                    let errorMessages = "";
                    for (const [label, messages] of Object.entries(result.error_message)) {
                        errorMessages += `<strong style="color: red;">${label}:</strong> ${messages.join(', ')}<br>`;
                    }
                    fnFailedSwalHTMLMessage(errorMessages, "Ops. Validation Failed!");
                } else {
                    fnFailedSwalMessage(result.error_message, "Ops. Validation Failed!")
                }
                return false;
            }
        } else {
            fnFailedSwalMessage("Server Response Not Found!", "HTTP Request Failed!")
            return false;
        }
    } catch (error) {
        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        fnFailedSwalMessage(error, "Unexpected Error!")
        return false;
    }
}


/* ********************************************************
    Any type of communication with a backend API that requires receiving data from the backend.
    This is the right function to call.
/* *******************************************************/
async function fnBackendCommunicator(inputData, requestType, requestUrl) {
    try {
        const response = await fetch(requestUrl, {
            method: requestType,
            body: inputData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
        });
        if (response.ok) {
            const result = await response.json();
            if (result.form_is_valid) {
                return result;
            } else {
                if (result.form_validation_failed) {
                    let errorMessages = "";
                    for (const [label, messages] of Object.entries(result.error_message)) {
                        errorMessages += `<strong style="color: red;">${label}:</strong> ${messages.join(', ')}<br>`;
                    }
                    fnFailedSwalHTMLMessage(errorMessages, "Ops. Validation Failed!");
                } else {
                    fnFailedSwalMessage(result.error_message, "Ops. Validation Failed!")
                }
                return false;
            }
        } else {
            fnFailedSwalMessage("Server Response Not Found!", "HTTP Request Failed!")
            return false;
        }
    } catch (error) {
        fnFailedSwalMessage(error, "Unexpected Error!")
        return false;
    }
}

/* ********************************************************
To load any type of data table, it is a perfect function to call.
/* *******************************************************/
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

let dataTableData;

let fnInitializeDataTable =
    /*#__PURE__*/
    function() {
        function fnInitializeDataTable() {
            _classCallCheck(this, fnInitializeDataTable);
        }

        _createClass(fnInitializeDataTable, [{
            key: "init",
            value: function init() {
                // Initialize other components if needed
            }
        }, {
            key: "table",
            value: async function table(tableId, requestUrl, columns, filterData = {}, requestType = 'GET', rowCallback = null, dataSrc = "") {
                try {
                    // Initialize DataTable with optional rowCallback
                    const dataTableConfig = {
                        "processing": true,
                        destroy: true,
                        "ajax": {
                            "url": requestUrl,
                            "type": requestType,
                            "data": function(d) {
                                return $.extend({}, d, filterData);
                            },
                            "dataSrc": dataSrc,
                            /*
                            "dataSrc": function (json) {
                                console.log("AJAX Response: ", json); // Print the AJAX response
                                return dataSrc ? dataSrc(json) : json.data; // Ensure the right data is returned
                            },
                             */
                            "error": function(xhr, error, code) {
                                console.error("AJAX Error: ", error);
                                fnFailedSwalMessage(`Error fetching data: ${xhr.statusText} (${xhr.status})`);
                            }
                        },
                        responsive: true,
                        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>\n        <'table-responsive'tr>\n        <'row align-items-center'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-end'p>>",
                        language: {
                            paginate: {
                                previous: '<i class="fa fa-lg fa-angle-left"></i>',
                                next: '<i class="fa fa-lg fa-angle-right"></i>'
                            }
                        },
                        columns: columns,
                        columnDefs: [{
                            "defaultContent": "-",
                            "targets": "_all"
                        }], // Pass the columns variable here
                    };

                    if (rowCallback) {
                        dataTableConfig.rowCallback = rowCallback;
                    }

                    dataTableData = $(tableId).DataTable(dataTableConfig);

                } catch (error) {
                    console.error("Error initializing DataTable: ", error);
                    fnFailedSwalMessage("Error in initializing data. Please try again.");
                }
            }
        }]);

        return fnInitializeDataTable;
    }();


/* ********************************************************
To edit record by using modal window you should consider this function.
/* *******************************************************/
let editModalInstance; // Declare a variable to hold the modal instance

function fnEditRecord(id) {
    const url = `${editDataUrl}/${id}`;
    fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.form_is_valid) {
                const modalContent = document.querySelector('#editModal .modal-content');
                modalContent.innerHTML = data.html_form.trim();

                if (!editModalInstance) {
                    editModalInstance = new bootstrap.Modal(document.getElementById('editModal'));
                }

                editModalInstance.show();
            } else {
                fnFailedSwalMessage(data.error_message, "Error!");
            }
        })
        .catch(error => {
            fnFailedSwalMessage(`An error occurred: ${error}`, "Error!");
        });
}



/* ********************************************************
Show Custom Modal Window
/* *******************************************************/

let modalInstances = {}; // store multiple modal instances by name

function fnShowModalWindow(modalName, urlLink) {
    fetch(urlLink, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.form_is_valid) {
                const modalContent = document.querySelector(`#${modalName} .modal-content`);
                modalContent.innerHTML = data.html_form.trim();

                if (!modalInstances[modalName]) {
                    modalInstances[modalName] = new bootstrap.Modal(document.getElementById(modalName));
                }

                modalInstances[modalName].show();
            } else {
                fnFailedSwalMessage(data.error_message, "Error!");
            }
        })
        .catch(error => {
            fnFailedSwalMessage(`An error occurred: ${error}`, "Error!");
        });
}

/* ********************************************************
If you want to send delete request to backend, please call this function
/* *******************************************************/
async function fnRemoveRecord(id, deleteUrl, tableId = '#tran-data-table') {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success m-2",
            cancelButton: "btn btn-danger m-2",
        },
        buttonsStyling: false,
    });

    // Show confirmation dialog
    const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, keep it!",
        reverseButtons: true,
    });

    // If cancelled, return an object with status false
    if (!result.isConfirmed) {
        return {
            status: false
        };
    }

    const loadingModal = document.getElementById('page_loading');
    loadingModal.style.display = 'block'; // Show loading modal
    loadingModal.classList.add('show'); // Add Bootstrap 'show' class
    const fullUrl = `${deleteUrl}${id}`;

    try {
        // Send DELETE request
        const response = await fetch(fullUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        });

        loadingModal.style.display = 'none'; // Hide loading modal
        loadingModal.classList.remove('show');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.form_is_valid) {
            fnSuccessSwalMessage(data.success_message, "Deleted!");
            if (tableId) {
                $(tableId).DataTable().ajax.reload();
            }
        } else {
            fnFailedSwalMessage(data.error_message);
        }
        return data;
    } catch (error) {
        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        fnFailedSwalMessage(`An error occurred: ${error.message}`, "Error!");
        console.error(error);
        return {
            status: false,
            message: error.message
        };
    }
}

async function setReportContent(inputData, requestType, requestUrl, reportBodyId) {
    try {
        const response = await fetch(requestUrl, {
            method: requestType,
            body: inputData,
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const result = await response.json();
            if (result.form_is_valid) {
                document.getElementById(reportBodyId).innerHTML = result.reportContent;
                return true;
            } else {
                fnFailedSwalMessage(result.error_message, "Error!");
                return false;
            }
        } else {
            fnFailedSwalMessage("HTTP Request Failed!", "Server Error!");
            return false;
        }
    } catch (error) {
        fnFailedSwalMessage(error, "Unexpected Error!");
        return false;
    }
}


async function setChoiceItemByGetRequest(baseUrl, setFieldId, selectedValue = null, params = {}, options = {}) {
    const setFieldElement = document.getElementById(setFieldId);
    if (!setFieldElement) {
        return false;
    }

    // ✅ Define fullUrl before condition
    let fullUrl = baseUrl;
    if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        fullUrl = `${baseUrl}?${queryString}`;
    }

    const {
        validateSelection = true,
            triggerEvents = true,
            callback = null,
            showLoader = false
    } = options;

    if (showLoader) {
        setFieldElement.innerHTML = '<option>Loading...</option>';
        setFieldElement.disabled = true;
    }

    try {
        const response = await fetch(fullUrl, {
            method: 'GET'
        });

        if (response.ok) {
            const result = await response.text();
            setFieldElement.innerHTML = result;
            setFieldElement.disabled = false;

            if (selectedValue !== null && selectedValue !== undefined) {
                setTimeout(() => {
                    const optionExists = Array.from(setFieldElement.options)
                        .some(opt => opt.value === String(selectedValue));

                    if (validateSelection && !optionExists) {
                        console.warn(`Value "${selectedValue}" not found in options for field "${setFieldId}"`);
                        if (callback) callback(false, setFieldElement, 'Value not found');
                        return;
                    }

                    setFieldElement.value = selectedValue;

                    if ($(setFieldElement).hasClass('select2-hidden-accessible')) {
                        $(setFieldElement).val(selectedValue).trigger('change');
                    }

                    if (triggerEvents) {
                        setFieldElement.dispatchEvent(new Event('change'));
                    }

                    if (callback) callback(true, setFieldElement, selectedValue);
                }, 100);
            }

            return true;
        } else {
            fnFailedSwalMessage("HTTP Request Failed!", "Server Error!");
            return false;
        }
    } catch (error) {
        setFieldElement.disabled = false;
        fnFailedSwalMessage(error, "Unexpected Error!");
        return false;
    }
}

/// Select2 Search function begin
function Select2formatRepo(product) {
    if (product.loading) {
        return 'Loading...';
    }
    let markup = `<div class="select2-result-product clearfix">
                    <div class="select2-result-product__name">${product.text}</div>
                  </div>`;
    return markup;
}

function Select2formatRepoSelection(product) {
    return product.text || product.text;
}

function initProductSelect2WithAjax(branch_code, product_tran_screen, fullUrl, selectElement, tran_type_code = null) {
    try {
        $(selectElement).select2({
            placeholder: '-------------',
            allowClear: true,
            ajax: {
                url: fullUrl,
                dataType: 'json',
                delay: 250, // Delay for better UX
                data: function(params) {
                    return {
                        q: params.term, // Query term from the search input
                        page: params.page, // Pagination parameter
                        branch_code: branch_code, // Pass branch_code from function parameter
                        product_tran_screen: product_tran_screen, // Pass product_tran_screen from function parameter
                        tran_type_code: tran_type_code // Pass tran_type_code if needed
                    };
                },
                processResults: function(data, params) {
                    params.page = params.page || 1; // Ensure page number is set
                    return {
                        results: data.map(function(product) {
                            return {
                                id: product.id, // Use product ID
                                text: product.text // Use product name
                            };
                        }),
                        pagination: {
                            more: data.length === 10 // Assume there are more results if 10 records are returned
                        }
                    };
                },
                cache: true // Enable caching for repeated queries
            },
            escapeMarkup: function(markup) {
                return markup; // Allow HTML markup in the results
            },
            minimumInputLength: 1, // Minimum characters required to start search
            templateResult: Select2formatRepo, // Format result (optional, if you want custom formatting)
            templateSelection: Select2formatRepoSelection // Format selected item (optional)
        });
    } catch (error) {
        console.error(error);
    }
}

function initAccountsSelect2WithAjax(p_branch_code, p_account_type, p_tran_screen, p_transaction_type, p_including_closed_ac, fullUrl, selectElement, debit_credit = null) {
    try {
        $(selectElement).select2({
            placeholder: '-------------',
            allowClear: true,
            ajax: {
                url: fullUrl,
                dataType: 'json',
                delay: 250, // Delay for better UX
                data: function(params) {
                    return {
                        q: params.term, // Query term from the search input
                        page: params.page, // Pagination parameter
                        account_type: p_account_type,
                        tran_screen: p_tran_screen,
                        transaction_type: p_transaction_type,
                        including_closed: p_including_closed_ac,
                        branch_code: p_branch_code,
                        debit_credit: debit_credit // Pass debit/credit type if needed
                    };
                },
                processResults: function(data, params) {
                    params.page = params.page || 1; // Ensure page number is set
                    return {
                        results: data.map(function(product) {
                            return {
                                id: product.id, // Use product ID
                                text: product.text // Use product name
                            };
                        }),
                        pagination: {
                            more: data.length === 10 // Assume there are more results if 10 records are returned
                        }
                    };
                },
                cache: true // Enable caching for repeated queries
            },
            escapeMarkup: function(markup) {
                return markup; // Allow HTML markup in the results
            },
            minimumInputLength: 1, // Minimum characters required to start search
            templateResult: Select2formatRepo, // Format result (optional, if you want custom formatting)
            templateSelection: Select2formatRepoSelection // Format selected item (optional)
        });
    } catch (error) {
        console.error(error);
    }
}

async function showSwalAskPrompt(requestUrl, title, id, status, message) {
    Swal.fire({
        title: title,
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (reject_remarks) => {
            if (!reject_remarks) {
                Swal.showValidationMessage(
                    message
                );
                return false;
            }
            return reject_remarks;
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('status', status);
            formData.append('reject_remarks', result.value);
            try {
                const response = await fetch(requestUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.form_is_valid) {
                        fnSuccessSwalMessage(result.success_message)
                        return result;
                    } else {
                        fnFailedSwalMessage(result.error_message)
                        return false;
                    }
                } else {
                    fnFailedSwalMessage("HTTP Request Failed!", "Server Error!");
                    return false;
                }
            } catch (error) {
                fnFailedSwalMessage(error, "Unexpected Error!");
                return false;
            }

        }
    });
}

async function receiveSwalPromptValue(title, message) {
    return Swal.fire({
        title: title,
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (reject_remarks) => {
            if (!reject_remarks) {
                Swal.showValidationMessage(message);
                return false;
            }
            return reject_remarks;
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            return result.value;
        }
        return null;
    });
}

async function fnCancelTransaction(id, cancelUrl, tableId = '#tran-data-table') {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success m-2",
            cancelButton: "btn btn-danger m-2",
        },
        buttonsStyling: false,
    });

    // Show confirmation dialog
    const result = await swalWithBootstrapButtons
        .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cancel it!",
            cancelButtonText: "No, keep it!",
            reverseButtons: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                return false;
            }
        });

    // If cancelled, return an object with status false
    if (!result) {
        return {
            status: false
        };
    }

    const loadingModal = document.getElementById('page_loading');
    loadingModal.style.display = 'block';
    loadingModal.classList.add('show');
    const fullUrl = `${cancelUrl}${id}`;

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        });

        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.form_is_valid) {
            fnSuccessSwalMessage(data.success_message, "Cancelled!")
            if (tableId) {
                $(tableId).DataTable().ajax.reload();
            }
        } else {
            fnFailedSwalMessage(data.error_message);
        }
        return data;
    } catch (error) {
        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        fnFailedSwalMessage(`An error occurred: ${error.message}`, "Error!");
        console.error(error);
        return {
            status: false,
            message: error.message
        };
    }
}

// Show Report
async function saveAndShowReport(fullUrl, formData, requestType, reportUrl) {
    const detalsData = await fnBackendCommunicator(formData, requestType, fullUrl);
    if (detalsData.form_is_valid) {
        window.open(detalsData.report_urls + reportUrl, "_blank");
    } else {
        fnFailedSwalMessage(detalsData.error_message);
    }
}

const GOOGLE_MAPS_API_KEY = getMapAPIKey();

// async function loadGoogleMapsScript() {
//     if (window.google && window.google.maps) return; // Already loaded

//     return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
//         script.async = true;
//         script.defer = true;

//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error('Google Maps script failed to load'));

//         document.head.appendChild(script);
//     });
// }
// ----------------- Shared Google Maps Loader -----------------
let googleMapsScriptPromise = null;

function loadGoogleMapsScript() {
    if (window.google && window.google.maps && window.google.maps.geometry) {
        return Promise.resolve();
    }

    if (googleMapsScriptPromise) return googleMapsScriptPromise;

    googleMapsScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existingScript) {
            existingScript.addEventListener('load', resolve);
            existingScript.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${getMapAPIKey()}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            googleMapsScriptPromise = null;
            reject(new Error('Google Maps script failed to load'));
        };
        document.head.appendChild(script);
    });

    return googleMapsScriptPromise;
}

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            const map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: lat,
                    lng: lng
                },
                zoom: 13
            });

            const marker = new google.maps.Marker({
                position: {
                    lat: lat,
                    lng: lng
                },
                map: map,
                draggable: true
            });

            // Set initial form values
            document.getElementById('id_lat').value = lat;
            document.getElementById('id_lng').value = lng;
            document.getElementById('id_accuracy').value = accuracy;

            // Update form fields on marker drag
            google.maps.event.addListener(marker, 'position_changed', function() {
                const lat = marker.getPosition().lat();
                const lng = marker.getPosition().lng();
                document.getElementById('id_lat').value = lat;
                document.getElementById('id_lng').value = lng;
            });

            // Set marker position on map click
            google.maps.event.addListener(map, 'click', function(event) {
                marker.setPosition(event.latLng);
            });

            // ✅ Add "Locate Me" Button
            const locationButton = document.createElement("button");
            locationButton.innerHTML = "📍My Location";
            locationButton.classList.add("custom-map-control-button");

            // Optional styling (can be moved to a CSS file)
            locationButton.style.backgroundColor = "#fff";
            locationButton.style.border = "2px solid #fff";
            locationButton.style.borderRadius = "3px";
            locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
            locationButton.style.cursor = "pointer";
            locationButton.style.margin = "10px";
            locationButton.style.padding = "8px 12px";
            locationButton.style.fontSize = "14px";

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

            locationButton.addEventListener("click", () => {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    const pos = {
                        lat,
                        lng
                    };

                    map.setCenter(pos);
                    marker.setPosition(pos);

                    document.getElementById('id_lat').value = lat;
                    document.getElementById('id_lng').value = lng;
                    document.getElementById('id_accuracy').value = accuracy;
                }, () => {
                    handleLocationError(true);
                });
            });

        }, function() {
            handleLocationError(true);
        });
    } else {
        handleLocationError(false);
    }
}

function handleLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation ? 'Please Allow Location Access' : 'Error: Your browser doesn\'t support geolocation.');
}

function printReportArea() {
    var printContents = document.getElementById('report-print-area').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
}

function getFormDataAsJSON() {
    let formData = {};
    $('#tran_table_data')
        .find('input, select, textarea')
        .each(function() {
            let name = $(this).attr('name');
            if (name) {
                formData[name] = $(this).val() || "";
            }
        });
    return [formData];
}

function fnSaveAndShowReport(report_url, report_name, data_url = '/appauth-report-submit/') {
    var form_data = getFormDataAsJSON()[0];
    var report_data = JSON.stringify(form_data);
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: {
            'report_name': report_name,
            "report_data": report_data
        },
        cache: false,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            $('#page_loading').modal('hide');
            if (data.form_is_valid) {
                window.open(data.report_urls + "/" + report_url, "_blank");
            } else {
                alert(data.error_message);
            }
        }
    });

    return false;
}

$('#advanceFilterCollapse').on('show.bs.collapse', function() {
    $(this).prev('.card-header').find('.arrow-icon i')
        .removeClass('fa-chevron-right')
        .addClass('fa-chevron-down');
});

$('#advanceFilterCollapse').on('hide.bs.collapse', function() {
    $(this).prev('.card-header').find('.arrow-icon i')
        .removeClass('fa-chevron-down')
        .addClass('fa-chevron-right');
});