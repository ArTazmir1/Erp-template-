let dataTableSearchurl = "/sales-supplier-api";

const deleteUrl = "";
const editDataUrl = "/sales-supplier-edit";

const columns = [{
        data: 'supp_id'
    },
    {
        data: 'supp_name'
    },
    {
        data: 'proprietor_name'
    },
    {
        data: 'joining_date'
    },
    {
        data: 'supp_address'
    },
    {
        data: 'supp_mobile'
    },
    {
        data: 'supp_email'
    },
    {
        data: 'supp_web'
    },
    {
        data: 'supp_key_person'
    },
    {
        data: 'supp_grade'
    },
    {
        data: "supp_id",
        render: function(data, type, row, meta) {
            return `<div class="d-inline-flex align-items-center" style="white-space: nowrap;">
                        <button class="btn btn-info btn-sm" onclick="fnEditRecord('${data}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-danger btn-sm" onclick="FnDeleteData('${data}')">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>`;
        },
        orderable: false
    }
];

async function Search_Data() {
    const dataTable = new fnInitializeDataTable();
    let supp_name = document.getElementById('id_supp_name').value;
    let supp_mobile = document.getElementById('id_supp_mobile').value;
    let branch_code = document.getElementById('id_branch_code').value;

    const filterData = {
        supp_name: supp_name,
        supp_mobile: supp_mobile,
        branch_code: branch_code
    };

    try {
        await dataTable.table('#tran-data-table', dataTableSearchurl, columns, filterData, 'GET', null, '');
    } catch (error) {
        fnFailedSwalMessage(error, "Unexpected Error!")
    }
}

async function fn_submit_insert_data() {
    const formId = 'tran_table_data';
    const submitButtonId = 'id_btn_insert_data';

    const isSubmitted = await submitFormData(formId, submitButtonId, true, '');
}

async function fn_submit_edit_data() {
    const formId = 'id_edit_form';
    const submitButtonId = 'id_btn_edit_data';

    const isSubmitted = await submitFormData(formId, submitButtonId, false, '');
}

document.addEventListener('DOMContentLoaded', async function() {
    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code", branch_code);

    const clientTypeChoice = `/sales-choice-clienttype`;
    let agentParams = new URLSearchParams({
        'transaction_screen': 'SUPPLIER_ENTRY'
    });
    const clientTypeChoiceFullUrl = clientTypeChoice + '?' + agentParams.toString();
    await setChoiceItemByGetRequest(clientTypeChoiceFullUrl, "id_supp_type");

    $('#id_branch_code').trigger('change');
});


$("#id_admin_presnt_addr").on("change paste keyup", function() {
    $('#id_admin_permanent_addr').val(document.getElementById('id_supp_address').value);
});

function FnDeleteData(id) {
    confirm("Are you sure you want to delete this Record?").then((e) => {
        if (e == true) {
            $("#page_loading").modal("show");
            $.ajax({
                url: "/appauth-status-change/" + id,
                data: {
                    'status': 'D',
                    "source": 'SUPPLIER'
                },
                cache: "false",
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    if (data.form_is_valid) {
                        $("#page_loading").modal("hide");
                        alert(data.success_message);
                        table_data.ajax.reload();
                    } else {
                        $("#page_loading").modal("hide");
                        alert(data.error_message);
                        table_data.ajax.reload();
                    }
                },
            });
        }
    });

}

$("#id_admin_presnt_addr").on("change paste keyup", function() {
    $('#id_admin_permanent_addr').val(document.getElementById('id_supp_address').value);
});


$('#editModal').off('shown.bs.modal').on('shown.bs.modal', async function() {

    const clientTypeChoice = `/sales-choice-clienttype`;
    let agentParams = new URLSearchParams({
        'transaction_screen': 'SUPPLIER_ENTRY'
    });
    const clientTypeChoiceFullUrl = clientTypeChoice + '?' + agentParams.toString();

    let supp_type_selected = document.getElementById('id_supp_type_edit') ? .getAttribute('data-selected');
    await setChoiceItemByGetRequest(clientTypeChoiceFullUrl, 'id_supp_type_edit', supp_type_selected);

});