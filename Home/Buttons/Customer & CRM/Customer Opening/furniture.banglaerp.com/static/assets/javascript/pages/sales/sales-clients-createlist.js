let dataTableSearchurl = "/sales-clients-api";

const deleteUrl = "";
const editDataUrl = "/sales-clients-edit";

const columns = [{
        data: 'client_id'
    },
    {
        data: 'client_name'
    },
    {
        data: 'client_father_name'
    },
    {
        data: 'client_mother_name'
    },
    {
        data: 'client_phone'
    },
    {
        data: 'client_blood_group'
    },
    {
        data: 'client_sex'
    },
    {
        data: 'client_religion'
    },
    {
        data: 'client_marital_status'
    },
    {
        data: 'client_national_id'
    },
    {
        data: 'client_present_address'
    },
    {
        data: 'client_permanent_address'
    },
    {
        data: 'client_joining_date'
    },
    {
        data: 'client_date_of_birth'
    },
    {
        data: "client_id", // Column for actions
        render: function(data, type, row, meta) {
            return `
        <div class="d-inline-flex align-items-center" style="white-space: nowrap;">
          <button onclick="fnEditRecord('${data}')" class="btn btn-primary btn-sm">
            Edit
          </button>
        </div>`;
        },
        orderable: false // Disable ordering for this column
    }
];

async function Search_Data() {
    const dataTable = new fnInitializeDataTable();
    const branch_code = document.getElementById('id_branch_code').value;
    const client_phone = document.getElementById('id_client_phone').value;
    const client_name = document.getElementById('id_client_name').value;
    const center_code = document.getElementById('id_center_code').value;
    const filterData = {
        branch_code: branch_code,
        client_phone: client_phone,
        client_name: client_name,
        center_code: center_code
    };

    if (client_phone === "" & client_name === "") {
        fnFailedSwalMessage("Please Enter Phone Number or Member Name!")
    } else {
        try {
            await dataTable.table('#dt-table-list', dataTableSearchurl, columns, filterData, 'GET', null, '');
        } catch (error) {
            fnFailedSwalMessage(error, "Unexpected Error!")
        }
    }
}

let mapInitialized = false;

document.addEventListener("DOMContentLoaded", function() {
    $('#mapModal').on('shown.bs.modal', async function() {
        if (!mapInitialized) {
            try {
                await loadGoogleMapsScript(); // Wait until loaded
                initMap(); // Then initialize map
                mapInitialized = true;
            } catch (err) {
                alert("Failed to load Google Maps: " + err.message);
            }
        }
    });
});

