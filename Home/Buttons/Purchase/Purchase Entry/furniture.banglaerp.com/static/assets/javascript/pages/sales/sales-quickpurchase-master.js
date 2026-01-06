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
                        "url": "/sales-stockdetails-tempapi/",
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
                            data: 'transaction_unit_id'
                        },
                        {
                            data: 'unit_quantity'
                        },
                        {
                            data: 'purces_price'
                        },
                        {
                            data: 'discount_amount'
                        },
                        {
                            data: 'total_price'
                        },
                        {
                            "data": null,
                            "defaultContent": '<button type="button" class="btn btn-danger show-form-update"> <span class="glyphicon glyphicon-pencil"></span>Remove</button>'
                        }
                    ]
                });
            }
        }]);

        return fn_data_table;
    }();

var id = 0

let w_tran_screen = 'QUICK_PURCHASE';
let w_product_tran_screen = 'QUICK_PURCHASE';
let w_transaction_type = '';
let w_account_type = '';
let w_branch_code = '';
const accountSearchUrl = `/apifinance-accounts-search/`;
const productSearchUrl = `/sales-products-search/`;

$(document).on('theme:init', function() {
    new fn_data_table();
});

function roundNumber(values) {
    var output_data = (Math.round(values * 100) / 100);
    return output_data;
}

// Event on document load
document.addEventListener("DOMContentLoaded", async function() {
    initializeSelect2('id_project_batch_id');
    selectFieldOnClick('id_unit_quantity');
    selectFieldOnClick('id_free_quantity');

    let branch_code = document.getElementById('id_global_branch_code').value;
    w_branch_code = branch_code;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;
    $('#id_branch_code').trigger('change');

    const free_product_id = document.getElementById('id_free_product_id');

    if (free_product_id) {
        initProductSelect2WithAjax(branch_code, w_tran_screen, productSearchUrl, free_product_id, w_transaction_type);
    }
});

$("#id_branch_code").on("change", async function() {
    w_branch_code = this.value;
    const tranTypeChoice = `/sales-choice-trantype`;
    let tranTypeParams = new URLSearchParams({
        'transaction_screen': w_tran_screen,
        'branch_code': w_branch_code
    });

    const tranTypeChoiceFullUrl = tranTypeChoice + '?' + tranTypeParams.toString();
    await setChoiceItemByGetRequest(tranTypeChoiceFullUrl, "id_type_code");

    const default_type_code = document.getElementById('id_default_type_code').value;
    w_transaction_type = default_type_code;
    document.getElementById('id_type_code').value = default_type_code;
    $('#id_type_code').trigger('change');
    transaction_cashnbanklist_list(w_branch_code);
});


$("#id_type_code").on("change paste keyup", async function() {
    document.getElementById("id_account_number").value = '';
    let account_number_spn = document.getElementById("select2-id_account_number-container");

    if (account_number_spn) {
        account_number_spn.textContent = "---------------";
    }
    w_transaction_type = document.getElementById('id_type_code').value;
    w_account_type = '';
    w_include_closing = 'N';
    const account_number = document.getElementById('id_account_number');
    initAccountsSelect2WithAjax(w_branch_code, w_account_type, w_tran_screen, w_transaction_type, w_include_closing, accountSearchUrl, account_number, null);

    const product_id = document.getElementById('id_product_id');
    if (product_id) {
        initProductSelect2WithAjax(w_branch_code, w_tran_screen, productSearchUrl, product_id, w_transaction_type);
    }
});

$("#id_product_id").on("change paste keyup", function() {
    $('#id_product_unit_id').val('');
    var product_id = document.getElementById('id_product_id').value;
    if (product_id !== '') {
        get_product_name(product_id);
    }
});

