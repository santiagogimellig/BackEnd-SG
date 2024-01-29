// Capturo el formulario de inicio de sesión por su ID.
const form = document.getElementById("loginForm");

// Agrego un evento de escucha al formulario cuando se envía.
form.addEventListener('submit', e => {
    // Evito que el formulario se envíe de manera convencional.
    e.preventDefault();
    // Creo un objeto FormData para recopilar los datos del formulario.
    const data = new FormData(form);
    // Convierto los datos del formulario en un objeto plano.
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    // Realizo una solicitud fetch para enviar los datos de inicio de sesión al servidor.
    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(result => {
            // Verifico si la respuesta no tiene un error.
            if (!result.error) {
                // Redirijo a la página de productos si la autenticación es exitosa.
                window.location.replace('/products');
            } else {
                // Muestro una alerta con el mensaje de error en caso contrario.
                alert(result.error);
            }
        })
        .catch((error) => {
            // Muestro una alerta en caso de error en la solicitud.
            alert(error);
        });
});