$(document).ready(function() {
    refresh_branch_list_all('');
    const global_branch_code = document.getElementById('id_global_branch_code').value;
    $('#id_org_branch_code').val(global_branch_code);
    try {
        $("#id_org_branch_code").select2();
    } catch (e) {}
    try {
        $("#id_res_branch_code").select2();
    } catch (e) {}
});

function refresh_branch_list_all(branch_code) {
    var url = 'appauth-choice-branchlistall';
    $.ajax({
        url: url,
        data: {
            'branch_code': branch_code
        },
        success: function(data) {
            $("#id_org_branch_code").html(data);
            $("#id_res_branch_code").html(data);
        }
    });
    return false;
}

$('#id_product_id').on('change', function() {
    var product_id = document.getElementById('id_product_id').value;
    get_product_name(product_id)
})


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
    var branch_code = document.getElementById('id_org_branch_code').value;
    var res_branch_code = document.getElementById('id_res_branch_code').value;
    if (branch_code && res_branch_code) {
        refresh_batch_list(branch_code, product_id);
        $.ajax({
            url: "/sales-product-price",
            data: {
                "product_id": product_id,
                "branch_code": branch_code
            },
            type: 'GET',
            success: function(data) {
                if (data.form_is_valid) {
                    // $('#id_product_name').val(data.product_name);
                    $('#id_branch_sales_price').val(data.product_purces_price);
                    //$('#id_product_sales_price').val(data.product_price);
                    $('#id_stock_available').val(data.stock_available);
                    // $('#id_product_model').val(data.product_model);
                    // product_discount_amount = data.discount_amount;
                    // $('#id_total_price').val(data.product_price);
                    // discount_type = data.discount_type;
                    $('#id_unit_quantity').val(1);
                    generateTransactionListItems(data.product_unit_id, unit_transaction_dictionary);
                    $('#id_transaction_unit_id').val(data.product_unit_id);
                } else {
                    $('#id_branch_sales_price').val(0);
                    //$('#id_product_sales_price').val(0);
                    // $('#id_discount_rate').val(0);
                    // $('#id_discount_amount').val(0);
                    $('#id_unit_quantity').val(0);
                    $('#id_stock_available').val(0);
                }
                product_price_cal()
            }
        })
    } else {
        Swal.fire({
            title: 'Please Select Branch.',
            icon: 'error',
        })
    }
    return false;
}

$("#id_batch_id").on("change paste keyup", function() {
    fn_set_batch_product_price();
});

function fn_set_batch_product_price() {
    var batch_id = document.getElementById('id_batch_id').value;
    $.ajax({
        url: "sales-batchproduct-price",
        data: {
            "batch_id": batch_id
        },
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                $('#id_product_price').val(data.product_price);
                $('#id_total_price').val(data.product_price);
                $('#id_stock_available').val(data.stock_available);
            } else {
                $('#id_product_price').val(0);
                $('#id_total_price').val(0);
            }
            product_price_cal()
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
$('#id_unit_quantity').on('change click', function() {
    $('#id_unit_quantity').select()
    product_price_cal()
})
$('#id_branch_sales_price').on('change click', function() {
    $('#id_branch_sales_price').select()
    product_price_cal()
})
$('#id_product_sales_price').on('change click', function() {
    $('#id_product_sales_price').select()
    product_price_cal()
})

function product_price_cal() {
    var quantity = $('#id_unit_quantity').val()
    var branch_sales_price = $('#id_branch_sales_price').val()
    //var product_sales_price = $('#id_product_sales_price').val()
    $('#id_total_branch_sales_price').val(Number(quantity) * Number(branch_sales_price))
    //$('#id_total_product_sales_price').val(Number(quantity) * Number(product_sales_price))

}

function add_item() {
    var org_branch_code = document.getElementById('id_org_branch_code').value;
    var res_branch_code = document.getElementById('id_res_branch_code').value;
    var sales_date = document.getElementById('id_sales_date').value;
    var product_id = document.getElementById('id_product_id').value;
    if (document.getElementById('id_batch_id')) {
        var batch_id = document.getElementById('id_batch_id').value;
    }
    var unit_quantity = $('#id_unit_quantity').val()
    var transaction_unit_id = $('#id_transaction_unit_id').val()
    var branch_sales_price = $('#id_branch_sales_price').val()
    //var product_sales_price = $('#id_product_sales_price').val()
    var stock_available = $('#id_stock_available').val()
    if (!org_branch_code && !org_branch_code) {
        Swal.fire({
            title: 'Please Select Branch.',
            icon: 'error',
        })
        return
    }
    if (!sales_date) {
        Swal.fire({
            title: 'Please Select Sales Date.',
            icon: 'error',
        })
        return
    }
    if (!product_id) {
        Swal.fire({
            title: 'Product is required.',
            icon: 'error',
        })
        return
    }
    if (!unit_quantity) {
        Swal.fire({
            title: 'Quantity is required.',
            icon: 'error',
        })
        return
    }
    if (!branch_sales_price) {
        Swal.fire({
            title: 'Please Enter Sales Price!',
            icon: 'error',
        })
        return
    }

    if (Number(stock_available) < Number(unit_quantity)) {
        Swal.fire({
            title: 'Stock Is Not Available!',
            icon: 'error',
        })
        return
    }
    var url = "/sales-ib-product-sales-add-item";
    $.ajax({
        url: url,
        data: {
            org_branch_code,
            res_branch_code,
            sales_date,
            product_id,
            batch_id,
            unit_quantity,
            branch_sales_price,
            transaction_unit_id
        },
        type: "POST",
        success: function(data) {
            if (data.form_is_valid) {
                $("#id_product_id").val('')
                $("#id_product_id").trigger("change");
                get_product_item();
                try {
                    var transaction_unit_id = document.getElementById("select2-id_transaction_unit_id-container");
                    transaction_unit_id.textContent = "---------------";
                    $('#id_transaction_unit_id').val('');
                } catch (e) {}
            }
            if (data.error_message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error_message

                })
            }
        },
    });
}
// product_item

