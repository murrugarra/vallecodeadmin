$(document).ready(function () {
    initLoginForm();
});

function initLoginForm() {
    $("#form-login").on("submit", handleLoginSubmit);
}

function handleLoginSubmit(event) {
    event.preventDefault();

    let data = {
        email: $("#email").val().trim(),
        password: $("#password").val().trim(),
    };

    if (!data.email || !data.password) {
        alert("Por favor, ingrese su email y contraseña.");
        return;
    }

    sendLoginRequest(data);
}

function sendLoginRequest(data) {
    $.ajax({
        url: `${HOST}/api/auth/login`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response.message);
            window.location.href = "/dashboard";
        },
        error: function (xhr) {
            console.error("Error en la solicitud:", xhr); // 🔍 Muestra detalles en consola
            let errorMsg =
                xhr.responseJSON?.message ||
                `Error desconocido. Código: ${xhr.status}`;
            alert("Error: " + errorMsg);
        },
    });
}
