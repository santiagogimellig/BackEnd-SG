import { Router } from "express"; // Importar el enrutador de Express
import UsersController from "../../controllers/users.controller.js"; // Importar el controlador de usuarios

const router = Router(); // Crear un nuevo enrutador

// Ruta para cambiar el rol de un usuario a premium o viceversa
router.get('/premium/:uid', async (req, res, next) => {
    const { uid } = req.params; // Obtener el ID de usuario de los parámetros de la URL
    try {
        let user = await UsersController.getById(uid); // Obtener el usuario por su ID
        if (user) { // Verificar si se encontró el usuario
            if (user.rol === 'user') { // Si el usuario es de rol 'user'
                await UsersController.updateById(uid, { rol: "premium" }); // Actualizar el rol del usuario a 'premium'
            } else { // Si el usuario es de rol 'premium'
                await UsersController.updateById(uid, { rol: 'user' }); // Actualizar el rol del usuario a 'user'
            }
            user = await UsersController.getById(uid); // Obtener el usuario actualizado
            return res.status(200).json({ message: `User ${user.firstName} ${user.lastName} is now ${user.rol}` }); // Devolver mensaje de éxito con el nombre y rol actualizado del usuario
        }
        return res.status(400).json({ error: `Usuario con id ${uid} no encontrado` }); // Devolver error si no se encontró el usuario
    } catch (error) {
        console.log('Error', error.message); // Manejar error
        next(error);
    }
});

export default router; // Exportar el enrutador