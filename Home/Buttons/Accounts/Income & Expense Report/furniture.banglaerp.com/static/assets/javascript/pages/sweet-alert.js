function alert(msg, icon = "info", title = "Alert!", showConfirmButton = true) {
    try {
        const message = JSON.parse(msg);
        let objKeys = Object.keys(message);
        let html_syntex = objKeys.map((e) => {
            return `<div class="col-12"><h6 style="color:red">${e}:${message[e][0].message}</h6></div>`;
        });
        Swal.fire({
            title: title,
            html: `${html_syntex}`,
            icon: icon,
            position: "top",
            width: "800px",
            showConfirmButton: showConfirmButton,
        });
    } catch (e) {
        // console.warn(e);
        Swal.fire({
            title: title,
            html: msg,
            icon: icon,
            position: "top",
            width: "800px",
            showConfirmButton: showConfirmButton,
        });
    } finally {}
}

async function confirm(msg) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success m-2",
            cancelButton: "btn btn-danger m-2",
        },
        buttonsStyling: false,
    });
    var data = await swalWithBootstrapButtons
        .fire({
            title: "Are you sure?",
            text: msg,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, do it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                return false;
            }
        });

    return data;
}