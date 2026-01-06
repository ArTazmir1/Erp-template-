function gobalSearch() {
    var search_value = $('#gobal-search-input').val()
    if (search_value.length > 2) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/appauth-search",
            data: {
                search_value: search_value,
            },
            success: function(data) {
                if (data.search_data.length) {
                    list = []
                    data.search_data.forEach(item => {
                        if (item.program_link) {
                            list += `<li><a href="/${item.program_link}">${data.language == 'bengali' ? item.program_name_bengali : item.program_name_english}</a></li>`
                        }
                    });
                    ul = `<ul>
                    ${list}
                    </ul>`
                    $('#search-result').html(list)
                } else {
                    error = '<h5 style="color:red">No Result Found</h5>'
                    $('#search-result').html(error)
                }
            }
        });
    }

    if (search_value.length) {
        $('#search-result').css('display', 'block');
    } else {
        $('#search-result').css('display', 'none');
    }
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
        navigator.geolocation.getCurrentPosition(SavePosition, SaveLocationError);
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

function SaveLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            post_userlocation_error("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            post_userlocation_error("User Location information is unavailable.");
            break;
        case error.TIMEOUT:
            post_userlocation_error("User request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            post_userlocation_error("An unknown error occurred");
            break;
    }
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

function post_userlocation_error(error_message) {
    $.ajax({
        url: "/appauth-userlocation-error/",
        type: "POST",
        data: {
            'error_message': error_message
        },
        success: function(data) {
            if (data.access_denied) {
                alert('Please allow location access.');
                setTimeout(requestLocationPermission, 2000); // Wait for 2 seconds before retrying
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred: ' + textStatus);
        }
    });
}

function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            location.reload();
        }, function(error) {
            alert('Location access was denied or an error occurred. Please enable it in your browser settings.');
            setTimeout(function() {
                window.location.href = "/appauth-logout";
            }, 5000); // Redirect after 3 seconds
        });
    } else {
        alert('Geolocation is not supported in this browser.');
    }
}

$('#branchModal').off('shown.bs.modal').on('shown.bs.modal', async function() {
    let branch_code = document.getElementById('id_global_branch_code').value;
    const branchChoice = `/appauth-branch-change`;
    await setChoiceItemByGetRequest(branchChoice, "id_switch_branch_code");
    document.getElementById('id_switch_branch_code').value = branch_code;
    initializeSelect2('id_switch_branch_code');
});

$("#id_switch_branch_code").on("change", async function(e) {
    const branchcodeobj = new FormData();
    let branch_code = this.value;
    branchcodeobj.append('branch_code', branch_code);
    const setbrnUrl = `/appauth-set-branch`;
    const detailsData = await fnBackendCommunicator(branchcodeobj, 'POST', setbrnUrl);
    if (detailsData.form_is_valid) {
        fnSuccessSwalMessage(detailsData.success_message);
    } else {
        fnFailedSwalMessage(detailsData.error_message);
    }
    location.reload();
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.icon-link').forEach(function(el) {
        el.addEventListener('click', function(e) {
            const url = el.getAttribute('data-url');
            const openInModal = el.getAttribute('data-modal') === 'true';

            if (openInModal) {
                e.preventDefault();

                const modal = new bootstrap.Modal(document.getElementById('iconModal'));
                document.getElementById('modalContent').innerHTML = '<p class="text-center">Loading...</p>';

                fetch(url)
                    .then(res => res.text())
                    .then(html => {
                        document.getElementById('modalContent').innerHTML = html;
                        modal.show();
                    })
                    .catch(() => {
                        document.getElementById('modalContent').innerHTML = '<p class="text-danger">Error loading content.</p>';
                    });
            }
        });
    });

    fnShowPaymentDueNotice();
});


function fnShowPaymentDueNotice() {
    try {
        const isPaymentDue = document.getElementById('id_is_payment_due').value;
        if (isPaymentDue === 'True') {
            PaymentDueModal = new bootstrap.Modal(document.getElementById('idPaymentDueModal'));
            PaymentDueModal.show();
        }
    } catch (error) {

    }
}