//User SignUp validation

function signupValidate() {
    //event.preventDefault();
    let name = document.getElementById('name').value.trim();
    let username = document.getElementById('userName').value.trim();
    let email = document.getElementById('email').value.trim();
    let mobileNo = document.getElementById('phoneNumber').value.trim();
    let password = document.getElementById('password').value.trim();
    let confirmPasword = document.getElementById('confirm_Password').value.trim();
    // let emailCheck = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    let errorFlag = 0;


    // For First Name
    if (name == "") {
        document.getElementById('nameError').innerHTML = "*Required";
        errorFlag = 1;
    } else if (name.length < 2) {
        document.getElementById('nameError').innerHTML = "* Name is too Short";
        errorFlag = 1;
    } else {
        document.getElementById('nameError').innerHTML = "";
    }

    // For Last Name
    // if(lname==""){
    //     document.getElementById('lnameError').innerHTML = "*Required";
    //     errorFlag=1;
    // }else if(lname.length < 2){
    //     document.getElementById('lnameError').innerHTML = "*Last Name is too Short";
    //     errorFlag=1;
    // }else{
    //     document.getElementById('lnameError').innerHTML = "";
    // }

    // For User Name
    if (username == "") {
        document.getElementById('unameError').innerHTML = "*Required";
        errorFlag = 1;
    } else if (username.length < 2) {
        document.getElementById('unameError').innerHTML = "*User Name is too Short";
        errorFlag = 1;
    } else {
        document.getElementById('unameError').innerHTML = "";
    }

    // For Email
    if (email == "") {
        document.getElementById('emailError').innerHTML = "*Email Require";
        errorFlag = 1;
    }
    // else if (email.test != emailCheck){
    //     document.getElementById('emailError').innerHTML = "*Email Invalid";
    //     errorFlag =1
    // }
    else {
        document.getElementById('emailError').innerHTML = "";
    }

    // For Mobile
    if (mobileNo == "") {
        document.getElementById('mobileError').innerHTML = "*Mobile No. Required";
        errorFlag = 1
    } else if (mobileNo.length < 10) {
        document.getElementById('mobileError').innerHTML = "*Invalid Mobile No.";
        errorFlag = 1
    } else {
        document.getElementById('mobileError').innerHTML = "";
    }

    // For Password
    if (password == "") {
        document.getElementById('passwordError').innerHTML = "*Password Required";
        errorFlag = 1
    } else if (password.length < 6) {
        document.getElementById('passwordError').innerHTML = "*Password length must be greater than 6";
        errorFlag = 1
    } else {
        document.getElementById('passwordError').innerHTML = "";
    }

    //For Confirm Password
    if (confirmPasword == "") {
        document.getElementById('confirmPaswordError').innerHTML = "*Confirm Pasword Required";
        errorFlag = 1
    } else if (confirmPasword != password) {
        document.getElementById('confirmPaswordError').innerHTML = "*Confirm password does not Match";
        errorFlag = 1
    } else {
        document.getElementById('confirmPaswordError').innerHTML = "";
    }

    if (errorFlag == 1) {
        return false
    } else
        return true;
}

function loginValidate() {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let errorFlag = 0;

    if (email == "") {
        document.getElementById('emailError').innerHTML = "*Email Required";
        document.getElementById('email').style.borderColor = "red"
        errorFlag = 1
    }
    // else if(email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
    //     document.getElementById('emailError').innerHTML = "*Invalid Email";
    //     errorFlag=1
    // }
    else {
        document.getElementById('emailError').innerHTML = "";
        document.getElementById('email').style.borderColor = "green"
    }

    if (password == "") {
        document.getElementById('passwordError').innerHTML = "*Password Required";
        document.getElementById('password').style.borderColor = "red"
        errorFlag = 1
    } else {
        document.getElementById('passwordError').innerHTML = "";
        document.getElementById('password').style.borderColor = "green"
    }

    if (errorFlag == 1) {
        return false
    }
    else {
        return true;
    }
}
function forgotPasswordUpdate() {
    let password = document.getElementById('password').value.trim();
    let confirmPasword = document.getElementById('cfmPassword').value.trim();
    let errorFlag = 0;

    if (password == "") {
        document.getElementById('passwordError').innerHTML = "*Password Required";
        errorFlag = 1
    } else if (password.length < 6) {
        document.getElementById('passwordError').innerHTML = "*Password length must be greater than 6";
        errorFlag = 1
    } else {
        document.getElementById('passwordError').innerHTML = "";
    }

    //For Confirm Password
    if (confirmPasword == "") {
        document.getElementById('cfmPasswordError').innerHTML = "*Confirm Pasword Required";
        errorFlag = 1
    } else if (confirmPasword != password) {
        document.getElementById('cfmPasswordError').innerHTML = "*Confirm password does not Match";
        errorFlag = 1
    } else {
        document.getElementById('cfmPasswordError').innerHTML = "";
    }

    if (errorFlag == 1) {
        return false
    } else
        return true;
}



