const express = require('express'); // Importo Express.
const app = express(); // Creo una instancia.
const fs = require('fs').promises; // Importo el modulo fs para trabajar con archivos (con promesas).

app.use(express.json()); // Configuro Express para parsear el cuerpo de las peticiones como JSON.

// Manejador para peticiones GET a la ruta /products
app.get('/products', async (req, res) => {
    try {
        const data = await fs.readFile('products.json', 'utf8'); // Leo el archivo products.json.
        const products = JSON.parse(data); // Parseo el contenido como un objeto js.

        const limit = req.query.limit; // Obtengo el valor del parametro limit de la consulta.

        if (limit) {
            res.json(products.slice(0, parseInt(limit))); // Devuelvo una lista de productos limitada.
        } else { 
            let productInfo = ''; // Inicializo una cadena de texto para almacenar la informacion de los productos en formato HTML.

            // Itero sobre cada producto y construyo la informacion en formato HTML.
            products.forEach(product => {
                productInfo += `
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p>Precio: $${product.price}</p>
                    <p>Código: ${product.code}</p>
                    <p>Stock: ${product.stock}</p>
                    <p>ID: ${product.id}</p>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <hr>
                `;
            });

            res.send(productInfo);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manejador para peticiones GET a la ruta /products/:id
app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Obtengo el valor del parametro id de la URL y lo convierto a numero entero.
        const data = await fs.readFile('products.json', 'utf8'); // Leo el archivo products.json.
        const products = JSON.parse(data); // Parse el contenido como un objeto js.

        const product = products.find(p => p.id === id); // Busco el producto por ID.

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        // Construyo la informacion en formato HTML.
        const productInfo = `
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Código: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>ID: ${product.id}</p>
            <img src="${product.thumbnail}" alt="${product.title}">
            <hr>
        `;

        res.send(productInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080.');
});
