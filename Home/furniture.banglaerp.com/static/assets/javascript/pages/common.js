$(function() {
    var current = location.pathname;
    $("#stacked-menu li a").each(function() {
        var $this = $(this);
        // if the current path is like this link, make it active
        if ($this.attr("href").indexOf(current) !== -1) {
            $this.addClass("has-active active-nav-link-color");
            // this.parent().addClass('has-active');
            $this.parents(".has-child").addClass("has-open has-active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll("#new-stacked-menu .menu-link");

    menuLinks.forEach(link => {
        const programNames = link.dataset.programNames;
        let pathList = (link.getAttribute("href") + ', ' + programNames).split(', ');
        pathList = pathList.filter(Boolean);
        if (pathList.includes(currentPath)) {
            menuLinks.forEach(l => l.classList.remove("new-active-nav-link-color"));
            link.classList.add("new-active-nav-link-color");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll(".mobile-module .module-link");

    menuLinks.forEach(link => {
        const programNames = link.dataset.programNames;
        let pathList = (link.getAttribute("href") + ', ' + programNames).split(', ');
        pathList = pathList.filter(Boolean);
        if (pathList.includes(currentPath)) {
            menuLinks.forEach(l => l.classList.remove("mobile-active-nav-link-color"));
            link.classList.add("mobile-active-nav-link-color");
        }
    });
});

function fn_lng_togole() {
    let lan = document.getElementById('lng_togole')

    $.ajax({
        url: "/appauth-language-set",
        type: "POST",
        data: {
            is_bengali_format: lan.checked
        },
        success: function(data) {
            document.location.reload(true);
        },
    });
}

function TopbarGobalSearch() {
    var search_value = $('#top-bar-gobal-search-input').val()

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
                    $('#top-bar-search-result').html(list)
                } else {
                    error = '<h5 style="color:red">No Result Found</h5>'
                    $('#top-bar-search-result').html(error)
                }
            }
        });
    }

    if (search_value.length) {
        $('#top-bar-search-result').css('display', 'block');
    } else {
        $('#top-bar-search-result').css('display', 'none');
    }
}