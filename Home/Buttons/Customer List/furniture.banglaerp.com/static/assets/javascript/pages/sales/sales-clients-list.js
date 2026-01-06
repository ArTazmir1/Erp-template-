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
                var client_name = document.getElementById('id_client_name').value;
                var client_phone = document.getElementById('id_client_phone').value;
                var branch_code = document.getElementById('id_branch_code').value;
                var center_code = document.getElementById('id_center_code').value;
                var client_national_id = document.getElementById('id_client_national_id').value;
                var next_visiting_date = document.getElementById('id_next_visiting_date').value;
                var employee_id = document.getElementById('id_employee_id').value;
                var agent_id = document.getElementById('id_agent_id').value;
                var client_status = document.getElementById('id_client_status').value;
                let client_country_id = document.getElementById('id_client_country_id').value;
                let client_division_id = document.getElementById('id_client_division_id').value;
                let client_district_id = document.getElementById('id_client_district_id').value;
                let client_upozila_id = document.getElementById('id_client_upozila_id').value;
                let client_union_id = document.getElementById('id_client_union_id').value;
                let client_village_id = document.getElementById('id_client_village_id').value;

                var search_url = "/sales-clients-api/?client_id=" + client_id + "&client_name=" + client_name +
                    "&client_phone=" + client_phone + "&branch_code=" + branch_code + "&center_code=" + center_code +
                    "&client_national_id=" + client_national_id + "&next_visiting_date=" + next_visiting_date +
                    "&employee_id=" + employee_id + "&agent_id=" + agent_id + "&client_status=" + client_status +
                    "&client_country_id=" + client_country_id + "&client_division_id=" + client_division_id +
                    "&client_district_id=" + client_district_id + "&client_upozila_id=" + client_upozila_id +
                    "&client_union_id=" + client_union_id + "&client_village_id=" + client_village_id;
                table_data = $("#dt-table-list").DataTable({
                    "createdRow": function(row, data, dataIndex) {
                        if (data.client_status == 'I') {
                            $(row).css("background-color", "#faed85");
                        }
                        if (data.client_status == 'C') {
                            $(row).css("background-color", "#f00");
                        }

                    },
                    processing: true,
                    destroy: true,
                    ajax: {
                        url: search_url,
                        type: "GET",
                        dataSrc: "",
                    },
                    responsive: {
                        details: {
                            target: -1,
                        },
                    },

                    //   dom: "Bfrtip",
                    buttons: ["colvis"],
                    dom: "<'row'<'col-sm-12  col-md-6'l><'col-sm-12 col-md-6'f>>\n<'table-responsive'tr>\n<'row align-items-center'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-end'p>>",
                    language: {
                        paginate: {
                            previous: '<i class="fa fa-lg fa-angle-left"></i>',
                            next: '<i class="fa fa-lg fa-angle-right"></i>',
                        },
                    },
                    columns: [{
                            data: "client_profile",
                            render: function(data, type, row) {
                                return (
                                    '<img  src="../../../../../media/' +
                                    data +
                                    '" class="avatar client_image_data_table" width="100" height="70"/>'
                                );
                            },
                        },
                        {
                            data: "client_id"
                        },
                        {
                            data: "client_name"
                        },
                        {
                            data: "client_center"
                        },
                        {
                            data: "client_father_name"
                        },
                        {
                            data: "client_mother_name"
                        },
                        {
                            data: "client_blood_group"
                        },
                        {
                            data: "client_sex"
                        },
                        {
                            data: "client_religion"
                        },
                        {
                            data: "client_marital_status"
                        },
                        {
                            data: "client_national_id"
                        },
                        {
                            data: "client_present_address"
                        },
                        {
                            data: "client_permanent_address"
                        },
                        {
                            data: "client_phone"
                        },
                        {
                            data: "client_email"
                        },
                        {
                            data: "client_joining_date"
                        },
                        {
                            data: "client_date_of_birth"
                        },
                        {
                            data: null,
                            defaultContent: `<button type="button" class="btn btn-info btn-sm mr-2">Edit</button> 
                        <button type="button" class="btn btn-secondary btn-sm ml-2">Edit Document</button>
                        <button type="button" class="btn btn-dark btn-sm ml-2">Admission Form</button>
                        <button type="button" class="btn btn-warning btn-sm">Add Visiting info</button> 
                        <button type="button" class="btn btn-dark btn-sm">Visiting History</button> 
                        <button type="button" class="btn btn-primary btn-sm">Credit Limit</button>
                        <button type="button" class="btn btn-success btn-sm ml-2 check-in" onclick="openCheckInModal()">
                              <i class="fas fa-map-marker-alt"></i> Check In
                        </button>
                        `,
                        },
                    ],
                });
            }
        }]);

        return fn_data_table;
    }();

