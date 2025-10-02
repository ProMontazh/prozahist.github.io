let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCart();

// --- Обновление корзины ---
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const stockWarning = document.getElementById('stock-warning');

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
        img.style.height = 'auto';
        img.style.marginRight = '5px';

        // Информация о товаре
        const info = document.createElement('span');
        info.textContent = `${item.name} - ${item.price} грн`;

        // Управление количеством
        const quantityControl = document.createElement('div');
        quantityControl.classList.add('quantity-control');

        const btnMinus = document.createElement('button');
        btnMinus.classList.add('quantity-btn');
        btnMinus.textContent = '-';
        btnMinus.onclick = (e) => decreaseQuantity(item.name, e);

        const qty = document.createElement('span');
        qty.classList.add('quantity');
        qty.textContent = item.quantity;

        const btnPlus = document.createElement('button');
        btnPlus.classList.add('quantity-btn');
        btnPlus.textContent = '+';
        btnPlus.onclick = (e) => increaseQuantity(item.name, e);

        quantityControl.appendChild(btnMinus);
        quantityControl.appendChild(qty);
        quantityControl.appendChild(btnPlus);

        cartItem.appendChild(img);
        cartItem.appendChild(info);
        cartItem.appendChild(quantityControl);

        cartItems.appendChild(cartItem);
    });

    totalPriceElement.textContent = total.toFixed(2) + ' грн';
    cartCountElement.textContent = totalQuantity;

    if (totalQuantity > 10) {
        stockWarning.textContent = "Увага! Обмежена кількість товару в наявності!";
    } else {
        stockWarning.textContent = "";
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// --- Увеличение количества ---
function increaseQuantity(name, event) {
    event.stopPropagation();
    const item = cart.find(cartItem => cartItem.name === name);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// --- Уменьшение количества ---
function decreaseQuantity(name, event) {
    event.stopPropagation();
    const item = cart.find(cartItem => cartItem.name === name);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(cartItem => cartItem.name !== name);
        }
        updateCart();
    }
}

// --- Всплывающее сообщение ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Добавление товара в корзину ---
function addToCart(event, item) {
    event.stopPropagation();
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        item.quantity = 1;
        if (!item.image) item.image = 'images/' + item.name + '.png';
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
    updateCart(); // сразу обновляем корзину при загрузке
});
