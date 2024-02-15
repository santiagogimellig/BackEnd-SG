(function () {
    const socket = io();
    document.getElementById('comprarBtn').addEventListener('click', function () {
        const cartId = this.value;
        alert(cartId);
        socket.emit('cartPurchase', cartId)
        alert("Ticket generado, en el cart quedaron los productos sin stock suficente para la compra")
        window.location.href = `http://localhost:8080/cart/${cartId}`;
    });
})();