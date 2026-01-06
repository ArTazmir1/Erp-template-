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
                var client_id = document.getElementById('id_client_id').value;
                var search_url = "/sales-memberclosing-api/?client_id=" + client_id;
                table_data = $('#dt-table-list').DataTable({
                    "processing": true,
                    destroy: true,
                    "ajax": {
                        "url": search_url,
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
                            data: 'client_id'
                        },
                        {
                            data: 'closing_date'
                        },
                        {
                            data: 'closing_reason'
                        },
                        {
                            data: 'delete_closing'
                        },
                        {
                            data: 'app_user_id'
                        },
                        {
                            data: 'app_data_time'
                        },
                        {
                            data: 'cancel_by'
                        },
                        {
                            data: 'cancel_on'
                        },
                        {
                            "data": null,
                            "defaultContent": '<button type="button" class="btn btn-danger btn-sm">Cancel</button>'
                        }
                    ]
                });
            }
        }]);

        return fn_data_table;
    }();

var id = 0
var w_branch_code = 0;


$(document).ready(function() {
    refresh_branch_list('');
});

$(window).on('load', function() {
    var global_branch_code = document.getElementById('id_global_branch_code').value;
    $('#id_branch_code').val(global_branch_code);
    w_branch_code = global_branch_code;
});

$("#id_branch_code").on("change", function() {
    let branch_code = document.getElementById('id_branch_code').value;
    w_branch_code = branch_code;
});

$(function() {
    $('#btnSearch').click(function() {

        var client_id = document.getElementById('id_client_id').value;

        if (client_id === "") {
            alert("Please Enter Member ID!")
        } else {
            new fn_data_table();
        }
    });
})

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
        if (class_name == 'btn btn-danger btn-sm') {
            fn_member_closing_cancel(id);
        }

        function fn_member_closing_cancel(id) {
            confirm("Are you sure you want to active this member?").then((e) => {
                if (e == true) {
                    $("#page_loading").modal("show");
                    $.ajax({
                        url: "/sales-memberclosing-cancel/" + id,
                        type: "POST",
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

    })

});

$(function() {
    $('#btnAddItem').click(function() {
        post_tran_table_data();

    });
});

$('#btnReomveClient').click(function() {
    confirm("Are you sure you want to delete this member?").then((e) => {

        if (e == true) {
            post_member_delete();
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
                var global_branch_code = document.getElementById('id_global_branch_code').value;
                $('#id_branch_code').val(global_branch_code);
                var client_id = document.getElementById("select2-id_client_id-container");
                client_id.textContent = "-----------------";
            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
            }
        }
    })
    return false;
}


function post_member_delete() {
    var data_string = $("#tran_table_data").serialize();
    var data_url = 'sales-memberclosing-delete';
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
                var global_branch_code = document.getElementById('id_global_branch_code').value;
                $('#id_branch_code').val(global_branch_code);
                var client_id = document.getElementById("select2-id_client_id-container");
                client_id.textContent = "-----------------";
            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
            }
        }
    })
    return false;
}

async function sendOtpCode() {
    const fullUrl = `/sms-otp-sender`;
    const client_id = getElementValue('id_client_id');
    const formData = new FormData();

    if (client_id.length === 0) {
        fnFailedSwalMessage("Please Enter Member ID!");
        return;
    }

    formData.append('client_id', client_id);
    formData.append('otp_originator', 'MEMBER_CLOSING');
    try {
        const detalsData = await fnSendLockPostRequest(formData, fullUrl);
        if (detalsData.form_is_valid) {
            fnSuccessSwalMessage(detalsData.success_message);
        }
    } catch (error) {
        fnFailedSwalMessage(error.message);
    }
}