var id = 0


$(function() {
    $('#btnSearch').click(function() {
        var client_id = document.getElementById('id_client_id').value;
        var client_name = document.getElementById('id_client_name').value;
        var client_phone = document.getElementById('id_client_phone').value;
        var branch_code = document.getElementById('id_branch_code').value;
        var client_national_id = document.getElementById('id_client_national_id').value;
        var next_visiting_date = document.getElementById('id_next_visiting_date').value;
        var employee_id = document.getElementById('id_employee_id').value;

        if (client_id === "" && client_name === "" && branch_code === "" && client_phone === "" && client_national_id === "" && next_visiting_date === "" && employee_id === "") {
            alert("Please Select Branch Name or Member Name or Member Phone or Member ID!");
        } else {
            new fn_data_table();
        }
    });
})

const OFFICE_LAT = 23.8103; // Example: Dhaka
const OFFICE_LNG = 90.4125;
const RADIUS_METERS = 50;
let checkinMap, userMarker, officeCircle;

async function openCheckInModal() {
    $('#checkInModal').modal('show');

    await loadGoogleMapsScript();
    initCheckInMap();
}

function initCheckInMap() {
    const officeLatLng = new google.maps.LatLng(OFFICE_LAT, OFFICE_LNG);
    checkinMap = new google.maps.Map(document.getElementById("checkinMap"), {
        center: officeLatLng,
        zoom: 17
    });

    // Circle around office
    officeCircle = new google.maps.Circle({
        center: officeLatLng,
        radius: RADIUS_METERS,
        map: checkinMap,
        fillColor: '#00FF00',
        fillOpacity: 0.3,
        strokeColor: '#00AA00',
        strokeWeight: 2
    });

    new google.maps.Marker({
        position: officeLatLng,
        map: checkinMap,
        label: "Office",
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLatLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            );

            userMarker = new google.maps.Marker({
                position: userLatLng,
                map: checkinMap,
                label: "You",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillColor: '#0000FF',
                    fillOpacity: 0.8,
                    strokeColor: '#0000FF',
                    strokeWeight: 2
                }
            });

            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                officeLatLng,
                userLatLng
            );

            const statusDiv = document.getElementById("checkinStatus");
            const confirmBtn = document.getElementById("confirmCheckin");

            if (distance <= RADIUS_METERS) {
                statusDiv.innerHTML = `✅ You are within ${Math.round(distance)} meters. You can check in.`;
                statusDiv.style.color = "green";
                confirmBtn.disabled = false;
            } else {
                statusDiv.innerHTML = `❌ You are ${Math.round(distance)} meters away. Move closer to check in.`;
                statusDiv.style.color = "red";
                confirmBtn.disabled = true;
            }
        }, () => {
            alert("Geolocation permission denied or failed.");
        });
    } else {
        alert("Geolocation not supported by this browser.");
    }
}


// Event on document load
document.addEventListener("DOMContentLoaded", async function() {

    const toggleButton = document.getElementById('brnSideBar');
    const sidebar = document.getElementById('sidebar');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
            document.body.classList.toggle('sidebar-hidden');
        });
    } else {
        console.warn('Toggle button or sidebar not found.');
    }

    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;

    initializeSelect2('id_center_code');
    initializeSelect2('id_employee_id');
    initializeSelect2('id_agent_id');

    initializeSelect2('id_client_country_id');
    initializeSelect2('id_client_division_id');
    initializeSelect2('id_client_district_id');
    initializeSelect2('id_client_upozila_id');
    initializeSelect2('id_client_union_id');
    initializeSelect2('id_client_village_id');
    initializeSelect2('id_client_word_id');

    const employeeChoice = `/sales-choice-employeelist`;
    let employeeParams = new URLSearchParams({
        'branch_code': branch_code
    });
    const employeeChoiceFullUrl = employeeChoice + '?' + employeeParams.toString();

    await setChoiceItemByGetRequest(employeeChoiceFullUrl, "id_employee_id");

    const centerChoice = `/sales-choice-centerlist`;
    let centerChoiceParams = new URLSearchParams({
        'branch_code': branch_code
    });

    const centerChoiceFullUrl = centerChoice + '?' + centerChoiceParams.toString();

    await setChoiceItemByGetRequest(centerChoiceFullUrl, "id_center_code");

    const agentChoice = `/sales-choice-agentlist`;
    let agentChoiceParams = new URLSearchParams({
        'branch_code': branch_code
    });

    const agentChoiceFullUrl = agentChoice + '?' + agentChoiceParams.toString();

    await setChoiceItemByGetRequest(agentChoiceFullUrl, "id_agent_id");

    await generateAndAssignChoiceList('apiauth-country-api/', 'GET', null, 'country_id', 'country_name', 'id_client_country_id', true)

    let country_id = document.getElementById('id_client_country_id').value;

    const choiceUrl = `/apiauth-division-api/`;
    let ChoiceParams = new URLSearchParams({
        'country_id': country_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'division_id', 'division_name', 'id_client_division_id', true);
});

