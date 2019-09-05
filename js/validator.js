//  Sign Up form
var firstName = document.getElementById('FullName');
var regno = document.getElementById('Regno');
var email = document.getElementById('Email');
var password = document.getElementById('Password');

var submit = document.getElementById("signup");
var opt1 = document.getElementById("Schools");
var opt2 = document.getElementById("Dept");

submit.addEventListener("click", function () {

    
    var password_patt = /^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%]{6,12}$/,
    var email_match = email.value.match(email_patt);
    var regno_patt = /(H|h)([0-9]{6})([a-zA-Z])/g;
   
    var regno_match = regno.value.match(regno_patt);

    if (!fullname.value) {
        fullname.setCustomValidity('Please submit your First Name');
        fullname.style.borderColor = "red";
        return false;
    }  else if  (!regno.value) {
        fullname.setCustomValidity('Please submit your regno');
        fullname.style.borderColor = "red";
        return false;
    }
     else if (regno_match == null) {
        regno.setCustomValidity('Please enter correct registration no');
        regno.style.borderColor = "red";
        return false;
    } else if (!email.value) {
        email.setCustomValidity('Please submit your Email');
        email.style.borderColor = "red";
        return false;
    } 
    else if (!password.value) {
        password.setCustomValidity('Please enter a password');
        password.style.borderColor = "red";
        return false;
    } else if (password_match == null) {
        password.setCustomValidity('The password must be between (6 to 12) characters including Uppercase letter, Special character and Alphanumeric characters.');
        password.style.borderColor = "red";
        return false;
    } else {
        return true;
    }
});

//Clearing feedback on inputs
function Clear(Vars) {
    for (let i = 0; i < Vars.length; i++) {
        function Clr() {
            Vars[i].setCustomValidity('');
            Vars[i].style.removeProperty('border');
        }
        Vars[i].addEventListener("click", Clr, false);
        Vars[i].addEventListener("oninput", Clr, false);
    }

};

