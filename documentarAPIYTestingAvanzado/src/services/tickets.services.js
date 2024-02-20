import TicketDao from "../dao/ticket.dao.js"; // Importa el DAO de tickets para interactuar con la base de datos

// Define la clase TicketsService para manejar las operaciones relacionadas con los tickets
export default class TicketsService {
    // Método estático para encontrar todos los tickets según un filtro opcional y opciones adicionales
    static findAll(filter = {}, options = {}) {
        return TicketDao.get(filter, options); // Llama al método get del DAO de tickets y devuelve el resultado
    }

    // Método estático asincrónico para crear un nuevo ticket
    static async create(payload) {
        console.log('Creando Ticket'); // Imprime un mensaje de registro
        const ticket = await TicketDao.create(payload); // Llama al método create del DAO de tickets para crear un nuevo ticket
        console.log(`Ticket creado correctamente (${ticket._id})`); // Imprime un mensaje de registro con el ID del ticket creado
        return ticket; // Devuelve el ticket creado
    }

    // Método estático para encontrar un ticket por su ID
    static findById(tid) {
        return TicketDao.getById(tid); // Llama al método getById del DAO de tickets para encontrar un ticket por su ID y devuelve el resultado
    }

    // Método estático para actualizar un ticket por su ID
    static updateById(tid, payload) {
        return TicketDao.updateById(tid, payload); // Llama al método updateById del DAO de tickets para actualizar un ticket por su ID y devuelve el resultado
    }

    // Método estático para eliminar un ticket por su ID
    static deleteById(tid) {
        return TicketDao.deleteById(tid); // Llama al método deleteById del DAO de tickets para eliminar un ticket por su ID y devuelve el resultado
    }
}