// Importar la clase TicketDao desde el archivo ticket.dao.js
import TicketDao from "../dao/ticket.dao.js";

// Definir la clase TicketsService
export default class TicketsService {
    // Método estático para encontrar todos los tickets, con la opción de aplicar un filtro y opciones adicionales
    static findAll(filter = {}, options = {}) {
        // Llamar al método get del TicketDao para encontrar todos los tickets
        return TicketDao.get(filter, options);
    }

    // Método estático asincrónico para crear un nuevo ticket
    static async create(payload) {
        // Registrar un mensaje de creación de ticket en el logger
        req.logger.info('Creando Ticket');
        // Crear un nuevo ticket utilizando el método create del TicketDao
        const ticket = await TicketDao.create(payload);
        // Registrar un mensaje de éxito con el ID del ticket creado en el logger
        req.logger.info(`Ticket creado correctamente (${ticket._id})`);
        // Retornar el ticket creado
        return ticket;
    }

    // Método estático para encontrar un ticket por su ID
    static findById(tid) {
        // Llamar al método getById del TicketDao para encontrar un ticket por su ID
        return TicketDao.getById(tid);
    }

    // Método estático para actualizar un ticket por su ID
    static updateById(tid, payload) {
        // Llamar al método updateById del TicketDao para actualizar un ticket por su ID
        return TicketDao.updateById(tid, payload);
    }

    // Método estático para eliminar un ticket por su ID
    static deleteById(tid) {
        // Llamar al método deleteById del TicketDao para eliminar un ticket por su ID
        return TicketDao.deleteById(tid);
    }
}
