"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
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

var table_data

var fn_data_table =
    function() {
        function fn_data_table() {
            _classCallCheck(this, fn_data_table);

            this.init();
        }

        _createClass(fn_data_table, [{
            key: "init",
            value: function init() {
                this.table = this.table();
            }
        }, {
            key: "table",
            value: function table() {
                table_data = $('#dt-table-list').DataTable({
                    "processing": true,
                    "ajax": {
                        "url": "/sales-storetran-tempapi/",
                        "type": "GET",
                        "dataSrc": ""
                    },
                    responsive: true,
                    dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>\n        <'table-responsive'tr>\n        <'row align-items-center'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-end'p>>",
                    language: {
                        paginate: {
                            previous: '<i class="fa fa-lg fa-angle-left"></i>',
                            next: '<i class="fa fa-lg fa-angle-right"></i>'
                        }
                    },
                    columns: [{
                            data: 'product_name'
                        },
                        {
                            data: 'product_model'
                        },
                        {
                            data: 'unit_quantity'
                        },
                        {
                            data: 'quantity'
                        },
                        {
                            data: 'unit_price'
                        },
                        {
                            data: 'total_price'
                        },
                        {
                            "data": null,
                            "defaultContent": '\
                                <button type="button" class="btn btn-danger show-form-update"> Remove </button>\
                                '
                        }
                    ]
                });
            }
        }]);

        return fn_data_table;
    }();

var id = 0

let w_tran_screen = 'WAREHOUSE_TRANSFER';
let w_product_tran_screen = 'WAREHOUSE_TRANSFER';
let w_transaction_type = '';
let w_account_type = '';
let w_branch_code = 0;
const accountSearchUrl = `/apifinance-accounts-search/`;
const productSearchUrl = `/sales-products-search/`;

$(document).on('theme:init', function() {
    new fn_data_table();
});


$(document).ready(function() {
    initializeSelect2('id_branch_code');
    initializeSelect2('id_store_id');
});

// Event on document load
document.addEventListener("DOMContentLoaded", async function() {
    selectFieldOnClick('id_unit_quantity');
    selectFieldOnClick('id_unit_price');
    selectFieldOnClick('id_total_price');
    selectFieldOnClick('id_others_expense_amount');

    let branch_code = document.getElementById('id_global_branch_code').value;
    w_branch_code = branch_code;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code", branch_code);
    $('#id_branch_code').trigger('change');

    fnCalculateTotalTransferExpense();
});

$("#id_branch_code").on("change", async function() {
    w_branch_code = this.value;
    const tranTypeChoice = `/sales-choice-trantype`;
    let tranTypeParams = new URLSearchParams({
        'transaction_screen': w_tran_screen,
        'branch_code': w_branch_code
    });

    const tranTypeChoiceFullUrl = tranTypeChoice + '?' + tranTypeParams.toString();
    await setChoiceItemByGetRequest(tranTypeChoiceFullUrl, "id_tran_type_code");

    const default_type_code = document.getElementById('id_default_type_code').value;
    w_transaction_type = default_type_code;
    document.getElementById('id_tran_type_code').value = default_type_code;
    $('#id_tran_type_code').trigger('change');
    refresh_store_list(w_branch_code);
});


$("#id_tran_type_code").on("change paste keyup", async function() {
    document.getElementById("id_account_number").value = '';
    let account_number_spn = document.getElementById("select2-id_account_number-container");

    if (account_number_spn) {
        account_number_spn.textContent = "---------------";
    }
    w_transaction_type = document.getElementById('id_tran_type_code').value;
    w_account_type = '';
    w_include_closing = 'N';
    const account_number = document.getElementById('id_account_number');
    initAccountsSelect2WithAjax(w_branch_code, w_account_type, w_tran_screen, w_transaction_type, w_include_closing, accountSearchUrl, account_number, null);
});

$("#id_unit_quantity").on("change paste keyup", function() {
    fnCalculatePrice();
});

$("#id_unit_price").on("change paste keyup", function() {
    fnCalculatePrice();
});

$("#id_total_price").on("change paste keyup", function() {
    var quantity = document.getElementById('id_unit_quantity').value;
    var total_price = document.getElementById('id_total_price').value;
    if (quantity != 0) {
        var unit_price = Math.round((total_price / quantity) * 100) / 100;
        $('#id_unit_price').val(unit_price);
    }
});

