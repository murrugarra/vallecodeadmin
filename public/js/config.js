const HOST = "http://localhost:3000";

$(document).ready(function () {
    // Configuración de la barra de desplazamiento si está en Windows
    if (navigator.platform.indexOf("Win") > -1) {
        const sidenavScrollbar = $("#sidenav-scrollbar")[0];
        if (sidenavScrollbar) {
            Scrollbar.init(sidenavScrollbar, { damping: 0.5 });
        }
    }
});
