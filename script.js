// ========================================
// ПРОЗАХИСТ - JavaScript
// ========================================

// Кошик
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    initStarRating();
});

// ========================================
// ФУНКЦІЇ КОШИКА
// ========================================

function addToCart(event, product) {
    event.stopPropagation();
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} додано у кошик!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    const cartContent = document.getElementById('cart-content');
    cartContent.classList.toggle('active');
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    // Оновлення кількості
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Оновлення списку товарів
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="color: #aaa; text-align: center;">Кошик порожній</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} грн x ${item.quantity || 1}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity('${item.id}', -1)" aria-label="Зменшити">-</button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" aria-label="Збільшити">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Видалити">×</button>
                </div>
            `).join('');
        }
    }
    
    // Оновлення загальної суми
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    if (totalPrice) totalPrice.textContent = total.toFixed(2);
}

// ========================================
// TOAST ПОВІДОМЛЕННЯ
// ========================================

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========================================
// ВІДГУКИ
// ========================================

function openReviewsModal() {
    const modal = document.getElementById('reviewsModal');
    if (modal) modal.classList.add('active');
}

function closeReviewsModal() {
    const modal = document.getElementById('reviewsModal');
    if (modal) modal.classList.remove('active');
}

function closeModalOnOutsideClick(event) {
    if (event.target === event.currentTarget) {
        closeReviewsModal();
    }
}

function switchTab(tab) {
    const tabs = document.querySelectorAll('.reviews-tab');
    const contents = document.querySelectorAll('.reviews-tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    if (tab === 'read') {
        tabs[0].classList.add('active');
        document.getElementById('readTab').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('writeTab').classList.add('active');
    }
}

function initStarRating() {
    const stars = document.querySelectorAll('.star-input');
    const ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            if (ratingInput) ratingInput.value = rating;
            
            stars.forEach(s => {
                s.classList.toggle('active', s.dataset.rating <= rating);
            });
        });
    });
}

function submitReview(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewName').value;
    const product = document.getElementById('reviewProduct').value;
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value;
    
    if (!rating) {
        showToast('Будь ласка, оберіть оцінку!');
        return;
    }
    
    // Тут можна додати відправку на сервер
    console.log('Відгук:', { name, product, rating, text });
    
    showToast('Дякуємо за ваш відгук!');
    event.target.reset();
    
    // Скидання зірок
    document.querySelectorAll('.star-input').forEach(s => s.classList.remove('active'));
    document.getElementById('reviewRating').value = '';
}

// ========================================
// НАВІГАЦІЯ
// ========================================

function openProductDetails(url) {
    window.location.href = url;
}

// ========================================
// ЗВУКИ (опціонально)
// ========================================

function playHoverSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
}

// Додавання звуків при наведенні на категорії
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => playHoverSound('hover-sound'));
});
