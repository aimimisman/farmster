// document.getElementById("registrationForm").addEventListener("submit", function(e) {
//     e.preventDefault();

//     let data = {
//         name: document.getElementById("name").value,
//         firstname: document.getElementById("firstname").value,
//         lastname: document.getElementById("lastname").value,
//         contact: document.getElementById("contact").value,
//         email: document.getElementById("email").value,
//         password: document.getElementById("password").value
//     };

//     fetch("https://script.google.com/macros/s/AKfycbwsrofnF98daRqUpTw7s8VAuooECtJfADhVaJi6ahzHAKeZcNnpTKVrnBS1XgRyLJ0HYg/exec?action=DataProfile", {
//         method: "POST",
//         body: JSON.stringify(data)
//     })
//     .then(res => res.json())
//     .then(res => {
//         console.log(res);
//         alert(res.message);
//     })
//     .catch(err => console.error(err));
// });

// dayah adjust : 

const BASE_URL =

window.location.hostname.includes("github.io")

? "https://aimimisman.github.io/farmster"

: "";



document.getElementById("registrationForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const data = {

        name:
        document.getElementById("name")
        .value.trim(),

        firstname:
        document.getElementById("firstname")
        .value.trim(),

        lastname:
        document.getElementById("lastname")
        .value.trim(),

        contact:
        document.getElementById("contact")
        .value.trim(),

        email:
        document.getElementById("email")
        .value.trim(),

        password:
        document.getElementById("password")
        .value.trim()

    };


fetch(
"https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec?action=register",

{

method:"POST",

body:JSON.stringify(data)

})

.then(res=>res.json())

.then(res=>{

    console.log(res);

    alert(

        res.data?.message ||

        res.message ||

        "Registration successful"

    );


    if(

        res.status==="success"

        ||

        res.data?.status==="success"

    ){

        window.location.href =

        BASE_URL +

"/modules/member-b/farmer-profile/login.html";

    }

})

.catch(err=>{

    console.error(err);

    alert("Registration failed");

});

});