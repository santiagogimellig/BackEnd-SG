// Importo el modelo de ticket desde el archivo ticket.model.js
import TicketModel from "../models/ticket.model.js";

// Defino una clase llamada TicketDao para manejar operaciones de acceso a datos relacionadas con los tickets
export default class TicketDao {
    // Defino un método estático para obtener tickets de la base de datos
    // Puedo proporcionar criterios de búsqueda opcionales y opciones de consulta
    static get(criteria = {}, options = {}) {
        // Utilizo el método find() del modelo TicketModel para buscar tickets en la base de datos
        // Puedo especificar criterios de búsqueda y opciones de consulta
        return TicketModel.find(criteria, options);
    }

    // Defino un método estático para crear un nuevo ticket en la base de datos
    // Necesito proporcionar los datos del nuevo ticket como parámetro
    static create(data) {
        // Utilizo el método create() del modelo TicketModel para insertar un nuevo ticket en la base de datos
        // Paso los datos del ticket que deseo crear al método create()
        return TicketModel.create(data);
    }

    // Defino un método estático para obtener un ticket de la base de datos por su ID
    // Necesito proporcionar el ID del ticket que deseo buscar
    static getById(tid) {
        // Utilizo el método findById() del modelo TicketModel para buscar un ticket por su ID
        // Paso el ID del ticket al método findById()
        return TicketModel.findById(tid);
    }

    // Defino un método estático para actualizar un ticket en la base de datos por su ID
    // Necesito proporcionar el ID del ticket que deseo actualizar y los nuevos datos del ticket
    static updateById(tid, data) {
        // Utilizo el método updateOne() del modelo TicketModel para actualizar un ticket por su ID
        // Paso un objeto de consulta que busca un ticket por su ID y un objeto de actualización que contiene los nuevos datos del ticket
        return TicketModel.updateOne({ _id: tid }, { $set: data });
    }

    // Defino un método estático para eliminar un ticket de la base de datos por su ID
    // Necesito proporcionar el ID del ticket que deseo eliminar
    static deleteById(tid) {
        // Utilizo el método deleteOne() del modelo TicketModel para eliminar un ticket por su ID
        // Paso un objeto de consulta que busca un ticket por su ID
        return TicketModel.deleteOne({ _id: tid });
    }
}
