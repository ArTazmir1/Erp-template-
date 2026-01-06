$(function() {
    $('#btnSubmit').click(function() {
        save_and_show_report();
    });
});

function save_and_show_report() {
    var data_url = $("#report_data").attr('data-url');
    var report_data = {
        'p_branch_code': $('#id_branch_code').val(),
        'p_ason_date': $('#id_ason_date').val(),
        'p_branch_type': $('#id_branch_type').val()
    };
    var report_url = $('#report_url').val();
    report_data = JSON.stringify(report_data);
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: {
            'report_name': $('#report_name').val(),
            "report_data": report_data
        },
        cache: "false",
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                $('#page_loading').modal('hide');
                window.open(data.report_urls + "/" + report_url, "_blank");
            } else {
                alert(data.error_message);
                $('#page_loading').modal('hide');
            }
        }
    })
    return false;
}


document.addEventListener('DOMContentLoaded', async function() {

    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;
    $('#id_branch_code').trigger('change');
});