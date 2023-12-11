const socket = io();
const container = document.getElementById('product-list');


socket.on('updateProducts', data => {
    console.log('entre al update')
    container.innerHTML = ``

    data.forEach(prod => {
        container.innerHTML += `
        <div class="col">
        <div class="card" style="width: 18rem;">
            <h5 class="card-header">${prod.title}</h5>
            <img src="${prod.thumbnails[0]}" class="card-img-top" alt="${prod.title}" />
            <div class="card-body">
                <p class="card-text">${prod.description}</p>
                <p class="card-text">${prod.code}</p>
            </div>
        </div>
        </div>
        `
    })
})