$("#id_others_expense_amount").on("change paste keyup", function() {
    fnCalculateTotalTransferExpense();
});

function fnCalculatePrice() {
    var quantity = document.getElementById('id_unit_quantity').value;
    var unit_price = document.getElementById('id_unit_price').value;
    var total_price = Math.round((unit_price * quantity) * 100) / 100;
    $('#id_total_price').val(total_price);
}

function fnCalculateTotalTransferExpense() {
    let others_expense_amount = document.getElementById('id_others_expense_amount').value;
    let total_bill_amount = document.getElementById('id_total_bill_amount').value;
    let total_transfer_expense = parseFloat(others_expense_amount) + parseFloat(total_bill_amount);
    $('#id_total_transfer_expense').val(total_transfer_expense);
}

function refresh_store_list(branch_code) {
    var url = '/sales-choice-storelist';
    $.ajax({
        url: url,
        data: {
            'branch_code': branch_code
        },
        success: function(data) {
            $("#id_store_id").html(data);
        }
    });
    return false;
}

$("#id_product_id").on("change paste keyup", function() {
    var branch_code = document.getElementById('id_branch_code').value;
    var product_id = document.getElementById('id_product_id').value;
    refresh_batch_list(branch_code, product_id);
    get_product_name()
});

$("#id_product_bar_code").on("change paste keyup", function(e) {
    get_product_info_barcode()
    var key = e.which;
    if (key == 13) // the enter key code
    {
        var product_name = document.getElementById('id_product_name').value;
        if (product_name === '') {
            alert('Please Enter Product Information')
        } else {
            post_tran_table_data();
        }
    }
});

function get_product_name() {
    var product_id = document.getElementById('id_product_id').value;
    $.ajax({
        url: "/sales-product-info/" + product_id,
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                $('#id_product_name').val(data.product_name);
                $('#id_product_bar_code').val(data.product_bar_code);
                $('#id_quantity').val(1);
                $('#id_unit_price').val(data.store_transfer_rate);
                $('#id_product_model').val(data.product_model);
                $('#id_product_unit_id').val(data.product_unit_id);
                generateTransactionListItems(data.product_unit_id, unit_transaction_dictionary);
                $('#id_transaction_unit_id').val(data.product_unit_id);
            } else {
                $('#id_product_name').val('Invalid Product');
            }
        }
    })
    return false;
}

function get_product_info_barcode() {
    var product_bar_code = document.getElementById('id_product_bar_code').value;
    $.ajax({
        url: "/sales-product-info-barcode/" + product_bar_code,
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                $('#id_product_name').val(data.product_name);
                $('#div_id_product_id').val(data.product_id);
                $('#id_quantity').val(1);
                $('#id_product_model').val(data.product_model);
                $('#id_product_unit_id').val(data.product_unit_id);
                generateTransactionListItems(data.product_unit_id, unit_transaction_dictionary);
                $('#id_transaction_unit_id').val(data.product_unit_id);
            } else {
                $('#id_product_name').val('Invalid Product');
            }
        }
    })
    return false;
}

function refresh_batch_list(branch_code, product_id) {
    var url = "/sales-choice-batchlist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
            product_id: product_id,
        },
        success: function(data) {
            $("#id_batch_id").html(data);
        },
    });
    return false;
}

$(function() {

    $('#dt-table-list').on('click', 'button', function() {

        try {
            var table_row = table_data.row(this).data();
            id = table_row['id']
        } catch (e) {
            var table_row = table_data.row($(this).parents('tr')).data();
            id = table_row['id']
        }

        var class_name = $(this).attr('class');
        if (class_name == 'btn btn-warning show-form-update') {
            show_edit_product_data(id)
        }

        if (class_name == 'btn btn-danger show-form-update') {
            Swal.fire({
                title: 'Are you sure you want to remove this item?',
                icon: "question",
                showDenyButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `No`
            }).then((result) => {
                if (result.isConfirmed) {
                    stock_details_delete(id);
                } else if (result.isDenied) {
                    Swal.fire("No Change");
                }
            });
        }

    })

    function show_edit_product_data(id) {
        $.ajax({
            url: '/sales-storetran-edit/' + id,
            type: 'get',
            dataType: 'json',
            beforeSend: function() {
                $('#product_edit').modal('show');
            },
            success: function(data) {
                $('#product_edit .modal-content').html(data.html_form);
            }
        })
    }

    function stock_details_delete(id) {
        $.ajax({
            url: '/sales-storetran-delete/' + id,
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                if (data.form_is_valid) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Delete",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $('#id_total_quantity').val(data.total_quantity);
                    $('#id_total_bill_amount').val(data.total_bill_amount);
                    table_data.ajax.reload();
                    fnCalculateTotalTransferExpense();

                } else {
                    table_data.ajax.reload();

                }

            }
        })
        return false;
    }


});