$("#id_product_bar_code").on("change paste keyup", function(e) {
    var product_bar_code = document.getElementById('id_product_bar_code').value;
    get_product_name(product_bar_code);
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

function get_product_name(product_id) {
    $.ajax({
        url: "/sales-product-info/" + product_id,
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                $('#id_product_name').val(data.product_name);
                $('#id_product_bar_code').val(data.product_bar_code);
                $('#id_update_product_bar_code').val(data.product_bar_code);
                $('#id_quantity').val(1);
                $('#id_product_model').val(data.product_model);
                $('#id_purces_price').val(data.product_purces_price);
                $('#id_dtl_total_price').val(data.product_purces_price);
                $('#id_base_unit_price').val(data.product_purces_price);
                $('#id_product_unit_id').val(data.product_unit_id);
                generateTransactionListItems(data.product_unit_id, unit_transaction_dictionary);
                $('#id_transaction_unit_id').val(data.product_unit_id);
                $('#id_tiles_size').val(data.tiles_size);
                $('#id_box_quantity').val(data.box_quantity);
                get_product_price(product_id)
            } else {
                $('#id_product_name').val('Invalid Product');
            }
        }
    })
    return false;
}

function get_product_price(product_id) {
    let branch_code = $('#id_branch_code').val()
    $.ajax({
        url: `/sales-product-price?product_id=${product_id}&branch_code=${branch_code}`,
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                $('#id_available-stock').val(data.stock_available_unit)
            } else {
                alert(data.error_message);
            }
        }
    })
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
                $('#id_purces_price').val(data.product_purces_price);
                $('#id_dtl_total_price').val(data.product_purces_price);
            } else {
                $('#id_product_name').val('Invalid Product');
            }
        }
    })
    return false;
}

$("#id_unit_quantity, #id_quantity, #id_purces_price, #id_dtl_total_price, #id_discount_amount, #id_total_pay").on('click', function() {
    this.select();
});

function fn_calculate_purchase_rate_total() {
    var unit_enable = document.getElementById('id_unit_enable').value;
    var quantity = Number(document.getElementById('id_quantity').value);
    var unit_quantity = Number(document.getElementById('id_unit_quantity').value);
    if (unit_enable == 'Y') {
        quantity = unit_quantity;
    }
    var purces_rate = document.getElementById('id_purces_price').value;
    var dtl_total_price = Math.round((purces_rate * quantity) * 100) / 100;
    $('#id_dtl_total_price').val(dtl_total_price);
}

$("#id_dtl_total_price").on("change paste keyup", function() {
    var unit_enable = document.getElementById('id_unit_enable').value;
    var quantity = Number(document.getElementById('id_quantity').value);
    var unit_quantity = Number(document.getElementById('id_unit_quantity').value);
    if (unit_enable == 'Y') {
        quantity = unit_quantity;
    }
    var dtl_total_price = document.getElementById('id_dtl_total_price').value;
    var purces_rate = Math.round((dtl_total_price / quantity) * 100) / 100;
    $('#id_purces_price').val(purces_rate);
});

$("#id_quantity").on("change paste keyup", function() {
    var quantity = document.getElementById('id_quantity').value;
    var purces_rate = document.getElementById('id_purces_price').value;
    var dtl_total_price = Math.round((purces_rate * quantity) * 100) / 100;
    $('#id_dtl_total_price').val(dtl_total_price);
});

$("#id_purces_price").on("change paste keyup", function() {
    fn_calculate_purchase_rate_total();
});

$("#id_voucher_discount").on("change paste keyup", function() {
    var voucher_discount = Number(document.getElementById('id_voucher_discount').value);
    var total_due = (((document.getElementById('id_total_price').value) - (document.getElementById('id_total_pay').value)) - voucher_discount);
    var total_due_round = Math.round((total_due) * 100) / 100;
    if (total_due < 0) {
        $('#id_due_amount').val(0);
    } else {
        $('#id_due_amount').val(total_due_round);
    }
});

$("#id_total_pay").on("change paste keyup", function() {
    var voucher_discount = Number(document.getElementById('id_voucher_discount').value);
    var total_due = (((document.getElementById('id_total_price').value) - (document.getElementById('id_total_pay').value)) - voucher_discount);
    var total_due_round = Math.round((total_due) * 100) / 100;
    if (total_due < 0) {
        $('#id_due_amount').val(0);
    } else {
        $('#id_due_amount').val(total_due_round);
    }
});

