import { Router } from 'express'; // Importar el enrutador de Express

const router = Router(); // Crear un nuevo enrutador

// Definir una ruta GET para el endpoint '/'
router.get('/', async (req, res) => {
    try {
        res.render(); // Renderizar algo, como una vista (se espera que se pase el nombre de la vista y datos adicionales)
    } catch (error) {
        console.log(`Error ${error.message}`); // Manejar cualquier error que ocurra durante la renderización
    }
});

export default router; // Exportar el enrutador