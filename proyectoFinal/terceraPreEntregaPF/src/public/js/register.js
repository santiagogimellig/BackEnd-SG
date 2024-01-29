// Obtengo la referencia al formulario con ID 'registerForm'.
const form = document.getElementById('registerForm');

// Agrego un evento de escucha para el envío del formulario.
form.addEventListener('submit', e => {
    console.log("Submit register")
    // Evito que el formulario se envíe de manera predeterminada.
    e.preventDefault();
    // Creo un objeto FormData con los datos del formulario.
    const data = new FormData(form);
    const obj = {};
    // Itero sobre los datos del formulario y los agrego al objeto.
    data.forEach((value, key) => obj[key] = value);
    // Realizo una solicitud fetch para registrar al usuario.
    fetch('/api/session/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        console.log(result)
        // Verifico si la solicitud fue exitosa (código de estado 200).
        if (result.status == 200) {
            // Redirijo a la página principal después del registro exitoso.
            window.location.replace('/')
        }
    }).catch(error => {
        // Manejo de errores. Puedes personalizar esta sección según tus necesidades.
        console.error(error);
    });
});