// Event on document load
document.addEventListener("DOMContentLoaded", async function() {
    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-choice-branchlist`;
    await setChoiceItemByGetRequest(branchChoice, "id_branch_code");
    document.getElementById('id_branch_code').value = branch_code;

    initializeSelect2('id_center_code');
    initializeSelect2('id_employee_id');
    initializeSelect2('id_client_religion');
    //initializeSelect2('id_client_type');
    initializeSelect2('id_primary_product');
    initializeSelect2('id_client_country_id');
    initializeSelect2('id_client_division_id');
    initializeSelect2('id_client_district_id');
    initializeSelect2('id_client_upozila_id');
    initializeSelect2('id_client_union_id');
    initializeSelect2('id_client_village_id');
    initializeSelect2('id_client_word_id');
    initializeSelect2('id_client_blood_group');
    initializeSelect2('id_client_sex');
    initializeSelect2('id_client_marital_status');
    initializeSelect2('id_client_education');

    const clientTypeChoice = `/sales-choice-clienttype`;
    let agentParams = new URLSearchParams({
        'transaction_screen': 'CLIENT_ENTRY'
    });
    const clientTypeChoiceFullUrl = clientTypeChoice + '?' + agentParams.toString();
    await setChoiceItemByGetRequest(clientTypeChoiceFullUrl, "id_client_type");

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

    await generateAndAssignChoiceList('apiauth-country-api/', 'GET', null, 'country_id', 'country_name', 'id_client_country_id')

    let country_id = document.getElementById('id_client_country_id').value;

    const choiceUrl = `/apiauth-division-api/`;
    let ChoiceParams = new URLSearchParams({
        'country_id': country_id
    });

    const ChoiceFullUrl = choiceUrl + '?' + ChoiceParams.toString();
    await generateAndAssignChoiceList(ChoiceFullUrl, 'GET', null, 'division_id', 'division_name', 'id_client_division_id', true)
});


document.getElementById("id_branch_code").addEventListener("change", async function() {
    const branch_code = this.value;

    const centerChoice = `/sales-choice-centerlist`;
    let centerChoiceParams = new URLSearchParams({
        'branch_code': branch_code
    });

    const centerChoiceFullUrl = centerChoice + '?' + centerChoiceParams.toString();

    await setChoiceItemByGetRequest(centerChoiceFullUrl, "id_center_code");
    const employeeChoice = `/sales-choice-employeelist`;
    let employeeParams = new URLSearchParams({
        'branch_code': branch_code
    });
    const employeeChoiceFullUrl = employeeChoice + '?' + employeeParams.toString();

    setChoiceItemByGetRequest(employeeChoiceFullUrl, "id_employee_id");

});

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


selectFieldOnClick('id_client_others_fee');
selectFieldOnClick('id_client_passbook_fee');
selectFieldOnClick('id_client_admit_fee');
selectFieldOnClick('id_client_credit_limit');
selectFieldOnClick('id_client_name');
selectFieldOnClick('id_client_phone');
selectFieldOnClick('id_client_national_id');
selectFieldOnClick('id_client_monthly_income');

async function sendOtpCode() {
    const fullUrl = `/sms-otp-sender`;
    const client_phone = getElementValue('id_client_phone');
    const client_name = getElementValue('id_client_name');
    const email_address = getElementValue('id_client_email');
    const formData = new FormData();

    if (client_phone.length === 0) {
        fnFailedSwalMessage("Please Enter Phone Number!");
        return;
    }

    if (client_name.length === 0) {
        fnFailedSwalMessage("Please Enter Name!");
        return;
    }

    formData.append('phone_number', client_phone);
    formData.append('receiver_name', client_name);
    formData.append('email_address', email_address);
    formData.append('otp_originator', 'MEMBER_ADMISSION');
    try {
        const detalsData = await fnSendLockPostRequest(formData, fullUrl);
        if (detalsData.form_is_valid) {
            fnSuccessSwalMessage(detalsData.success_message);
        }
    } catch (error) {
        fnFailedSwalMessage(error.message);
    }
}

async function fn_submit_insert_data() {
    const formId = 'tran_table_data';
    const submitButtonId = 'id_btn_insert_data';

    const isSubmitted = await submitFormData(formId, submitButtonId, true);
    if (isSubmitted) {
        const clientType = document.getElementById('id_client_type').value;
        let branch_code = document.getElementById('id_global_branch_code').value;
        document.getElementById('id_branch_code').value = branch_code;
        document.getElementById('id_client_type').value = clientType;
        clearSelect2Value('id_center_code');
        clearSelect2Value('id_employee_id');
        clearSelect2Value('id_client_religion');
        clearSelect2Value('id_primary_product');
        clearSelect2Value('id_client_country_id');
        clearSelect2Value('id_client_division_id');
        clearSelect2Value('id_client_district_id');
        clearSelect2Value('id_client_upozila_id');
        clearSelect2Value('id_client_union_id');
        clearSelect2Value('id_client_village_id');
        clearSelect2Value('id_client_word_id');
        clearSelect2Value('id_client_blood_group');
        clearSelect2Value('id_client_sex');
        clearSelect2Value('id_client_marital_status');
        clearSelect2Value('id_client_education');
    }
}

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

async function fn_submit_edit_data() {
    const formId = 'id_edit_form';
    const submitButtonId = 'id_btn_edit_data';

    const isSubmitted = await submitFormData(formId, submitButtonId, false);
}

var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

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
    if (uploadImage.files.length === 0) {
        return;
    }
    var uploadFile = document.getElementById("upload-Image-profile").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }
    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 250, 150);
        document.getElementById("upload-Preview-profile").src = result;
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/sales-client-image-temp-profile",
            data: {
                image: result
            },
            success: function(data) {
                console.log(data);
                alert("Image Uploaded Successfully!");
            },
        });
    });
};


let loadSignatureImageFile = function() {
    var uploadImage = document.getElementById("upload-Image-signature");
    if (uploadImage.files.length === 0) {
        return;
    }
    var uploadFile = document.getElementById("upload-Image-signature").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }
    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 150, 100);
        document.getElementById("upload-Preview-signature").src = result;
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

let loadNomineeProfileImageFile = function() {
    var uploadImage = document.getElementById("upload-nominee-Image-profile");
    if (uploadImage.files.length === 0) {
        return;
    }
    var uploadFile = document.getElementById("upload-nominee-Image-profile").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }
    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 150, 100);
        document.getElementById("upload-nominee-Preview-profile").src = result;
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
    if (uploadImage.files.length === 0) {
        return;
    }
    var uploadFile = document.getElementById("upload-nominee-Image-signature").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }
    convertToBase64(uploadFile, async (err, data) => {
        const result = await resizeImage(data, 150, 100);
        document.getElementById("upload-nominee-Preview-signature").src = result;
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