// ==========================================
// КОРЗИНА
// ==========================================

let cart = JSON.parse(localStorage.getItem('prozakhyst_cart')) || [];

function saveCart() {
    localStorage.setItem('prozakhyst_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const discountMsg = document.getElementById('discount-message');
    
    if (!countEl) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
    
    if (itemsEl) {
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Кошик порожній</p>';
        } else {
            itemsEl.innerHTML = cart.map((item, index) => `
                <div class="cart-item" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                        <div style="color: #666; font-size: 13px;">${item.price} грн × ${item.quantity}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <button onclick="changeQuantity(${index}, -1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; border-radius: 4px;">-</button>
                        <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; border-radius: 4px;">+</button>
                        <button onclick="removeFromCart(${index})" style="width: 30px; height: 30px; border: none; background: #ff4444; color: white; cursor: pointer; border-radius: 4px; margin-left: 10px;">×</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (totalEl) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalEl.textContent = total;
        
        if (discountMsg) {
            if (total >= 10000) {
                const discount = Math.floor(total * 0.05);
                discountMsg.innerHTML = `<div style="color: green; margin-top: 10px;">Знижка 5%: -${discount} грн</div><div style="font-weight: bold; font-size: 18px; margin-top: 5px;">До сплати: ${total - discount} грн</div>`;
            } else if (total >= 8000) {
                discountMsg.innerHTML = `<div style="color: #666; margin-top: 10px;">До знижки 5% залишилось: ${10000 - total} грн</div>`;
            } else {
                discountMsg.innerHTML = '';
            }
        }
    }
}

function addToCart(event, product) {
    if (event) event.stopPropagation();
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
        showToast(`Додано ще одну одиницю: ${product.name}`);
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        showToast(`Додано в кошик: ${product.name}`);
    }
    
    saveCart();
    
    // Звук
    const sound = document.getElementById('hover-sound');
    if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play().catch(e => {});
    }
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
    showToast(`Видалено: ${name}`);
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

let reviews = JSON.parse(localStorage.getItem('prozakhyst_reviews')) || [];
let currentRating = 0;

function initReviews() {
    // Ініціалізація зірок
    const starContainer = document.getElementById('starRating');
    if (starContainer) {
        const stars = starContainer.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            star.style.cursor = 'pointer';
            star.style.fontSize = '24px';
            star.style.color = '#ddd';
            
            star.addEventListener('click', () => {
                currentRating = index + 1;
                const ratingInput = document.getElementById('reviewRating');
                if (ratingInput) ratingInput.value = currentRating;
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
    
    // Завантаження відгуків при відкритті модалки
    const reviewsModal = document.getElementById('reviewsModal');
    if (reviewsModal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.style.display === 'flex') {
                    loadReviews();
                }
            });
        });
        observer.observe(reviewsModal, { attributes: true, attributeFilter: ['style'] });
    }
    
    updateWidgetRating();
}

function updateStarDisplay(rating, isHover = false) {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#ffc107';
        } else {
            star.style.color = '#ddd';
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
    const starsHtml = renderStars(parseFloat(avgRating));
    
    if (widgetRating) widgetRating.textContent = avgRating;
    if (widgetCount) widgetCount.textContent = `${reviews.length} відгук${getReviewEnding(reviews.length)}`;
    if (widgetStars) widgetStars.innerHTML = starsHtml;
    
    if (modalRating) modalRating.textContent = avgRating;
    if (modalCount) modalCount.textContent = `${reviews.length} відгук${getReviewEnding(reviews.length)}`;
    if (modalStars) modalStars.innerHTML = starsHtml;
}

function getReviewEnding(n) {
    if (n % 10 === 1 && n % 100 !== 11) return '';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'и';
    return 'ів';
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(rating)) {
            html += '<span style="color: #ffc107; font-size: 20px;">★</span>';
        } else {
            html += '<span style="color: #ddd; font-size: 20px;">★</span>';
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
        if (tabs[0]) tabs[0].classList.add('active');
        loadReviews();
    } else {
        if (readTab) readTab.classList.remove('active');
        if (writeTab) writeTab.classList.add('active');
        if (tabs[1]) tabs[1].classList.add('active');
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
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
                            <strong style="color: #333;">${review.name}</strong>
                            <span style="color: #999; font-size: 13px;">${review.date}</span>
                        </div>
                        <div style="margin-bottom: 8px;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <div style="color: #800000; font-size: 13px; margin-bottom: 8px; font-weight: 500;">${getCategoryName(review.product)}</div>
                        <p style="color: #555; line-height: 1.5; margin: 0;">${review.text}</p>
                    </div>
                `).join('');
                reviewsList.style.display = 'block';
            }
        }
    }, 300);
}

function getCategoryName(cat) {
    const names = {
        'indoor': 'Внутрішні камери IMOU',
        'outdoor': 'Зовнішні камери IMOU',
        'outdoor_4G': 'Зовнішні 4G камери IMOU',
        'microSD': 'Карти пам\'яті',
        'alarm': 'Комплекти сигналізації Ajax',
        'hub': 'Хаби, модулі Ajax',
        'protect': 'Внутрішні датчики Ajax',
        'protect_outdoor': 'Зовнішні датчики Ajax',
        'waterstop': 'Захист від потопу Ajax',
        'fire': 'Захист від пожежі Ajax',
        'other': 'Інше'
    };
    return names[cat] || cat;
}

function submitReview(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('reviewName');
    const productInput = document.getElementById('reviewProduct');
    const ratingInput = document.getElementById('reviewRating');
    const textInput = document.getElementById('reviewText');
    const formMessage = document.getElementById('formMessage');
    
    const name = nameInput?.value?.trim();
    const product = productInput?.value;
    const rating = ratingInput?.value;
    const text = textInput?.value?.trim();
    
    if (!rating || rating === '0') {
        showToast('Будь ласка, поставте оцінку зірками');
        return;
    }
    
    if (!name || !product || !text) {
        showToast('Будь ласка, заповніть всі поля');
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
    localStorage.setItem('prozakhyst_reviews', JSON.stringify(reviews));
    
    // Скидаємо форму
    event.target.reset();
    currentRating = 0;
    updateStarDisplay(0);
    if (ratingInput) ratingInput.value = '';
    
    if (formMessage) {
        formMessage.innerHTML = '<div style="color: green; padding: 10px; background: #e8f5e9; border-radius: 5px; margin-bottom: 15px;">✓ Дякуємо за відгук! Він з\'явиться після модерації.</div>';
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    showToast('Відгук успішно додано!');
    updateWidgetRating();
    
    // Перемикаємо на вкладку читання
    setTimeout(() => {
        switchTab('read');
    }, 1000);
}

// ==========================================
// ЗВУКИ
// ==========================================

function initSounds() {
    const categoryCards = document.querySelectorAll('.category-card');
    const productItems = document.querySelectorAll('.product-item');
    const btns = document.querySelectorAll('.btn');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const sound = document.getElementById('hover-sound1');
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.2;
                sound.play().catch(e => {});
            }
        });
    });
    
    productItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const sound = document.getElementById('hover-sound');
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.2;
                sound.play().catch(e => {});
            }
        });
    });
    
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const sound = document.getElementById('back-sound');
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.2;
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
        
        if (cartContent && cartContent.classList.contains('active')) {
            if (!cartEl?.contains(event.target) && !cartContent.contains(event.target)) {
                cartContent.classList.remove('active');
            }
        }
    });
    
    // Escape для закриття модалок
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeReviewsModal();
            const cartContent = document.getElementById('cart-content');
            if (cartContent) cartContent.classList.remove('active');
        }
    });
});
