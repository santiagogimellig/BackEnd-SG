// Importo el servicio necesario desde su respectivo archivo.
import TicketsService from "../services/tickets.services.js";

// Exporto la clase 'TicketController'.
export default class TicketController {
    // Método estático para obtener tickets con un filtro y opciones de paginación.
    static async get(filter, options) {
        // Obtengo todos los tickets utilizando el servicio 'TicketsService' con el filtro y opciones proporcionados.
        const tickets = await TicketsService.findAll(filter, options);
        // Devuelvo los tickets obtenidos.
        return tickets;
    }

    // Método estático para crear un nuevo ticket.
    static async create(data = {}) {
        // Creo un nuevo ticket utilizando el servicio 'TicketsService' con los datos proporcionados.
        const ticket = await TicketsService.create(data);
        // Devuelvo el ticket creado.
        return ticket;
    }

    // Método estático para obtener un ticket por su ID.
    static async getById(tid) {
        // Obtengo el ticket por su ID utilizando el servicio 'TicketsService'.
        return await TicketsService.findById(tid);
    }

    // Método estático para eliminar un ticket por su ID.
    static async deleteById(tid) {
        // Imprimo un mensaje indicando que se está eliminando el ticket.
        console.log("Eliminando ticket");
        // Elimino el ticket por su ID utilizando el servicio 'TicketsService'.
        await TicketsService.deleteById(tid);
        // Imprimo un mensaje indicando que el ticket se ha eliminado correctamente.
        console.log(`Ticket con id ${tid} eliminado correctamente`);
    }
}