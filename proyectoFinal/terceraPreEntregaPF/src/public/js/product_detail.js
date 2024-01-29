// Obtengo la referencia al elemento con ID 'cartId'.
const cartId = document.getElementById('cartId');

// Función para agregar un producto al carrito.
function addProduct(idProduct) {
  // Realizo una solicitud axios para agregar el producto al carrito.
  axios.post(`http://localhost:8080/api/carts/${cartId.value}/product/${idProduct}`)
    .then(response => {
      // Redirijo a la página del carrito después de agregar el producto.
      window.location.href = `/carts/${cartId.value}`;
    })
    .catch(error => {
      console.error(error);
    });
}

// Función para verificar la carga exitosa del script.
function checkScriptLoad() {
  console.log('Script loaded successfully.');
}