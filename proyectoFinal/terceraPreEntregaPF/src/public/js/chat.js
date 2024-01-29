// Creo una instancia del socket del lado del cliente.
const socketClient = io();

// Obtengo los elementos del DOM necesarios.
const chatbox = document.getElementById('chatbox');
const emailBox = document.getElementById('emailBox');
const sendBtn = document.getElementById('sendButton');

// Función para enviar mensajes al servidor.
const sendMessage = () => {
    // Emito un evento 'message' al servidor con la información del usuario y el mensaje.
    socketClient.emit('message', { user: emailBox.value, message: chatbox.value });
    // Limpio el contenido del cuadro de chat después de enviar el mensaje.
    chatbox.value = '';
};

// Evento al presionar la tecla 'Enter' en el cuadro de chat.
chatbox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Evento al hacer click en el botón de enviar.
sendBtn.addEventListener('click', (e) => {
    sendMessage();
});

// Elemento del DOM para mostrar el historial de mensajes.
const divMessages = document.getElementById("historial");

// Evento para recibir el historial de mensajes del servidor.
socketClient.on("msgHistory", (data) => {
    // Limpio el contenido actual del div de mensajes.
    divMessages.innerHTML = '';
    
    // Itero sobre los mensajes recibidos y los agrego al div.
    data.forEach(element => {
        // Creo un párrafo para cada mensaje.
        const parrafo = document.createElement('p');
        // Agrego el contenido del mensaje al párrafo.
        parrafo.innerHTML = `${element.user} - message: ${element.message}`;
        // Agrego el párrafo al div de mensajes.
        divMessages.appendChild(parrafo);
    });
});