function stock_details_delete_all() {
    confirm("Are you sure you want to remove this item?").then(
        (e) => {
            if (e == true) {
                $.ajax({
                    url: '/sales-storetran-delete-all',
                    type: 'POST',
                    dataType: 'json',
                    success: function(data) {
                        if (data.form_is_valid) {
                            $('#id_total_quantity').val(data.total_quantity);
                            $('#id_total_bill_amount').val(data.total_bill_amount);
                            fnCalculateTotalTransferExpense();
                            table_data.ajax.reload();
                        } else {
                            table_data.ajax.reload();
                        }
                    }
                })
            }
        }
    );
    return true;
}

$('#btnAddItem').click(function() {
    var branch_code = document.getElementById('id_branch_code').value;
    $('#id_detail_branch_code').val(branch_code);
    post_tran_table_data();
});

$(function() {
    $('#btn_stock_sumbit').click(function() {
        post_stock_master_data();

    });
});

function post_tran_table_data() {
    var data_string = $("#stock_master_form").serialize();
    var data_url = $("#stock_master_form").attr('data-url');
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: data_string,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                document.getElementById("stock_master_form").reset();
                $('#id_total_quantity').val(data.total_quantity);
                $('#id_total_bill_amount').val(data.total_bill_amount);
                fnCalculateTotalTransferExpense();
                table_data.ajax.reload();
                $('#page_loading').modal('hide');
                $('#id_product_name').val('');
                $('#id_product_id').val('');
                $('#id_quantity').val(1);
                var product_id_span = document.getElementById("select2-id_product_id-container");
                product_id_span.textContent = "---------------";
                try {
                    var batch_id = document.getElementById("select2-id_batch_id-container");
                    batch_id.textContent = "---------------";
                    $('#id_batch_id').val('0');
                } catch (e) {}
            } else {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: data.error_message,
                })
                table_data.ajax.reload();
                $('#page_loading').modal('hide');
            }
        }
    })
    return false;
}

function post_stock_master_data() {
    var data_string = $("#stock_master_post").serialize();
    var data_url = $("#stock_master_post").attr('data-url');
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: data_string,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                alert(data.message);
                document.getElementById("stock_master_post").reset();
                document.getElementById("stock_master_form").reset();
                table_data.ajax.reload();
                $('#page_loading').modal('hide');
                var global_branch_code = document.getElementById('id_global_branch_code').value;
                $('#id_branch_code').val(global_branch_code);
                var store_id = document.getElementById("select2-id_store_id-container");
                store_id.textContent = "-----------";
                $('#id_total_price').val(0.00);
                if (data.invoice_print_auto) {
                    print_invoice(data.transaction_id)
                }
            } else {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: data.error_message,
                })
                table_data.ajax.reload();
                $('#page_loading').modal('hide');
            }
        }
    })
    return false;
}


function print_invoice(p_transaction_id) {
    var data_url = 'appauth-report-submit/';
    var report_name = 'store_invoice';
    var report_data = {
        'p_transaction_id': p_transaction_id
    };
    report_data = JSON.stringify(report_data);
    $.ajax({
        url: data_url,
        data: {
            'report_name': report_name,
            "report_data": report_data
        },
        cache: "false",
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                window.open(data.report_urls + '/sales-storetran-invoice-print-view', "_blank");
            } else {
                alert(data.error_message)
            }
        }
    })
    return false;
}

function generateTransactionListItems(product_unit_id, resultDict) {
    var keyName = lower_unit_dictionary[product_unit_id]
    var selectElement = document.getElementById("id_transaction_unit_id");
    // Clear existing options
    selectElement.innerHTML = '<option value="">------------</option>';
    // Check if the key exists in the dictionary
    if (keyName in resultDict) {
        var unitDictionary = resultDict[keyName];
        // Iterate over the unit dictionary and create options
        for (var unitId in unitDictionary) {
            var option = document.createElement("option");
            option.value = unitId;
            option.textContent = unitDictionary[unitId];
            selectElement.appendChild(option);
        }
    }
}