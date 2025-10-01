document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer || !cartTotal) return;
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const li = document.createElement("li");
            li.classList.add("cart-item");
            li.innerHTML = `
                <img src="${item.image}" width="40" height="40" style="margin-right:10px;">
                <span>${item.name}</span>
                <span>${item.price}₴ × ${item.quantity}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">✖</button>
            `;
            cartItemsContainer.appendChild(li);
        });

        cartTotal.textContent = total;
    }

    // Функция добавления
    window.addToCart = function(product) {
        const existing = cart.find(i => i.name === product.name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({...product, quantity: 1});
        }
        saveCart();
    };

    // Функция удаления
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
    };

    // Навешиваем события на кнопки "Додати в кошик"
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const product = {
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            addToCart(product);
        });
    });

    // При загрузке страницы сразу рисуем корзину
    renderCart();
});
