import messageModel from '../models/message_model.js';

export default class MessageManager {
    constructor() {
        console.log('Iniciando gestor de mensajes en la base de datos');
    }

    getAllMessages = async () => {
        try {
            const chatMessages = await messageModel.find().lean();
            return chatMessages;
        } catch (error) {
            console.log(error);
            throw new Error('Error al recuperar mensajes del chat');
        }
    };

    addMessage = async (newMessage) => {
        try {
            const addedMessage = await messageModel.create(newMessage);
            return addedMessage;
        } catch (error) {
            console.log(error);
            throw new Error('Error al agregar nuevo mensaje al chat');
        }
    };
}