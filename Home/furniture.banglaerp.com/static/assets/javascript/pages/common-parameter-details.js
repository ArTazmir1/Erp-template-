function fnGetDay(dayNumber) {
    var weekday = [];
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var day = weekday[dayNumber];
    return day;
}

var w_include_closing = 'Y';
var w_including_closed_ac = 'N';

function refresh_branch_list(branch_code) {
    var url = "/appauth-choice-branchlist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_branch_code").html(data);
        },
    });
    return false;
}

function refresh_branch_list_all(branch_code) {
    var url = "/appauth-choice-branchlistall";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_branch_code").html(data);
        },
    });
    return false;
}

function refresh_center_list(branch_code) {
    var url = "/sales-choice-centerlist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_center_code").html(data);
        },
    });
    return false;
}

function refresh_agent_list(branch_code) {
    var url = "/sales-choice-agentlist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_agent_id").html(data);
        },
    });
    return false;
}

function refresh_employee_list(branch_code) {
    var url = "/sales-choice-employeelist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_employee_id").html(data);
        },
    });
    return false;
}

function refresh_appuser_list(branch_code) {
    var url = "/appauth-choice-appuserlist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_app_user_id").html(data);
        },
    });
    return false;
}

function refresh_group_list(branch_code) {
    var url = "/sales-choice-productgrouplist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_group_id").html(data);
        },
    });
    return false;
}

function refresh_brand_list(branch_code) {
    var url = "/sales-choice-productbrandlist";
    $.ajax({
        url: url,
        data: {
            branch_code: branch_code,
        },
        success: function(data) {
            $("#id_brand_id").html(data);
        },
    });
    return false;
}

function refresh_report_list(report_screen) {
    var url = "/appauth-choice-reportlist";
    $.ajax({
        url: url,
        data: {
            report_screen: report_screen,
        },
        success: function(data) {
            $("#id_report_name").html(data);
        },
    });
    return false;
}

function set_report_url(report_name, report_screen) {
    $.ajax({
        url: "/appauth-getreport-url",
        data: {
            report_name: report_name,
            report_screen: report_screen,
        },
        type: "GET",
        success: function(data) {
            if (data.form_is_valid) {
                $("#id_report_url").val(data.report_url);
            } else {
                $("#id_report_url").val("");
            }
        },
    });
    return false;
}

function data_table_hide_show() {
    try {
        let div_id = document.querySelector("#data_table_extarnal");
        let div_classes = div_id.classList;
        if (div_classes.contains("deactivate_data_table")) {
            div_classes.toggle("deactivate_data_table", false);
            div_classes.toggle("activate", true);
        } else {
            div_classes.toggle("activate", false);
            div_classes.toggle("deactivate_data_table", true);
        }
    } catch (error) {
        return false;
    } finally {}
}

function refresh_deposit_account_list(client_id, deposit_type, deposit_type_exclude, with_out_closing) {
    var url = "/finance-choice-depositacinfo";
    $.ajax({
        url: url,
        data: {
            client_id: client_id,
            deposit_type: deposit_type,
            deposit_type_exclude: deposit_type_exclude,
            with_out_closing: with_out_closing,
        },
        success: function(data) {
            $("#id_account_number").html(data);
        },
    });
    return false;
}

