
document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll('.addToCart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const productId = button.value;
            const stockElement = document.querySelector(`[data-product-id="${productId}"].stockQuantity`);
            const stock = parseInt(stockElement.textContent.replace('stock: ', ''));
            const quantity = 1; // Suponiendo que solo se agrega una unidad

            if (stock - quantity <= 0) {
                const stockMessage = document.createElement('div');
                stockMessage.classList.add('stock-message');
                stockMessage.textContent = '¡No hay suficiente stock disponible!';
                button.parentNode.appendChild(stockMessage);
            }
        });
    });
});
