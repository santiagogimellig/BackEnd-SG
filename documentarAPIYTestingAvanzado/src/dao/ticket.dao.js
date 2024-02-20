// Importo el modelo de ticket desde su archivo correspondiente
import TicketModel from "../models/ticket.model.js";

// Defino una clase TicketDao que proporciona métodos estáticos para interactuar con la base de datos de tickets
export default class TicketDao {
    
    // Método estático "get" que recupera una lista de tickets que coinciden con los criterios de búsqueda proporcionados
    // Los criterios de búsqueda se pueden especificar como un objeto que contiene condiciones de búsqueda,
    // y las opciones de paginación y ordenamiento también se pueden proporcionar como parámetros opcionales
    static get(criteria = {}, options = {}) {
        return TicketModel.find(criteria, options);
    }

    // Método estático "create" que crea un nuevo ticket utilizando los datos proporcionados y lo guarda en la base de datos
    static create(data) {
        return TicketModel.create(data);
    }

    // Método estático "getById" que busca un ticket por su ID en la base de datos y devuelve el ticket encontrado
    static getById(tid) {
        return TicketModel.findById(tid);
    }

    // Método estático "updateById" que actualiza un ticket existente en la base de datos utilizando su ID y los nuevos datos proporcionados
    static updateById(tid, data) {
        return TicketModel.updateOne({ _id: tid }, { $set: data });
    }

    // Método estático "deleteById" que elimina un ticket de la base de datos utilizando su ID
    static deleteById(tid) {
        return TicketModel.deleteOne({ _id: tid });
    }
}