document.getElementById("id_branch_code").addEventListener("change", async function() {
    const branch_code = this.value;
    const employeeChoice = `/sales-choice-employeelist`;
    let employeeParams = new URLSearchParams({
        'branch_code': branch_code
    });
    const employeeChoiceFullUrl = employeeChoice + '?' + employeeParams.toString();

    await setChoiceItemByGetRequest(employeeChoiceFullUrl, "id_employee_id");

    const centerChoice = `/sales-choice-centerlist`;
    let centerChoiceParams = new URLSearchParams({
        'branch_code': branch_code
    });

    const centerChoiceFullUrl = centerChoice + '?' + centerChoiceParams.toString();

    await setChoiceItemByGetRequest(centerChoiceFullUrl, "id_center_code");

    const agentChoice = `/sales-choice-agentlist`;
    let agentChoiceParams = new URLSearchParams({
        'branch_code': branch_code
    });

    const agentChoiceFullUrl = agentChoice + '?' + agentChoiceParams.toString();

    await setChoiceItemByGetRequest(agentChoiceFullUrl, "id_agent_id");
});

const editDataUrl = "/sales-clients-edit";

async function fn_submit_edit_data() {
    const formId = 'id_edit_form';
    const submitButtonId = 'id_btn_edit_data';

    const isSubmitted = await submitFormData(formId, submitButtonId, false);
}


