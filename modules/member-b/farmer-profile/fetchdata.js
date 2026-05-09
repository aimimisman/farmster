document.getElementById("registrationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let data = {
        name: document.getElementById("name").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        contact: document.getElementById("contact").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("https://script.google.com/macros/s/AKfycbwsrofnF98daRqUpTw7s8VAuooECtJfADhVaJi6ahzHAKeZcNnpTKVrnBS1XgRyLJ0HYg/exec?action=dataprofile", {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        alert(res.message);
    })
    .catch(err => console.error(err));
});