function adminLoginValidation() {

    let email = document.getElementById('form-holder').value.trim();
    let password = document.getElementById('form-holder2').value.trim();
    let error = 0;
    if (email == "") {
        document.getElementById('emailError').innerHTML = "*email is Required"
        error = 1;
    } else {
        document.getElementById('emailError').innerHTML = ""
    }
    if (password == "") {
        document.getElementById('passwordError').innerHTML = "*Password is Required"
        error = 1;
    } else {
        document.getElementById('passwordError').innerHTML = ""
    }
    if (error == 1) {
        return false

    }
    else {
        return true;
    }

}

function addToCart(productId, price) {
    let count = $('#cartCount').html()
    let wishCount = $('#whishlistCount').html()
    $.ajax({
        url: '/product/addToCart',
        type: 'post',
        data: {
            price: price,
            productId: productId,
        },
        success: (response) => {
            if (response.status == "addedToCart") {
                count = parseInt(count) + 1
                $("#cartCount").html(count)
                if (wishCount > 0) {
                    wishCount = parseInt(wishCount) - 1
                    $("#whishlistCount").html(wishCount)
                }
                Swal.fire({
                    position: 'top-right',
                    icon: 'success',
                    title: 'product has been added to cart',
                    showConfirmButton: false,
                    timer: 1500
                })
                $(".content").load(location.href + " .content");

            }
            else if (response.status == "countAdded") {
                count = parseInt(count) + 1
                $("#cartCount").html(count)
                if (wishCount > 0) {
                    wishCount = parseInt(wishCount) - 1
                    $("#whishlistCount").html(wishCount)
                }
                Swal.fire({
                    position: 'top-right',
                    icon: 'success',
                    title: 'product count added',
                    showConfirmButton: false,
                    timer: 1500
                })
                $(".content").load(location.href + " .content");

            }
            else {
                location.href = '/userLogin'
            }
        }
    })
}


function addtoWhislist(productId) {
    let count = $('#whishlistCount').html()
    $.ajax({
        url: '/wishlist',
        data: { productId: productId },
        method: 'post',
        success: (response) => {
            console.log(response);
            if (response.status == true) {

                count = parseInt(count) + 1
                $("#whishlistCount").html(count)
                Swal.fire({
                    position: 'top-right',
                    icon: 'success',
                    title: 'product has been added to wishlist',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            else if (response.status == "alreadyExists") {
                Swal.fire({
                    position: 'top-right',
                    icon: 'success',
                    title: 'product exists in  your wishlist',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                location.href = '/userLogin'
            }
        }
    })
}


// Profile information update
function editProfile() {
    document.getElementById("name").disabled = false
    document.getElementById("userName").disabled = false
    document.getElementById("proBtn").style.display = 'block'
    document.getElementById("proEditBtn").style.display = 'none'
    document.getElementById("proCaneclBtn").style.display = 'block'
}


function cancelBtn() {
    document.getElementById("name").disabled = true
    document.getElementById("userName").disabled = true
    document.getElementById("proBtn").style.display = 'none'
    document.getElementById("proEditBtn").style.display = 'block'
    document.getElementById("proCaneclBtn").style.display = 'none'
}


// Email & Mobile Information update fields enable and disable
function emailEdit() {
    document.getElementById('phoneNumber').disabled = false
    document.getElementById('email').disabled = false
    document.getElementById("emailBtn").style.display = 'block'
    document.getElementById("emailCancelBtn").style.display = 'block'
    document.getElementById("emailEditBtn").style.display = 'none'
}
function emailCancel() {
    document.getElementById('phoneNumber').disabled = true
    document.getElementById('email').disabled = true
    document.getElementById("emailBtn").style.display = 'none'
    document.getElementById("emailCancelBtn").style.display = 'none'
    document.getElementById("emailEditBtn").style.display = 'block'
}

// Profile Update Form
const profileUpdateForm = document.getElementById('profileUpdateForm')

profileUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(profileUpdateForm);

    //Converting the data to Json object
    const data = Object.fromEntries(formData)

    fetch('/userProfile/profile/update', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then((response) => {
        window.location.reload()
    })

})


// Email and Mobile Update Form
const emailUpdateForm = document.getElementById('emailUpdateForm')
emailUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(emailUpdateForm);
    const data = Object.fromEntries(formData);

    fetch('/userProfile/email/update', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then((response) => {
        window.location.reload()
    })
})



//Update Password
const changePasswordForm = document.getElementById('changePassword')
changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(changePasswordForm);
    const data = Object.fromEntries(formData)

    let NewPassword = document.getElementById('profilePassword').value.trim();
    let cfmPassword = document.getElementById('profileCfmPassword').value.trim();

    if(NewPassword===cfmPassword){
        fetch('/userProfile/password/update', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(() => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'password has been updated',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(()=>{
                location.reload()
            },1500)
        })
      
    }
    else{
        document.getElementById('userProfilePasswordError').innerHTML='Confirm password should match';
    }
    
})