$("#id_client_country_id").on("change", async function(e) {
    const country_id = this.value;

    const choiceUrl = `/apiauth-division-api/`;
    let ChoiceParams = new URLSearchParams({
        'country_id': country_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'division_id', 'division_name', 'id_client_division_id', true)
});

$("#id_client_division_id").on("change", async function(e) {
    const division_id = this.value;

    const choiceUrl = `/apiauth-district-api/`;
    let ChoiceParams = new URLSearchParams({
        'division_id': division_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'district_id', 'district_name', 'id_client_district_id', true)
});

$("#id_client_district_id").on("change", async function(e) {
    const district_id = this.value;

    const choiceUrl = `/apiauth-upazila-api/`;
    let ChoiceParams = new URLSearchParams({
        'district_id': district_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'upozila_id', 'upozila_name', 'id_client_upozila_id', true)
});

$("#id_client_upozila_id").on("change", async function(e) {
    const upozila_id = this.value;

    const choiceUrl = `/apiauth-union-api/`;
    let ChoiceParams = new URLSearchParams({
        'upozila_id': upozila_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'union_id', 'union_name', 'id_client_union_id', true)
});

$("#id_client_union_id").on("change", async function(e) {
    const union_id = this.value;

    const choiceUrl = `/apiauth-village-api/`;
    let ChoiceParams = new URLSearchParams({
        'union_id': union_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'village_id', 'village_name', 'id_client_village_id', true)
});

$("#id_client_union_id").on("change", async function(e) {
    const union_id = this.value;

    const choiceUrl = `/apiauth-word-api/`;
    let ChoiceParams = new URLSearchParams({
        'union_id': union_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'word_id', 'word_name', 'id_client_word_id', true)
});


$("#id_client_present_address").on("change paste keyup", function() {
    $('#id_client_permanent_address').val(document.getElementById('id_client_present_address').value);
});

$('#editModal').off('shown.bs.modal').on('shown.bs.modal', async function() {

    const clientTypeChoice = `/sales-choice-clienttype`;
    let agentParams = new URLSearchParams({
        'transaction_screen': 'CLIENT_ENTRY'
    });
    const clientTypeChoiceFullUrl = clientTypeChoice + '?' + agentParams.toString();

    let client_type_selected = document.getElementById('id_client_type_edit') ? .getAttribute('data-selected');
    await setChoiceItemByGetRequest(clientTypeChoiceFullUrl, 'id_client_type_edit', client_type_selected);

    let country_id_selected = document.getElementById('id_client_country_id_edit') ? .getAttribute('data-selected');
    await generate_country_list_field('id_client_country_id_edit', country_id_selected);

    let division_id_selected = document.getElementById('id_client_division_id_edit') ? .getAttribute('data-selected');

    if (division_id_selected) {
        await generate_division_list_field(country_id_selected, 'id_client_division_id_edit', division_id_selected);
    } else {
        await generate_division_list_field(country_id_selected, 'id_client_division_id_edit');
    }

    let district_id_selected = document.getElementById('id_client_district_id_edit') ? .getAttribute('data-selected');
    await generate_district_list_field(division_id_selected, 'id_client_district_id_edit', district_id_selected);

    let upozila_id_selected = document.getElementById('id_client_upozila_id_edit') ? .getAttribute('data-selected');
    await generate_upozila_list_field(district_id_selected, 'id_client_upozila_id_edit', upozila_id_selected);

    let union_id_selected = document.getElementById('id_client_union_id_edit') ? .getAttribute('data-selected');
    await generate_union_list_field(upozila_id_selected, 'id_client_union_id_edit', union_id_selected);

    let village_id_selected = document.getElementById('id_client_village_id_edit') ? .getAttribute('data-selected');
    await generate_village_list_field(union_id_selected, 'id_client_village_id_edit', village_id_selected);

    attachEditModalEventListeners();

    initializeSelect2('id_client_country_id_edit');
    initializeSelect2('id_client_division_id_edit');
    initializeSelect2('id_client_district_id_edit');
    initializeSelect2('id_client_upozila_id_edit');
    initializeSelect2('id_client_union_id_edit');
    initializeSelect2('id_client_village_id_edit');
});

const editModalEventListeners = [];

function attachEditModalEventListeners() {
    const country_id = '#id_client_country_id_edit';
    const division_id = '#id_client_division_id_edit';
    const district_id = '#id_client_district_id_edit';
    const upozila_id = '#id_client_upozila_id_edit';
    const union_id = '#id_client_union_id_edit';
    const village_id = '#id_client_village_id_edit';

    $(country_id).off('change').on('change', function() {
        generate_division_list_field($(this).val(), 'id_client_division_id_edit', $(division_id).val());
    });

    $(division_id).off('change').on('change', function() {
        generate_district_list_field($(this).val(), 'id_client_district_id_edit', $(district_id).val());
    });

    $(district_id).off('change').on('change', function() {
        generate_upozila_list_field($(this).val(), 'id_client_upozila_id_edit', $(upozila_id).val());
    });

    $(upozila_id).off('change').on('change', function() {
        generate_union_list_field($(this).val(), 'id_client_union_id_edit', $(union_id).val());
    });

    $(union_id).off('change').on('change', function() {
        generate_village_list_field($(this).val(), 'id_client_village_id_edit', $(village_id).val());
    });
}

$(function() {

    $('#dt-table-list').on('click', 'button', function() {

        try {
            var table_row = table_data.row(this).data();
            id = table_row['client_id']
        } catch (e) {
            var table_row = table_data.row($(this).parents('tr')).data();
            id = table_row['client_id']
        }

        var class_name = $(this).attr('class');
        if (class_name == "btn btn-info btn-sm mr-2") {
            fnEditRecord(id);
        }
        if (class_name == "btn btn-secondary btn-sm ml-2") {
            show_document_edit_form(id);
        }
        if (class_name == "btn btn-dark btn-sm ml-2") {
            redirect_admission_form(id);
        }

        if (class_name == 'btn btn-warning btn-sm') {
            show_add_log_form(id);
        }

        if (class_name == 'btn btn-primary btn-sm') {
            show_limit_application_form(id);
        }

        if (class_name == 'btn btn-dark btn-sm') {
            show_visited_log(id);
        }

    })

    function show_document_edit_form(id) {
        $.ajax({
            url: "/sales-clients-document-edit/" + id,
            type: "get",
            dataType: "json",
            beforeSend: function() {
                $("#editModal").modal("show");
            },
            success: function(data) {
                $("#editModal .modal-content").html(data.html_form);
            },
        });
    }

    function redirect_admission_form(id) {
        window.open('/sales-clients-admission-form/' + id, "_blank");
    }

    function show_add_log_form(id) {
        $.ajax({
            url: 'sales-visiting-clients-log-add/' + id,
            type: 'get',
            dataType: 'json',
            beforeSend: function() {
                $('#editModal').modal('show');
            },
            success: function(data) {
                $('#editModal .modal-content').html(data.html_form);
            }
        })
    }

    function show_limit_application_form(id) {
        $.ajax({
            url: 'sales-clients-limit-addition/' + id,
            type: 'get',
            dataType: 'json',
            beforeSend: function() {
                $('#editModal').modal('show');
            },
            success: function(data) {
                $('#editModal .modal-content').html(data.html_form);
            }
        })
    }

    function show_visited_log() {
        $.ajax({
            url: 'sales-visiting-client-history/' + id,
            type: 'get',
            dataType: 'json',
            beforeSend: function() {
                $('#editModal').modal('show');
            },
            success: function(data) {
                $('#editModal .modal-content').html(data.html_form);
            }
        })
    }

});

$(function() {

    $(function() {
        $('#btnAddItem').click(function() {
            post_tran_table_data();

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
                    table_data.ajax.reload();
                } else {
                    $('#page_loading').modal('hide');
                    alert(data.error_message);
                    table_data.ajax.reload();
                }
            }
        })
        return false;
    }

});

var filterType =
    /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

function convertToBase64(file, cb) {
    var reader = new FileReader();
    reader.onload = function(e) {
        cb(null, e.target.result);
    };
    reader.onerror = function(e) {
        cb(e);
    };
    reader.readAsDataURL(file);
}

function resizeImage(base64Str, maxWidth = 400, maxHeight = 350) {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = base64Str;
        img.onload = () => {
            let canvas = document.createElement("canvas");
            const MAX_WIDTH = maxWidth;
            const MAX_HEIGHT = maxHeight;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL());
        };
    });
}

let loadProfileImageFile = function() {
    var uploadImage = document.getElementById("upload-Image-profile");

    //check and retuns the length of uploded file.
    if (uploadImage.files.length === 0) {
        return;
    }

    //Is Used for validate a valid file.
    var uploadFile = document.getElementById("upload-Image-profile").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }

    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 250, 150);
        document.getElementById("upload-Preview-profile").src = result;
        // console.log("result", result);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/sales-client-image-temp-profile",
            data: {
                image: result
            },
            success: function(data) {
                console.log(data);

                alert("image successfully uploaded");
            },
        });
    });
};

