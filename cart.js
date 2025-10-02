let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart();

    

    function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    cartItems.innerHTML = '';
    let total = 0;
    let totalQuantity = 0; // Переменная для подсчета общего количества товаров

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity; // Добавляем количество каждого товара к общему количеству

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 30px; height: auto; margin-right: 5px;">
            <span>${item.name} - ${item.price} грн</span>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="decreaseQuantity('${item.name}', event)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity('${item.name}', event)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalPriceElement.textContent = total;
    cartCountElement.textContent = totalQuantity; // Обновляем элемент с общим количеством товаров

    // Предупреждение, если товаров больше 10
    const stockWarning = document.getElementById('stock-warning');
    if (totalQuantity > 10) {
        stockWarning.textContent = "Увага! Обмежена кількість товару в наявності!";
    } else {
        stockWarning.textContent = "";
    }
    }
    function increaseQuantity(name, event) {
        event.stopPropagation();  // Останавливаем всплытие события, чтобы корзина не закрылась
        const item = cart.find(cartItem => cartItem.name === name);
        if (item) {
            item.quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
    function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        // Добавляем мини-изображение перед названием
        const imageElement = document.createElement('img');
        imageElement.src = `images/${item.imageName}`; // Укажите путь к мини-изображению
        imageElement.style.width = '8px'; // Настройте размер миниатюры
        imageElement.style.height = 'auto';
        imageElement.style.marginRight = '10px'; // Отступ от текста

        const itemInfo = document.createElement('span');
        itemInfo.textContent = `${item.name} - ${item.price} грн x ${item.quantity}`;

        cartItem.appendChild(imageElement);
        cartItem.appendChild(itemInfo);

        cartItemsContainer.appendChild(cartItem);
    });
    }

    function decreaseQuantity(name, event) {
        event.stopPropagation();  // Останавливаем всплытие события, чтобы корзина не закрылась
        const item = cart.find(cartItem => cartItem.name === name);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(cartItem => cartItem.name !== name);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
    // Функция для отображения всплывающего сообщения
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        // Автоматически скрываем сообщение через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    function addToCart(event, item) {
    event.stopPropagation();
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        item.quantity = 1;
        item.image = 'images/' + item.name + '.png'; // Указываем путь к изображению на основе имени товара
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showToast(`${item.name} додано до кошика!`); // Используем showToast вместо alert
}
function clearCart() {
    cart = []; // Очищаем массив корзины
    localStorage.removeItem('cart'); // Удаляем из localStorage
    updateCart(); // Обновляем отображение корзины
    showToast('Кошик очищено'); // Вызываем всплывающее сообщение с измененным текстом
}
    function toggleCart() {
        const cartContent = document.getElementById('cart-content');
        const isHidden = getComputedStyle(cartContent).display === 'none';
        cartContent.style.display = isHidden ? 'block' : 'none';
    }

    function openProductDetails(pageUrl) {
        window.location.href = pageUrl;
    }

    document.addEventListener('click', function(event) {
        const cartContent = document.getElementById('cart-content');
        const cartButton = document.querySelector('.cart');
        if (!cartContent.contains(event.target) && !cartButton.contains(event.target)) {
            cartContent.style.display = 'none';
        }