function fn_calculate_total_bill() {
    var quantity = Number(document.getElementById('id_quantity').value);
    var unit_quantity = Number(document.getElementById('id_unit_quantity').value);
    if (unit_quantity != quantity) {
        quantity = unit_quantity;
    }
    var purces_rate = document.getElementById('id_purces_price').value;
    var dtl_total_price = Math.round((purces_rate * quantity) * 100) / 100;
    $('#id_dtl_total_price').val(dtl_total_price);
}

$("#id_unit_quantity").on("change paste keyup", function(e) {
    var transaction_unit_id = document.getElementById('id_transaction_unit_id').value;
    var product_unit_id = document.getElementById('id_product_unit_id').value;
    var unit_quantity = Number(document.getElementById('id_unit_quantity').value);
    var tiles_size = document.getElementById('id_tiles_size').value;
    var box_quantity = document.getElementById('id_box_quantity').value;
    // Tiles Calculation Start
    if (tiles_size != '') {
        var w_tiles_quantity = fnGetActualTilesQuantity(tiles_size, unit_quantity, transaction_unit_id, box_quantity)
        $('#id_actual_quantity').val(w_tiles_quantity);
    }
    // Tiles Calculation End
    else {
        var conversion_rate_tran = fn_get_unit_conversion_rate(transaction_unit_id);
        //Purchase always in lowest unit
        $('#id_quantity').val(roundNumber(conversion_rate_tran * unit_quantity));
    }
    fn_calculate_purchase_rate_total();
    var key = e.which;
    return false;
});

$("#id_unit_quantity").on("change", function(e) {
    var tiles_size = document.getElementById('id_tiles_size').value;
    if (tiles_size != '') {
        var transaction_unit_id = document.getElementById('id_transaction_unit_id').value;
        var product_unit_id = document.getElementById('id_product_unit_id').value;
        var w_tiles_quantity = Number(document.getElementById('id_actual_quantity').value);
        if (product_unit_id == transaction_unit_id) {
            $('#id_unit_quantity').val(w_tiles_quantity);
        }
        $('#id_quantity').val(w_tiles_quantity);
    }
});

$("#id_transaction_unit_id").on("change", function(e) {
    var transaction_unit_id = document.getElementById('id_transaction_unit_id').value;
    var product_unit_id = document.getElementById('id_product_unit_id').value;
    var tiles_size = document.getElementById('id_tiles_size').value;
    var box_quantity = document.getElementById('id_box_quantity').value;
    // Price of Base  Unit Hali
    var base_unit_price = Number(document.getElementById('id_base_unit_price').value);
    $('#id_quantity').val(0);
    $('#id_unit_quantity').val(0);
    $('#id_total_price').val(0);
    $('#id_purces_price').val(base_unit_price);
    // Tiles Calculation Start
    if (tiles_size != '') {
        var base_unit_quantity = fnGetActualTilesQuantity(tiles_size, 1, transaction_unit_id, box_quantity)
        if (product_unit_id != transaction_unit_id) {
            $('#id_purces_price').val(roundNumber(base_unit_quantity * base_unit_price));
        }
    }
    // Tiles Calculation End
    else {
        // Get The Number of Unit Pice to Hali
        var conversion_rate_base = fn_get_unit_conversion_rate(product_unit_id);
        var conversion_rate_tran = fn_get_unit_conversion_rate(transaction_unit_id);
        // Calculate Price Hali to Pice then Pice to Hali, Dozen
        var purces_price = roundNumber((base_unit_price / conversion_rate_base) * conversion_rate_tran);
        $('#id_purces_price').val(purces_price);
    }
    fn_calculate_total_bill();
});

$("#id_account_number").on("change paste keyup", function() {
    let account_number = document.getElementById('id_account_number').value;
    sales_handle_project_batch_list('', '', account_number, 'O', 'id_project_batch_id', null);
});

function account_list_refresh(account_type, tran_screen, transaction_type, branch_code) {
    var url = '/sales-choice-accountslist';
    $.ajax({
        url: url,
        data: {
            'account_type': account_type,
            'tran_screen': tran_screen,
            'transaction_type': transaction_type,
            'branch_code': branch_code
        },
        success: function(data) {
            $("#id_account_number").html(data);
        }
    });
    return false;
}

