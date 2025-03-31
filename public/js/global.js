$(document).ready(function () {
    // Verificar que la variable HOST esté definida antes de hacer la petición
    if (typeof HOST === "undefined") {
        console.error("Error: La variable HOST no está definida.");
        return;
    }

    // Petición AJAX para obtener la información del usuario
    $.ajax({
        type: "GET",
        url: `${HOST}/api/auth/info`,
        dataType: "json",
        xhrFields: {
            withCredentials: true, // 🔹 Necesario para enviar cookies
        },
        success: function (response) {
            if (response && response.user) {
                $("#userInNavBar").html(`
                    <div>
                        <strong>${response.user.name}</strong>
                        <div class="text-muted" style="font-size: 12px;">(${response.user.role})</div>
                    </div>
                `);
            } else {
                $("#userInNavBar").text("Invitado");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la petición AJAX:", error);
            console.error("Respuesta del servidor:", xhr.responseText);
            $("#userInNavBar").text("Invitado");
        },
    });
});
