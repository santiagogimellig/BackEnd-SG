// Importo el servicio necesario desde un archivo local
import TicketsService from "../services/tickets.services.js";

// Defino y exporto la clase TicketController
export default class TicketController {
    // Método estático para obtener tickets
    static async get(filter, options) {
        // Obtengo los tickets utilizando el servicio de tickets
        const tickets = await TicketsService.findAll(filter, options)
        return tickets; // Devuelvo los tickets obtenidos
    }

    // Método estático para crear un ticket
    static async create(data = {}) {
        // Creo un nuevo ticket utilizando los datos proporcionados y el servicio de tickets
        const ticket = await TicketsService.create(data)
        return ticket; // Devuelvo el ticket creado
    }

    // Método estático para obtener un ticket por su ID
    static async getById(tid) {
        return await TicketsService.findById(tid) // Obtengo el ticket por su ID utilizando el servicio de tickets
    }

    // Método estático para eliminar un ticket por su ID
    static async deleteById(tid) {
        console.log("Eliminando ticket");
        await TicketsService.deleteById(tid); // Elimino el ticket por su ID utilizando el servicio de tickets
        console.log(`Ticket con id ${tid} eliminado correctamente`);
    }
}