function refresh_loan_account_list() {
    var client_id = document.getElementById("id_client_id").value;
    var url = "sales-choice-emiinvoice";
    $.ajax({
        url: url,
        data: {
            client_id: client_id,
        },
        success: function(data) {
            $("#id_account_number").html(data);
        },
    });
    return false;
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function set_error_msg_to_frontend(obj = {}) {
    let className = $("#id_alert_show_in_frontend").attr("class");
    let newclasName = className.split(" ");
    if (obj.msg) {
        $("#id_msg_show_in_frontend").html(obj.msg);
        if (newclasName.indexOf("hide") === 1) {
            $("#id_alert_show_in_frontend").removeClass("hide");
            setTimeout(function() {
                $("#id_alert_show_in_frontend").removeClass("show");
                $("#id_alert_show_in_frontend").addClass("hide");
            }, 3000);
        } else {
            $("#id_alert_show_in_frontend").addClass("show");
            setTimeout(function() {
                $("#id_alert_show_in_frontend").removeClass("show");
                $("#id_alert_show_in_frontend").addClass("hide");
            }, 3000);
        }
        if (obj.error_type) {
            if (
                newclasName.indexOf("error") > 0 ||
                newclasName.indexOf("success") > 0 ||
                newclasName.indexOf("warning") > 0
            ) {
                $("#id_alert_show_in_frontend").removeClass(
                    newclasName.indexOf("error") > 0 ?
                    "error" :
                    newclasName.indexOf("success") > 0 ?
                    "success" :
                    "warning"
                );
            } else {
                $("#id_alert_show_in_frontend").addClass(obj.error_type);
            }
        }
    }
}

function print_div_data_from_html(divName) {
    var promise = new Promise(function(resolve, reject) {
        var divContents = document.getElementById(divName).innerHTML;
        var title = document.getElementById('print_title').value;
        var host = "http://" + window.location.host + "/static/assets/stylesheets/custom.css"
        var a = window.open('', '', 'height=3508, width=2480');
        a.document.write('<html><head>');
        a.document.write('<title>' + title + '</title>');
        a.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">');
        a.document.write('<link rel="stylesheet" href=' + host + '>');
        a.document.write('</head><body>');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        if (a.document) {
            resolve(a)
        } else {
            reject(("It is a failure lode print window."));
        }
        // setTimeout(() => {
        //   a.print();
        // }, 500);

    });
    return promise;

}

function print_div_from_template(div) {
    print_div_data_from_html(div).then(x => {
        setTimeout(() => {
            x.print()
        }, 500);
        x.onafterprint = x.close;
    }).catch(err => {
        alert("Error: " + err);
    })
}

function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();

    const isMobile = /mobile|android|iphone|ipod|blackberry|phone/i.test(userAgent);
    const isTablet = /ipad|tablet|playbook|silk/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    if (isMobile) {
        return "Mobile";
    }

    if (isTablet) {
        return "Tablet";
    }

    if (isDesktop) {
        return "Computer";
    }
}

var batteryLevel;

function getBatteryLevel() {
    return new Promise(function(resolve, reject) {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                var batteryLevel = Math.round(battery.level * 100);
                resolve(batteryLevel);
            }).catch(function(error) {
                reject(error);
            });
        } else {
            reject(new Error('Battery Status API is not supported.'));
        }
    });
}

function getLocation() {
    var location_tracking_on = document.getElementById("is_location_tracking_on").value;
    if (navigator.geolocation && location_tracking_on == 'Y') {
        navigator.geolocation.getCurrentPosition(SavePosition);
    }
}

function SavePosition(position) {
    var deviceType = getDeviceType();
    getBatteryLevel()
        .then(function(batteryLevel) {
            post_userlocation_data(position.coords.latitude, position.coords.longitude, position.coords.accuracy, batteryLevel, deviceType);
        })
        .catch(function(error) {
            console.error('Error getting battery level:', error.message);
            post_userlocation_data(position.coords.latitude, position.coords.longitude, position.coords.accuracy, 0.00, deviceType);
        });
}

$(document).on('theme:init', function() {
    new getLocation();
});

function post_userlocation_data(latitude, longitude, accuracy, batteryLevel, deviceType) {
    $.ajax({
        url: "/appauth-userlocation-tracking/",
        type: "POST",
        data: {
            'latitude': latitude,
            'longitude': longitude,
            'accuracy': accuracy,
            'batteryLevel': batteryLevel,
            'deviceType': deviceType,
        },
        success: function(data) {},
    });
}

async function sales_transaction_list(choiceParams, targetFieldId, selectedValue = null) {
    const choiceUrl = `/sales-transactiontype-getpermit`;
    await generateAndAssignChoiceList(
        choiceUrl,
        'POST',
        choiceParams,
        'tran_type_id',
        'tran_type_name',
        targetFieldId,
        true,
        selectedValue
    );
}


function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const hr12 = String(hours).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hr12}:${minutes}:${seconds} ${ampm}`;
}