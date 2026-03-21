// ==========================================
// КОРЗИНА - глобальна для всіх сторінок
// ==========================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const discountMsg = document.getElementById('discount-message');
    
    if (!countEl) return; // Якщо елементів немає на сторінці
    
    // Оновлюємо лічильник
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
    
    // Оновлюємо список товарів
    if (itemsEl) {
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p style="text-align: center; color: #666;">Кошик порожній</p>';
        } else {
            itemsEl.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} грн x ${item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="changeQuantity(${index}, -1)" style="padding: 5px 10px;">-</button>
                        <span style="margin: 0 10px;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="padding: 5px 10px;">+</button>
                        <button onclick="removeFromCart(${index})" style="padding: 5px 10px; margin-left: 10px; color: red;">🗑</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Оновлюємо суму
    if (totalEl) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalEl.textContent = total;
        
        // Знижка при замовленні від 10000 грн
        if (discountMsg) {
            if (total >= 10000) {
                const discount = Math.floor(total * 0.05);
                discountMsg.innerHTML = `<br><span style="color: green;">Знижка 5%: -${discount} грн</span><br><strong>До сплати: ${total - discount} грн</strong>`;
            } else {
                discountMsg.innerHTML = total >= 8000 ? `<br><span style="color: #666;">До знижки 5% залишилось: ${10000 - total} грн</span>` : '';
            }
        }
    }
}

function addToCart(event, product) {
    event.stopPropagation(); // Зупиняємо спливання для кліку на картці товару
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
        showToast(`"${product.name}" додано ще одну одиницю`);
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        showToast(`"${product.name}" додано в кошик`);
    }
    
    saveCart();
    
    // Відтворюємо звук
    const sound = document.getElementById('hover-sound');
    if (sound) sound.play().catch(e => {});
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeFromCart(index) {
    const name = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    showToast(`"${name}" видалено з кошика`);
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Очистити кошик?')) {
        cart = [];
        saveCart();
        showToast('Кошик очищено');
    }
}

function toggleCart() {
    const cartContent = document.getElementById('cart-content');
    if (cartContent) {
        cartContent.classList.toggle('active');
    }
}

// ==========================================
// СПІЛЬНІ ФУНКЦІЇ
// ==========================================

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

function openProductDetails(url) {
    window.location.href = url;
}

// ==========================================
// ВІДГУКИ
// ==========================================

let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
let currentRating = 0;

function initReviews() {
    const starContainer = document.getElementById('starRating');
    if (starContainer) {
        const stars = starContainer.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                document.getElementById('reviewRating').value = currentRating;
                updateStarDisplay(currentRating);
            });
            
            star.addEventListener('mouseenter', () => {
                updateStarDisplay(index + 1, true);
            });
        });
        
        starContainer.addEventListener('mouseleave', () => {
            updateStarDisplay(currentRating);
        });
    }
    
    updateWidgetRating();
}

function updateStarDisplay(rating, isHover = false) {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#ffc107';
        } else {
            star.style.color = isHover ? '#ddd' : '#ddd';
        }
    });
}

function updateWidgetRating() {
    const widgetRating = document.getElementById('widgetRating');
    const widgetCount = document.getElementById('widgetCount');
    const widgetStars = document.getElementById('widgetStars');
    const modalRating = document.getElementById('modalRating');
    const modalCount = document.getElementById('modalCount');
    const modalStars = document.getElementById('modalStars');
    
    if (reviews.length === 0) {
        if (widgetRating) widgetRating.textContent = '0.0';
        if (widgetCount) widgetCount.textContent = '0 відгуків';
        if (widgetStars) widgetStars.innerHTML = '★★★★★';
        if (modalRating) modalRating.textContent = '0.0';
        if (modalCount) modalCount.textContent = '0 відгуків';
        if (modalStars) modalStars.innerHTML = '★★★★★';
        return;
    }
    
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    
    if (widgetRating) widgetRating.textContent = avgRating;
    if (widgetCount) widgetCount.textContent = `${reviews.length} відгук${getReviewEnding(reviews.length)}`;
    if (widgetStars) widgetStars.innerHTML = renderStars(avgRating);
    
    if (modalRating) modalRating.textContent = avgRating;
    if (modalCount) modalCount.textContent = `${reviews.length} відгук${getReviewEnding(reviews.length)}`;
    if (modalStars) modalStars.innerHTML = renderStars(avgRating);
}

