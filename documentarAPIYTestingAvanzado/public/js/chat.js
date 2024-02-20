(function () {
    let username;
    const socket = io();
    const formMessage = document.getElementById('form-message');
    const inputMessage = document.getElementById('input-message');
    const logMessages = document.getElementById('log-messages');

    formMessage.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = inputMessage.value;
        socket.emit('new-message', { username, message });
        inputMessage.value = '';
        inputMessage.focus();
    })

    function updateLogMessages(messages) {
        logMessages.innerText = '';
        messages.forEach((msg) => {
            const p = document.createElement('p');
            p.innerText = `${msg.username}: ${msg.message}`;
            logMessages.appendChild(p);
        });
    }

    socket.on('notification', (messages) => {
        updateLogMessages(messages);
    });

    socket.on('listMessages', (messages) => {
        updateLogMessages(messages);
    })

    socket.on('new-message-from-api', (message) => {
        console.log('new-message-from-api ->', message);
    });

    socket.on('new-client', () => {
        Swal.fire({
            text: 'Nuevo usuario conectado',
            toast: true,
            position: "top-right",
        });
    });

    Swal.fire({
        title: 'Identificate por favor 👮',
        input: 'text',
        inputLabel: 'Ingresa tu email',
        allowOutsideClick: false,
        inputValidator: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Ingresa un email válido.';
            }
        },
    })
        .then((result) => {
            username = result.value.trim();
            Swal.fire({
                title: `Bienvenido ${username}`
            })
            console.log(`Hola ${username}, bienvenido `);
        })
})();