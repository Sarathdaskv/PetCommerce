function changeAccess(id, ban) {
    $.ajax({
        url: '/admin/customerManagement',
        type: 'patch',
        data: {
            userId: id,
            Ban: ban
        },
        success: (res) => {
            $("#" + id).load(location.href + " #" + id);
        }
    })
}

function changeListing(id) {
    $.ajax({
        url: `/admin/productManagement/changeListing/${id}`,
        type: 'patch',

        success: (res) => {
            $("#" + id).load(location.href + " #" + id);
        }
    })
}

function deleteCategory(id, e) {
    e.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

        if (result.isConfirmed) {
            $.ajax({
                url: `/admin/categories/${id}`,
                method: 'delete',
                success: (res) => {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Category has been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })

                }

            })
        }

        window.location.href = `/admin/categories`
    })
}
function editCategory(id, e, element) {
    e.preventDefault();
    Swal.fire({
        title: 'Do you want to edit?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, edit it!'
    }).then((result) => {

        if (result.isConfirmed) {
            let url = element.getAttribute('href');
            window.location.href = url;

        }
    })
}




function productValidate() {

    let categoryId = document.getElementById('inputState').value.trim();
    let emptyVarientName;
    let e = document.getElementById("inputState");
    let data = e.options[e.selectedIndex].text;

    if (data == 'food') {
        $(".supplement").empty();
        $(".accessories").empty();
    }
    if (data == 'supplement') {
        $(".food").empty();
        $(".accessories").empty();
    }
    if (data == 'accessories') {
        $(".supplement").empty();
        $(".food").empty();

    }
    if (data != 'food' && data != 'supplement' && data != 'accessories') {
        $(".dataDivs").empty();
    }
    let err = 0;
    if (err == 1) {
        return false
    }
    else {
        return true;
    }
}



function editProductValidate() {

    let categoryId = document.getElementById('inputState').value.trim();
    let emptyVarientName;
    let e = document.getElementById("inputState");
    let data = e.options[e.selectedIndex].text;

    if (data == 'food') {
        $(".supplement").empty();
        $(".accessories").empty();
    }
    if (data == 'supplement') {
        $(".food").empty();
        $(".accessories").empty();
    }
    if (data == 'accessories') {
        $(".supplement").empty();
        $(".food").empty();

    }
    if (data != 'food' && data != 'supplement' && data != 'accessories') {
        $(".dataDivs").empty();
    }
    let err = 0;
    if (err == 1) {
        return false
    }
    else {
        return true;
    }
}



$('#editProducts').submit(function (event) {

    let categoryId = document.getElementById('inputState').value.trim();
    let emptyVarientName;
    let e = document.getElementById("inputState");
    let data = e.options[e.selectedIndex].text;
    if (data == 'food') {
        $(".supplement").empty();
        $(".accessories").empty();
    }
    if (data == 'supplement') {
        $(".food").empty();
        $(".accessories").empty();
    }
    if (data == 'accessories') {
        $(".supplement").empty();
        $(".food").empty();

    }
    if (data != 'food' && data != 'supplement' && data != 'accessories') {
        $(".dataDivs").empty();
    }
})


function editProductsAlertBox(id, e, element) {
    e.preventDefault();
    Swal.fire({
        title: 'Do you want to edit?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, edit it!'
    }).then((result) => {

        if (result.isConfirmed) {
            let url = element.getAttribute('href');
            window.location.href = url;

        }
    })
}



function changeBannerActivity(id, active) {
    $.ajax({
        url: "/admin/bannerManagement",
        type: "patch",
        data: {
            bannerId: id,
            currentActivity: active,
        },
        success: (res) => {
            $("#Action" + id).load(location.href + " #Action" + id);
        },
    });
}

function deleteBanner(id) {
    $.ajax({
        url: "/admin/bannerManagement",
        type: "delete",
        data: {
            bannerId: id,
        },
        success: (res) => {
            
            $("#allBanners").load(location.href + " #allBanners");

        },
    })
} 