let loadSignatureImageFile = function() {
    var uploadImage = document.getElementById("upload-Image-signature");

    //check and retuns the length of uploded file.
    if (uploadImage.files.length === 0) {
        return;
    }

    //Is Used for validate a valid file.
    var uploadFile = document.getElementById("upload-Image-signature").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }

    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 150, 100);
        document.getElementById("upload-Preview-signature").src = result;
        // console.log("result", result);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/sales-client-image-temp-signature",
            data: {
                signature: result
            },
            success: function(data) {
                alert(" signature successfully uploaded");
            },
        });
    });
};

function add_visiting_log() {
    var data_string = $("#add_log_form").serialize();
    var data_url = $("#add_log_form").attr('data-url');
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: data_string,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                $('#page_loading').modal('hide');
                $('#editModal').modal('hide');
                alert(data.success_message);
            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
            }
        }
    })
    return false;
}

function add_limit_application() {
    var data_string = $("#add_limit_application").serialize();
    var data_url = $("#add_limit_application").attr('data-url');
    $('#page_loading').modal('show');
    $.ajax({
        url: data_url,
        data: data_string,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.form_is_valid) {
                $('#page_loading').modal('hide');
                $('#editModal').modal('hide');
                alert(data.success_message);
            } else {
                $('#page_loading').modal('hide');
                alert(data.error_message);
            }
        }
    })
    return false;
}

//Nominee Image

let loadNomineeProfileImageFile = function() {
    var uploadImage = document.getElementById("upload-nominee-Image-profile");

    //check and retuns the length of uploded file.
    if (uploadImage.files.length === 0) {
        return;
    }

    //Is Used for validate a valid file.
    var uploadFile = document.getElementById("upload-nominee-Image-profile").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }

    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 150, 100);
        document.getElementById("upload-nominee-Preview-profile").src = result;
        // console.log("result", result);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/sales-nominee-image-temp-profile",
            data: {
                image: result
            },
            success: function(data) {
                alert(" successfully uploaded");
            },
        });
    });
};
let loadNomineeSignatureImageFile = function() {
    var uploadImage = document.getElementById("upload-nominee-Image-signature");

    //check and retuns the length of uploded file.
    if (uploadImage.files.length === 0) {
        return;
    }

    //Is Used for validate a valid file.
    var uploadFile = document.getElementById("upload-nominee-Image-signature").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }

    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 150, 100);
        document.getElementById("upload-nominee-Preview-signature").src = result;
        // console.log("result", result);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/sales-nominee-image-temp-signature",
            data: {
                image: result
            },
            success: function(data) {
                alert(" successfully uploaded");
            },
        });
    });
};