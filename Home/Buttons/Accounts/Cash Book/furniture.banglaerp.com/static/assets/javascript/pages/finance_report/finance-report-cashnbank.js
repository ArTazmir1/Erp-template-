function save_and_show_report(report_url, report_name, data_url) {
    var report_data = {
        'p_branch_code': $('#id_branch_code').val(),
        'p_from_date': $('#id_from_date').val(),
        'p_upto_date': $('#id_upto_date').val(),
        'p_group_by': $('#id_ais_report_group').val()
    };
    report_data = JSON.stringify(report_data);
    $('#page_loading').modal('show');
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
                $('#page_loading').modal('hide');
                window.open(data.report_urls + "/" + report_url, "_blank");
            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
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