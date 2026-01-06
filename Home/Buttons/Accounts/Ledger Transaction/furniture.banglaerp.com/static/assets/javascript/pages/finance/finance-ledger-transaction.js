document.addEventListener('DOMContentLoaded', async function() {
    initializeSelect2('id_tran_gl_code');
    initializeSelect2('id_tran_type');
    initializeSelect2('id_branch_code');
    refresh_ledger_list('LEDCASH_TRAN');
    document.getElementById('id_tran_screen').value = 'LEDCASH_TRAN';
    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;
    $('#id_branch_code').trigger('change');
});

$("#id_branch_code").on("change", function() {
    var branch_code = document.getElementById('id_branch_code').value;
    transaction_type_list('LEDCASH_TRAN', branch_code);
});

function transaction_type_list(transaction_screen, branch_code) {
    var url = '/finance-choice-trantype';
    $.ajax({
        url: url,
        data: {
            'transaction_screen': transaction_screen,
            'branch_code': branch_code
        },
        success: function(data) {
            $("#id_tran_type").html(data);
        }
    });
    return false;
}

function refresh_ledger_list(tran_type_id) {
    var url = '/finance-choice-trantypeledger';
    $.ajax({
        url: url,
        data: {
            'tran_type_id': tran_type_id
        },
        success: function(data) {
            $("#id_tran_gl_code").html(data);
        }
    });
    return false;
}

function refresh_branch_list(branch_code) {
    var url = 'appauth-choice-branchlist';
    $.ajax({
        url: url,
        data: {
            'branch_code': branch_code
        },
        success: function(data) {
            $("#id_branch_code").html(data);
        }
    });
    return false;
}


$("#id_tran_type").on("change paste keyup", function() {
    const tran_type = document.getElementById('id_tran_type').value;
    refresh_ledger_list(tran_type);
});

$("#id_tran_gl_code").on("change paste keyup", function() {
    const branch_code = document.getElementById('id_branch_code').value;
    const tran_gl_code = document.getElementById('id_tran_gl_code').value;
    fn_set_ledger_balance(branch_code, tran_gl_code);
});

function fn_set_ledger_balance(p_branch_code, p_gl_code) {
    var url = 'finance-get-ledger-balance';
    $.ajax({
        url: url,
        data: {
            'branch_code': p_branch_code,
            'gl_code': p_gl_code,
        },
        success: function(data) {
            $('#id_current_balance').val(data.ledger_balance);
        }
    });
    return false;
}

$(function() {
    $('#btnAddItem').click(function() {
        if ((document.getElementById('id_tran_amount').value) <= 0) {
            alert('Transaction amount can not be Zero or Negative!')
        } else {
            post_tran_table_data();
        }
    });
});

function post_tran_table_data() {
    var data_string = $("#tran_table_data").serialize();
    var data_url = $("#tran_table_data").attr('data-url');
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: data_string,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                document.getElementById("tran_table_data").reset();
                $('#page_loading').modal('hide');
                alert(data.success_message);
                var tran_gl_code = document.getElementById("select2-id_tran_gl_code-container");
                tran_gl_code.textContent = "----------";
                var tran_type = document.getElementById("select2-id_tran_type-container");
                tran_type.textContent = "----------";
                $('#tran_gl_code').val('');
                var global_branch_code = document.getElementById('id_global_branch_code').value;
                $('#id_branch_code').val(global_branch_code);
                alert(data.success_message, "success", "success");

                if (data.voucher_print) {
                    fn_finance_voucher_print(data.branch_code, data.batch_number, data.tran_date);
                }

            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
            }
        }
    })
    return false;
}

function fn_finance_voucher_print(p_branch_code, p_batch_number, p_tran_date) {
    var data_url = 'appauth-report-submit/';
    var report_name = 'finance_voucher_print';
    var report_data = {
        'p_branch_code': p_branch_code,
        'p_batch_number': p_batch_number,
        'p_tran_date': p_tran_date,
    };
    report_data = JSON.stringify(report_data);
    console.log(report_data)
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
                window.open(data.report_urls + '/finance-report-voucher-print-view', "_blank");
            } else {
                alert(data.error_message)
            }
        }
    })
    return false;
}