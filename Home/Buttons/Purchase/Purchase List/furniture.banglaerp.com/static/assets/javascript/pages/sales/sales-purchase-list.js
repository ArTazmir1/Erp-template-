// ====================== CONFIG ======================
let table_data;
let edit_stock_id;

const dataTableSearchUrl = "/stock-master-apisearch/";
const returnStockUrl = "/sales-purchase-return/";
const cancelStockUrl = "/sales-purchase-cancel/";
const reportSubmitUrl = "appauth-report-submit/";

const columns = [{
        data: 'branch_code'
    },
    {
        data: 'stock_id'
    },
    {
        data: 'voucher_number'
    },
    {
        data: 'supplier_id'
    },
    {
        data: 'stock_date'
    },
    {
        data: 'total_unit_quantity'
    },
    {
        data: 'total_price'
    },
    {
        data: 'status'
    },
    {
        data: 'cancel_by'
    },
    {
        data: 'cancel_on'
    },
    {
        data: 'app_user_id'
    },
    {
        data: null,
        orderable: false,
        render: function(data, type, row) {
            return `<div class="d-inline-flex align-items-center" style="white-space: nowrap;">
                        <button class="btn btn-danger btn-sm" onclick="fnCancelStock('${row.id}', '${row.status}')">
                            <i class="fas fa-ban"></i> Cancel Stock
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-secondary btn-sm" onclick="fnViewStockDetails('${row.id}')">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-success btn-sm" onclick="fnSaveAndShowReport('${row.id}')">
                            <i class="fas fa-file-invoice"></i> Print
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-dark btn-sm" onclick="window.open('/sales-products-barcode?purchase_number=${row.stock_id}', '_blank')">
                            <i class="fas fa-barcode"></i> Barcode Generate
                        </button>
                    </div>`;
        }
    }
];
// ====================== SEARCH FUNCTION ======================
async function Search_Stock_Data() {
    const stock_id = document.getElementById('id_stock_id').value;
    const from_date = document.getElementById('id_from_date').value;
    const upto_date = document.getElementById('id_upto_date').value;
    const supplier_phone = document.getElementById('id_supplier_phone').value;
    const branch_code = document.getElementById('id_branch_code').value;
    const agent_id = document.getElementById('id_agent_id').value;

    if (!stock_id && !from_date && !upto_date && !supplier_phone) {
        fnFailedSwalMessage("Please enter at least one value.");
        return;
    }

    const searchUrl = `${dataTableSearchUrl}?stock_id=${stock_id}&branch_code=${branch_code}&supplier_phone=${supplier_phone}&from_date=${from_date}&upto_date=${upto_date}&agent_id=${agent_id}`;

    table_data = $('#dt-stock-mst').DataTable({
        "createdRow": function(row, data) {
            if (data.status === 'C') {
                $(row).css("background-color", "red");
            }
        },
        processing: true,
        destroy: true,
        ajax: {
            url: searchUrl,
            type: "GET",
            dataSrc: ""
        },
        responsive: true,
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'table-responsive'tr>" +
            "<'row align-items-center'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-end'p>>",
        language: {
            paginate: {
                previous: '<i class="fa fa-lg fa-angle-left"></i>',
                next: '<i class="fa fa-lg fa-angle-right"></i>'
            }
        },
        columns: columns
    });
}

// ====================== ACTION FUNCTIONS ======================
function fnReturnStock(stock_pk) {
    confirm("Are you sure you want to return this purchase?").then((confirmed) => {
        if (!confirmed) return;
        $("#page_loading").modal("show");
        $.post(`${returnStockUrl}${stock_pk}`, (data) => {
            $("#page_loading").modal("hide");
            fnFailedSwalMessage(data.form_is_valid ? data.success_message : data.error_message);
            table_data.ajax.reload();
        });
    });
}

function fnCancelStock(stock_pk) {
    confirm("Are you sure you want to cancel this purchase?").then((confirmed) => {
        if (!confirmed) return;
        $("#page_loading").modal("show");
        $.post(`${cancelStockUrl}${stock_pk}`, (data) => {
            $("#page_loading").modal("hide");
            if (data.form_is_valid) {
                fnSuccessSwalMessage(data.success_message);
            } else {
                fnFailedSwalMessage(data.error_message);
            }
            table_data.ajax.reload();
        });
    });
}

function fnViewStockDetails(id) {
    $.get(`sales-purchase-details/${id}`, {
        id
    }, (data) => {
        $('#view_details').modal('show');
        $("#data_table_details").html(data);
    });
}

function fnSaveAndShowReport(stock_id) {
    const reportData = JSON.stringify({
        'p_stock_id': stock_id
    });
    $.post(reportSubmitUrl, {
        report_name: 'purchase_invoice',
        report_data: reportData
    }, (data) => {
        if (data.form_is_valid) {
            window.open(`${data.report_urls}/sales-report-stock-voucher-print-view`, "_blank");
        } else {
            fnFailedSwalMessage(data.error_message);
        }
    }, 'json');
}

// ====================== INIT EVENTS ======================

document.addEventListener('DOMContentLoaded', async function() {
    initializeSelect2('id_agent_id');
    initializeSelect2('id_branch_code');
    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;
    $('#id_branch_code').trigger('change');
});

$("#id_branch_code").on("change", function() {
    const code = this.value;
    refresh_agent_list(code);
});

$('#btnSearchStockMst').click(function() {
    Search_Stock_Data();
});