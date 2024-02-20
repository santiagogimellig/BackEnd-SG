(function () {
    const socket = io();
    const buttonsAddProductToCart = document.getElementsByClassName("boton")
    const arrayOfButtons = Array.from(buttonsAddProductToCart)
    arrayOfButtons.forEach(element => {
        element.addEventListener('click', async (event) => {
            event.preventDefault();
            let product = {};
            let cantidad = document.getElementById(`${element.id}`).value
            let row = element.closest('tr');
            let stockElement = row.querySelector('td:nth-child(6)');
            let stockValue = stockElement.textContent.trim();
            let data
            try {
                const response = await fetch('http://localhost:8080/auth/current')
                if (response.ok) {
                    data = await response.json();
                    product = {
                        cartId: data.cartId,
                        _id: element.id,
                        quantity: cantidad
                    }
                }
            } catch (error) {
                console.error("Error", error.message)
            }
            if (data.rol != 'admin') {
                if (cantidad <= stockValue) {
                    alert("Producto agregado al carrito")
                } else {
                    alert("Stock insuficiente - Producto agregado al carrito igualmente")
                }
                socket.emit('addProductToCart', product);
                document.getElementById(`${element.id}`).value = ""
            } else {
                alert('Admin no puede agregar productos al carrito')
            }
        })
    });
    const formAddProduct = document.getElementById('form-add-product')
    const formDeleteProduct = document.getElementById('form-delete-product')
    const formUpdateProduct = document.getElementById('form-update-product');
    formAddProduct?.addEventListener('submit', (event => {
        event.preventDefault();
        const newProduct = {
            title: document.getElementById('input-title').value,
            description: document.getElementById('input-description').value,
            code: document.getElementById('input-code').value,
            price: document.getElementById('input-price').value,
            stock: document.getElementById('input-stock').value,
            category: document.getElementById('input-category').value,
            thumbnails: []
        }
        socket.emit('addProduct', newProduct)
        document.getElementById('input-title').value = '';
        document.getElementById('input-description').value = '';
        document.getElementById('input-code').value = '';
        document.getElementById('input-price').value = '';
        document.getElementById('input-stock').value = '';
        document.getElementById('input-category').value = '';
    }))

    formDeleteProduct?.addEventListener('submit', (event) => {
        event.preventDefault();
        const idProduct = document.getElementById('input-id-product').value;
        socket.emit('deleteProduct', idProduct)
        document.getElementById('input-id-product').value = '';
    })

    formUpdateProduct?.addEventListener('submit', (event) => {
        event.preventDefault();
        const productToBeUpdated = {
            _id: document.getElementById('input-id-product-update').value,
            title: document.getElementById('input-title-update').value,
            description: document.getElementById('input-description-update').value,
            code: document.getElementById('input-code-update').value,
            price: document.getElementById('input-price-update').value,
            stock: document.getElementById('input-stock-update').value,
            category: document.getElementById('input-category-update').value,
            thumbnails: []
        }
        const idProduct = document.getElementById('input-id-product-update').value;
        socket.emit('updateProduct', productToBeUpdated)
        document.getElementById('input-id-product-update').value = '';
        document.getElementById('input-title-update').value = '';
        document.getElementById('input-description-update').value = '';
        document.getElementById('input-code-update').value = '';
        document.getElementById('input-price-update').value = '';
        document.getElementById('input-stock-update').value = '';
        document.getElementById('input-category-update').value = '';
    });

    socket.on('listProducts', (products) => {
        const container = document.getElementById('log-products-in-real-time')
        container.innerHTML = "";
        const table = document.createElement('table');
        table.classList.add('product-table');
        const headerRow = document.createElement('tr');
        const headers = ['ID', 'Title', 'Description', 'Code', 'Price', 'Stock', 'Category'];
        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        products.forEach((prod) => {
            const row = document.createElement('tr');
            const cells = [prod._id, prod.title, prod.description, prod.code, `$${prod.price}`, prod.stock, prod.category];
            cells.forEach((cell) => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });
            table.appendChild(row);
        });
        container.appendChild(table);
    });
    const formCreateCart = document.getElementById('create-cart')
    const formAddProductToCart = document.getElementById('add-product-to-cart')
    const formRemoveCart = document.getElementById('remove-cart');
    formCreateCart?.addEventListener('submit', (event => {
        event.preventDefault();
        socket.emit('createCart')
    }))

    socket.on('listCarts', (carts) => {
        const container = document.getElementById('carts');
        container.innerHTML = "";
        carts.forEach((cart) => {
            const cartElement = document.createElement('article');
            cartElement.innerHTML = `<header><strong>ID Cart:</strong> ${cart._id}</header>
            <strong>Products:</strong>`;
            cart.products?.forEach((prod) => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `<strong>productId:</strong> ${prod?.productId?._id}
                <strong>title:</strong> ${prod?.productId?.title} <strong>price:</strong> $${prod.productId.price} <strong>stock:</strong> ${prod?.productId?.stock} <strong>category:</strong> ${prod.productId.category} 
                <strong>code:</strong> ${prod?.productId?.code} <strong>quantity:</strong> ${prod.quantity}`;
                cartElement.appendChild(productElement);
            });
            const buyButton = document.createElement('button');
            buyButton.innerText = 'Comprar';
            buyButton.addEventListener('click', () => {
                socket.emit('cartPurchase', cart._id)
                alert("Ticket generado, en el cart quedaron los productos sin stock suficente")
                console.log(`Comprar carrito ${cart._id}`);
            });
            const seeCart = document.createElement('button');
            seeCart.innerText = 'Ver Carrito';
            seeCart.addEventListener('click', () => {
                const cartId = cart._id;
                window.location.href = `http://localhost:8080/cart/${cartId}`;
            });
            cartElement.appendChild(seeCart);
            cartElement.appendChild(buyButton);
            const hr = document.createElement('hr');
            container.appendChild(cartElement);
            container.appendChild(hr);
        });
        container.appendChild(document.createElement('hr'));
    });

    formAddProductToCart?.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/cart')
            if (response.ok) {
                const data = await response.json();
                const product = {
                    cartId: data.cartId,
                    _id: document.getElementById('input-id-product-to-cart').value,
                    quantity: document.getElementById('input-quantity-product-in-cart').value
                }
                console.log('product', product)
                socket.emit('addProductToCart', product);
                document.getElementById('cart-input-id-product-to-cart').value = ""
                document.getElementById('input-id-product-to-cart').value = ""
                document.getElementById('input-quantity-product-in-cart').value = ""
            }
        } catch (error) {
            console.error("Error", error.message)
        }
        console.log(product);
    });

    formRemoveCart?.addEventListener('submit', (event => {
        event.preventDefault();
        const cartId = document.getElementById('cart-input-id-product-to-remove').value;
        socket.emit('deleteCart', cartId);
        document.getElementById('cart-input-id-product-to-remove').value = ''
    }))

    Handlebars.registerHelper('JSONstringify', function (context) {
        return JSON.stringify(context);
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
})();