function get_product_item() {
    var url = "/sales-ib-product-sales-temp-data";
    $.ajax({
        url: url,
        data: {},
        type: "GET",
        success: function(data) {
            if (data.temp_data) {
                $('#product_item').empty()
                $('#tfoot_total').empty()
                var sl = 1
                var totalQty = 0
                var TBS_price = 0
                var TPS_price = 0
                data.temp_data.forEach((item, index) => {
                    totalQty += Number(item.unit_quantity)
                    TBS_price += Number(item.total_branch_sales_price)
                    //TPS_price += Number(item.total_product_sales_price)
                    var tr = `<tr>`
                    tr += `<td>${sl}</td>`
                    tr += `<td>${item.product_name} ${item.product_model}</td>`
                    tr += `<td>${item.transaction_unit_id}</td>`
                    tr += `<td><input class="form-control" type="number" id="qty_${item.id}" onchange="update_qty('${item.id}')" onclick="select()"value="${item.unit_quantity}"></td>`
                    tr += `<td><input class="form-control" type="number" id="bsp_${item.id}" onchange="update_branch_sales_price('${item.id}')" onclick="select()"value="${item.branch_sales_price}"></td>`
                    //tr += `<td><input class="form-control" type="number" id="psp_${item.id}" onchange="update_product_sales_price('${item.id}')" onclick="select()"value="${item.product_sales_price}"></td>`
                    tr += `<td>${item.total_branch_sales_price}</td>`
                    //tr += `<td>${item.total_product_sales_price}</td>`
                    tr += `<td><button type="button" onclick="delete_item('${item.id}')" class="btn btn-danger">X</button></td>`
                    $('#product_item').append(tr)
                    sl += 1

                });
                setTimeout(() => {
                    var ftr = `<tr>
                    <th colspan="2">Total</th>
                    <th>${totalQty}</th>
                    <th></th>
                    <th>${TBS_price.toFixed(2)}</th>
                    <th></th>
                    </tr>`
                    $('#tfoot_total').append(ftr)
                }, 1000);

            }
        },
    });
}

get_product_item();

function delete_item(id) {
    var url = "/sales-ib-product-sales-delete/" + id;
    $.ajax({
        url: url,
        type: "POST",
        success: function(data) {
            get_product_item();
        },
    });
}

function update_qty(id) {
    var unit_quantity = $('#qty_' + id).val()
    if (unit_quantity) {
        var url = "/sales-ib-product-sales-qty-update/" + id;
        $.ajax({
            url: url,
            data: {
                unit_quantity: unit_quantity
            },
            type: "POST",
            success: function(data) {
                get_product_item();
            },
        });
    }
}

function update_branch_sales_price(id) {
    var price = $('#bsp_' + id).val()
    if (price) {
        var url = "/sales-ib-product-sales-bsp-update/" + id;
        $.ajax({
            url: url,
            data: {
                price: price
            },
            type: "POST",
            success: function(data) {
                get_product_item();
            },
        });
    }
}

function update_product_sales_price(id) {
    var price = $('#psp_' + id).val()
    if (price) {
        var url = "/sales-ib-product-sales-psp-update/" + id;
        $.ajax({
            url: url,
            data: {
                price: price
            },
            type: "POST",
            success: function(data) {
                get_product_item();
            },
        });
    }
}

function submit_branch_sales() {
    var org_branch_code = document.getElementById('id_org_branch_code').value;
    var res_branch_code = document.getElementById('id_res_branch_code').value;
    var sales_date = document.getElementById('id_sales_date').value;
    if (org_branch_code && res_branch_code && sales_date) {
        var url = "/sales-ib-product-sales-insert";
        $.ajax({
            url: url,
            data: {
                org_branch_code,
                res_branch_code,
                sales_date
            },
            type: "POST",
            success: function(data) {
                if (data.form_is_valid) {
                    Swal.fire({
                        title: 'Sending Request Success!',
                        icon: 'success',
                    })
                    get_product_item();
                    try {
                        var transaction_unit_id = document.getElementById("select2-id_transaction_unit_id-container");
                        transaction_unit_id.textContent = "---------------";
                        $('#id_transaction_unit_id').val('');
                    } catch (e) {}
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.error_message

                    })
                }
            },
        });
    }
}