let w_tran_screen = 'CASH_TRANSACTION';
let w_transaction_type = '';
let w_account_type = '';
let w_branch_code = '';
w_including_closed_ac = 'N';

document.addEventListener('DOMContentLoaded', async function() {
    initializeSelect2('id_tran_gl_code');
    initializeSelect2('id_tran_type');
    initializeSelect2('id_receipt_payment_ledger');
    initializeSelect2('id_branch_code');
    initializeSelect2('id_bill_id');
    document.getElementById('id_tran_screen').value = 'CASH_TRANSACTION';
    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;
    $('#id_branch_code').trigger('change');
});

$("#id_branch_code").on("change paste keyup", async function() {
    var branch_code = document.getElementById('id_branch_code').value;
    w_branch_code = branch_code;
    await transaction_cashnbanklist_list(branch_code);
    transaction_type_list(w_tran_screen, branch_code);
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

async function transaction_cashnbanklist_list(branch_code) {
    const requestUrl = `/finance-choice-cashnbanklist`;
    let requestParams = new URLSearchParams({
        'branch_code': branch_code
    });

    const requestChoiceFullUrl = requestUrl + '?' + requestParams.toString();
    // Get default tran type from hidden field
    const default_tran_ledger = document.getElementById('default_tran_ledger').value;

    // Wait until options are loaded, then set default
    await setChoiceItemByGetRequest(requestChoiceFullUrl, "id_receipt_payment_ledger", default_tran_ledger);
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

$(function() {
    $('#btnAddItem').click(function() {
        if ((document.getElementById('id_tran_amount').value) <= 0) {
            alert(
                "Transaction amount can not be Zero or Negative!",
                "error",
                "error"
            );
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
                var account_number = document.getElementById("select2-id_account_number-container");
                account_number.textContent = "--Select Account--";
                var tran_type = document.getElementById("select2-id_tran_type-container");
                tran_type.textContent = "-----------";
                var receipt_payment_ledger = document.getElementById("select2-id_receipt_payment_ledger-container");
                receipt_payment_ledger.textContent = "-----------";
                $('#id_account_number').val('');
                var global_branch_code = document.getElementById('id_global_branch_code').value;
                $('#id_branch_code').val(global_branch_code);
                $('#id_bill_id').empty();
                alert(data.success_message, "success", "success");
                default_tran_ledger_set();

                if (data.voucher_print) {
                    fn_finance_voucher_print(data.branch_code, data.batch_number, data.tran_date);
                }

            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message, "error", "error");
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

$("#id_tran_gl_code").on("change paste keyup", function() {
    var tran_gl_code = document.getElementById('id_tran_gl_code').value;
    if (tran_gl_code != '0') {
        get_gl_name();
    }
});

$("#id_account_number").on("change paste keyup", function() {
    var tran_type_id = document.getElementById('id_tran_type').value;
    var account_number = document.getElementById('id_account_number').value;
    get_client_info();
    //refresh_bill_list(tran_type_id, account_number);
    fn_finance_set_bill_list_field(tran_type_id, account_number, 'id_bill_id');
});

$("#id_tran_type").on("change paste keyup", function() {
    var tran_type = document.getElementById('id_tran_type').value;
    w_transaction_type = tran_type;
    var account_number = document.getElementById("select2-id_account_number-container");
    account_number.textContent = "--Select Account--";
    $('#id_current_balance').val('');
    $('#id_account_number').val('');
    $('#id_bill_id').empty();
    fnSetAccountContraLedgerList(tran_type);
});


async function fnSetAccountContraLedgerList(tran_type) {
    const fullUrl = `/finance-accounts-contraledger-get`;
    const formData = new FormData();

    formData.append('tran_type_id', tran_type);
    try {
        const detalsData = await fnSendLockPostRequest(formData, fullUrl);
        if (detalsData.form_is_valid) {
            if (detalsData.total_ledger > 0) {

                let json_data = detalsData.data;

                const choiceValue = 'gl_code';
                const displayValue = 'gl_name';

                const targetElement = document.getElementById('id_receipt_payment_ledger');
                if (targetElement) {
                    targetElement.innerHTML = '';
                    json_data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item[choiceValue]; // Assign the value from the specified key
                        option.textContent = item[displayValue]; // Set the display text

                        targetElement.appendChild(option);
                    });
                }
            } else {
                await transaction_cashnbanklist_list(w_branch_code);
            }
        }
    } catch (error) {
        fnFailedSwalMessage(error.message);
    }
}

async function fn_finance_set_bill_list_field(p_tran_type_id, p_account_number, targetFieldId) {

    const choiceUrl = `/finance-billlist-get`;
    const choiceParams = new URLSearchParams({
        'tran_type_id': p_tran_type_id,
        'account_number': p_account_number
    });

    await generateAndAssignChoiceList(
        choiceUrl,
        'POST',
        choiceParams,
        'id',
        'value',
        targetFieldId,
        false,
        null
    );
}

function get_client_info() {
    var account_number = document.getElementById('id_account_number').value;
    $.ajax({
        url: "/finance-account-byacnumber/" + account_number,
        type: 'GET',
        success: function(data) {
            if (data.form_is_valid) {
                $('#id_current_balance').val(data.account_balance);
            } else {
                $('#id_current_balance').val('');
            }
        }
    })
    return false;
}

function default_tran_ledger_set() {
    setTimeout(() => {
        var default_tran_ledger = $('#default_tran_ledger').val()
        $("#id_receipt_payment_ledger").val(default_tran_ledger).trigger('change');
    }, 500);
}