function transaction_cashnbanklist_list(branch_code) {
    var url = '/finance-choice-cashnbanklist';
    $.ajax({
        url: url,
        data: {
            'branch_code': branch_code
        },
        success: function(data) {
            $("#id_receipt_payment_ledger").html(data);
        }
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
            confirm("Are you sure you want to remove this item?").then(
                (e) => {
                    if (e == true) {
                        stock_details_delete(id)
                    }
                }
            );
        }

    })

    function show_edit_product_data(id) {
        $.ajax({
            url: '/sales-details-edit/' + id,
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
            url: '/sales-stocktemp-delete/' + id,
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                if (data.form_is_valid) {
                    $('#id_total_quantity').val(data.total_quantity);
                    $('#id_total_price').val(data.total_price);
                    table_data.ajax.reload();
                } else {
                    table_data.ajax.reload();
                }
            }
        })
        return false;
    }

});

$(function() {
    $('#btnAddItem').click(function() {
        post_tran_table_data();

    });
});

$(function() {
    $('#btn_stock_sumbit').click(function() {
        post_stock_master_data();

    });
});

function post_tran_table_data() {
    var transaction_unit_id = document.getElementById('id_transaction_unit_id').value;
    if (transaction_unit_id != 'undefined') {
        $('#id_base_unit_id').val(lower_unit_dictionary[transaction_unit_id]);
    }
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
                $('#id_total_price').val(data.total_price);
                table_data.ajax.reload();
                $('#page_loading').modal('hide');
                $('#id_product_name').val('');
                $('#id_product_id').val('');
                $('#id_quantity').val(1);
                var product_id_span = document.getElementById("select2-id_product_id-container");
                product_id_span.textContent = "Select Product";
                try {
                    var transaction_unit_id = document.getElementById("select2-id_transaction_unit_id-container");
                    transaction_unit_id.textContent = "---------------";
                    $('#id_transaction_unit_id').val('');
                } catch (e) {}
            } else {
                alert(data.error_message);
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
                const default_type_code = document.getElementById('id_default_type_code').value;
                document.getElementById('id_type_code').value = default_type_code;
                $('#id_total_price').val(0.00);
                $('#id_total_quantity').val(0);
                $('#id_due_amount').val(0.00);
                $('#id_voucher_discount').val(0.00);
                clearSelect2Value('id_account_number');
                clearSelect2Value('id_receipt_payment_ledger');
            } else {
                alert(data.error_message);
                table_data.ajax.reload();
                $('#page_loading').modal('hide');
            }
        }
    })
    return false;
}

function stock_details_clear_all() {
    confirm("Are you sure you want to remove this item?").then(
        (e) => {
            if (e == true) {
                $.ajax({
                    url: '/sales-stocktemp-delete-all',
                    type: 'POST',
                    dataType: 'json',
                    success: function(data) {
                        if (data.form_is_valid) {
                            $('#id_total_quantity').val(data.total_quantity);
                            $('#id_total_price').val(data.total_price);
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

setTimeout(() => {
    var div = document.getElementById("div_id_product_id");
    div.style.width = "100%";
}, 100);

$('#id_add_new_product').on('click', function() {
    $.ajax({
        url: '/sales-product-create-modal-form',
        type: 'get',
        dataType: 'json',
        beforeSend: function() {
            $('#edit_model').modal('show');
        },
        success: function(data) {
            $('#edit_model .modal-content').html(data.html_form);
        }
    })
})

function post_new_product_data() {
    var data_string = $("#product_tran_table_data").serialize();
    var data_url = $("#product_tran_table_data").attr('data-url');
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: data_string,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                var newOption = new Option(data.product_name, data.product_id, true, true); // Create a new option
                $('#id_product_id').append(newOption).trigger('change');

                $('#page_loading').modal('hide');
                $('#edit_model').modal('hide');
                alert(data.success_message);
                var product_group = document.getElementById("select2-id_product_group-container");
                product_group.textContent = "--------------";
                var brand_id = document.getElementById("select2-id_brand_id-container");
                brand_id.textContent = "--------------";
                var final_categories_id = document.getElementById("select2-id_final_categories_id-container");
                final_categories_id.textContent = "--------------";
            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
            }
        }
    })
    return false;
}