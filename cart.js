let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCart();

// --- Обновление корзины ---
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const stockWarning = document.getElementById('stock-warning');

    if (!cartItems) return; // защита, если корзины нет на странице

    cartItems.innerHTML = '';
    let total = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        // Мини-изображение
        const img = document.createElement('img');
        img.src = item.image;  
        img.alt = item.name;
        img.style.width = '30px';
        img.style.marginRight = '5px';

        const info = document.createElement('span');
        info.textContent = `${item.name} - ${item.price} грн`;

        const quantityControl = document.createElement('div');
        quantityControl.classList.add('quantity-control');

        const btnMinus = document.createElement('button');
        btnMinus.classList.add('quantity-btn');
        btnMinus.textContent = '-';
        btnMinus.onclick = (e) => decreaseQuantity(item.id, e); // ✅ ищем по id

        const qty = document.createElement('span');
        qty.classList.add('quantity');
        qty.textContent = item.quantity;

        const btnPlus = document.createElement('button');
        btnPlus.classList.add('quantity-btn');
        btnPlus.textContent = '+';
        btnPlus.onclick = (e) => increaseQuantity(item.id, e); // ✅ ищем по id

        quantityControl.appendChild(btnMinus);
        quantityControl.appendChild(qty);
        quantityControl.appendChild(btnPlus);

        cartItem.appendChild(img);
        cartItem.appendChild(info);
        cartItem.appendChild(quantityControl);

        cartItems.appendChild(cartItem);
    });

    if (totalPriceElement) totalPriceElement.textContent = total.toFixed(2) + ' грн';
    if (cartCountElement) cartCountElement.textContent = totalQuantity;

    if (stockWarning) {
        stockWarning.textContent = totalQuantity > 10 
            ? "Увага! Обмежена кількість товару в наявності!" 
            : "";
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// --- Увеличение количества ---
function increaseQuantity(id, event) {
    event.stopPropagation();
    const item = cart.find(cartItem => cartItem.id === id); // ✅ теперь по id
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// --- Уменьшение количества ---
function decreaseQuantity(id, event) {
    event.stopPropagation();
    const item = cart.find(cartItem => cartItem.id === id); // ✅ теперь по id
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(cartItem => cartItem.id !== id); // ✅ теперь по id
        }
        updateCart();
    }
}

// --- Всплывающее сообщение ---
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Добавление товара в корзину ---
function addToCart(event, item) {
    if (event) event.stopPropagation();
    const existingItem = cart.find(cartItem => cartItem.id === item.id); // ✅ теперь по id
    if (existingItem) {
        existingItem.quantity++;
    } else {
        item.quantity = 1;
        if (!item.image) item.image = 'images/default.png'; // ✅ безопасно
        cart.push(item);
    }
    updateCart();
    showToast(`${item.name} додано до кошика!`);
}

// --- Очистка корзины ---
function clearCart() {
    cart = [];
    updateCart();
    showToast('Кошик очищено');
}

// --- Показ/скрытие корзины ---
function toggleCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;
    const isHidden = getComputedStyle(cartContent).display === 'none';
    cartContent.style.display = isHidden ? 'block' : 'none';
}

// --- Переход на страницу товара ---
function openProductDetails(pageUrl) {
    window.location.href = pageUrl;
}

// --- Закрытие корзины при клике вне ---
document.addEventListener('click', function(event) {
    const cartContent = document.getElementById('cart-content');
    const cartButton = document.querySelector('.cart');
    if (cartContent && cartButton && !cartContent.contains(event.target) && !cartButton.contains(event.target)) {
        cartContent.style.display = 'none';
    }
});

// ✅ Правильное место вызова updateCart — при загрузке
document.addEventListener('DOMContentLoaded', updateCart);