function getReviewEnding(n) {
    if (n % 10 === 1 && n % 100 !== 11) return '';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'и';
    return 'ів';
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += '<span style="color: #ffc107;">★</span>';
        } else if (i - 0.5 <= rating) {
            html += '<span style="color: #ffc107;">★</span>'; // Спрощено
        } else {
            html += '<span style="color: #ddd;">★</span>';
        }
    }
    return html;
}

function openReviewsModal() {
    const modal = document.getElementById('reviewsModal');
    if (modal) {
        modal.style.display = 'flex';
        loadReviews();
    }
}

function closeReviewsModal() {
    const modal = document.getElementById('reviewsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeModalOnOutsideClick(event) {
    if (event.target.id === 'reviewsModal') {
        closeReviewsModal();
    }
}

function switchTab(tab) {
    const readTab = document.getElementById('readTab');
    const writeTab = document.getElementById('writeTab');
    const tabs = document.querySelectorAll('.reviews-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'read') {
        if (readTab) readTab.classList.add('active');
        if (writeTab) writeTab.classList.remove('active');
        tabs[0]?.classList.add('active');
        loadReviews();
    } else {
        if (readTab) readTab.classList.remove('active');
        if (writeTab) writeTab.classList.add('active');
        tabs[1]?.classList.add('active');
    }
}

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const loading = document.getElementById('loading');
    const noReviews = document.getElementById('noReviews');
    
    if (!reviewsList) return;
    
    if (loading) loading.style.display = 'block';
    if (reviewsList) reviewsList.style.display = 'none';
    if (noReviews) noReviews.style.display = 'none';
    
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        
        if (reviews.length === 0) {
            if (noReviews) noReviews.style.display = 'block';
        } else {
            if (reviewsList) {
                reviewsList.innerHTML = reviews.map(review => `
                    <div class="review-item" style="border-bottom: 1px solid #eee; padding: 15px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <strong>${review.name}</strong>
                            <span style="color: #666; font-size: 0.9em;">${review.date}</span>
                        </div>
                        <div style="color: #ffc107; margin-bottom: 10px;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 5px;">Категорія: ${getCategoryName(review.product)}</div>
                        <p>${review.text}</p>
                    </div>
                `).join('');
                reviewsList.style.display = 'block';
            }
        }
    }, 500);
}

function getCategoryName(cat) {
    const names = {
        'indoor': 'Внутрішні камери IMOU',
        'outdoor': 'Зовнішні камери IMOU',
        'outdoor_4G': 'Зовнішні 4G камери IMOU',
        'alarm': 'Комплекти сигналізації Ajax',
        'hub': 'Хаби, модулі Ajax',
        'protect': 'Внутрішня охорона Ajax',
        'protect_outdoor': 'Зовнішня охорона Ajax',
        'waterstop': 'Захист від потопу Ajax',
        'fire': 'Захист від пожежі Ajax',
        'other': 'Інше'
    };
    return names[cat] || cat;
}

function submitReview(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewName')?.value;
    const product = document.getElementById('reviewProduct')?.value;
    const rating = document.getElementById('reviewRating')?.value;
    const text = document.getElementById('reviewText')?.value;
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!rating) {
        showToast('Будь ласка, поставте оцінку');
        return;
    }
    
    const review = {
        name,
        product,
        rating: parseInt(rating),
        text,
        date: new Date().toLocaleDateString('uk-UA')
    };
    
    reviews.unshift(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Скидаємо форму
    event.target.reset();
    currentRating = 0;
    updateStarDisplay(0);
    
    if (formMessage) {
        formMessage.textContent = 'Дякуємо за відгук!';
        formMessage.style.display = 'block';
        formMessage.style.color = 'green';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 3000);
    }
    
    showToast('Відгук додано!');
    updateWidgetRating();
}

// ==========================================
// ЗВУКИ
// ==========================================

function initSounds() {
    const categoryCards = document.querySelectorAll('.category-card');
    const productItems = document.querySelectorAll('.product-item');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const sound = document.getElementById('hover-sound1');
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => {});
            }
        });
    });
    
    productItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const sound = document.getElementById('hover-sound');
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.3;
                sound.play().catch(e => {});
            }
        });
    });
}

// ==========================================
// ІНІЦІАЛІЗАЦІЯ
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    initReviews();
    initSounds();
    
    // Закриття корзини при кліку поза нею
    document.addEventListener('click', function(event) {
        const cartEl = document.querySelector('.cart');
        const cartContent = document.getElementById('cart-content');
        
        if (cartContent && !cartEl?.contains(event.target) && !cartContent.contains(event.target)) {
            cartContent.classList.remove('active');
        }
    });
});
