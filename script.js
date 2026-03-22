/* ======================================================
   🧩 КАРТА КАТЕГОРИЙ
   ====================================================== */
const CATEGORY_MAP = {
    indoor: {
        label: 'Внутрішні камери IMOU',
        icon: 'reviews_png/cam_indoor.png'
    },
    outdoor: {
        label: 'Зовнішні камери IMOU',
        icon: 'reviews_png/cam_outdoor.png'
    },
    outdoor_4G: {
        label: 'Зовнішні 4G камери IMOU',
        icon: 'reviews_png/cam_outdoor_4G.png'
    },
    alarm: {
        label: 'Комплекти сигналізації Ajax',
        icon: 'reviews_png/starterkit.png'
    },
    hub: {
        label: 'Хаби, модулі Ajax',
        icon: 'reviews_png/hub.png'
    },
    protect: {
        label: 'Внутрішня охорона Ajax',
        icon: 'reviews_png/motionprotect.png'
    },
    protect_outdoor: {
        label: 'Зовнішня охорона Ajax',
        icon: 'reviews_png/motioncam_outdoor.png'
    },
    waterstop: {
        label: 'Захист від потопу Ajax',
        icon: 'reviews_png/waterstop.png'
    },
    fire: {
        label: 'Захист від пожежі Ajax',
        icon: 'reviews_png/manualcallpoint.png'
    },
    other: {
        label: 'Інше',
        icon: 'favicon.svg'
    }
};

(() => {
    // === 🛒 КОШИК ===
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        const cartCountElement = document.getElementById('cart-count');
        const stockWarning = document.getElementById('stock-warning');

        if (!cartItems || !totalPriceElement || !cartCountElement || !stockWarning) return;

        cartItems.innerHTML = '';
        let total = 0;
        let totalQuantity = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            totalQuantity += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width:30px;height:auto;margin-right:5px;">
                <span>${item.name} - ${item.price} грн</span>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.id}', event)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.id}', event)">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        totalPriceElement.textContent = total.toFixed(2);
        cartCountElement.textContent = totalQuantity;
        stockWarning.textContent = totalQuantity > 10 
            ? "Увага! Обмежена кількість товару. Наявність уточнюйте" 
            : "";

        // 💰 Перевірка на знижку
        const discountMessage = document.getElementById('discount-message');
        if (discountMessage) {
            if (total >= 1000) {
                discountMessage.textContent = "Доступна знижка!";
                discountMessage.style.display = "inline";
            } else {
                discountMessage.textContent = "";
                discountMessage.style.display = "none";
            }
        }
    }

    window.increaseQuantity = function(id, event) {
        if (event) event.stopPropagation();
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    };

    window.decreaseQuantity = function(id, event) {
        if (event) event.stopPropagation();
        const item = cart.find(i => i.id === id);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    };

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    window.addToCart = function(event, item) {
        if (event && event.stopPropagation) event.stopPropagation();
        const existingItem = cart.find(ci => ci.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            item.quantity = 1;
            cart.push(item);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        showToast(`${item.name} додано до кошика!`);
    };

    window.addToCartFromProductPage = function(event, item) {
        if (event) event.stopPropagation();
        const existingItem = cart.find(ci => ci.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            item.quantity = 1;
            cart.push(item);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        showToast(`${item.name} додано до кошика!`);
    };

    window.clearCart = function() {
        cart = [];
        localStorage.removeItem('cart');
        updateCart();
        showToast('Кошик очищено');
    };

    window.toggleCart = function() {
        const cartContent = document.getElementById('cart-content');
        if (!cartContent) return;
        const isHidden = getComputedStyle(cartContent).display === 'none';
        cartContent.style.display = isHidden ? 'block' : 'none';
    };

    // Закриття кошика при кліку поза ним
    document.addEventListener('click', (ev) => {
        const cartContent = document.getElementById('cart-content');
        const cartButton = document.querySelector('.cart');
        if (!cartContent || !cartButton) return;

        if (!cartContent.contains(ev.target) && !cartButton.contains(ev.target)) {
            cartContent.style.display = 'none';
        }
    });

    // === 📂 КАТЕГОРІЇ ===
    let currentCategory = null;

    window.toggleCategory = function(catId, push = true) {
        // Ховаємо всі категорії товарів
        document.querySelectorAll('.products').forEach(s => s.style.display = 'none');

        const target = document.getElementById(catId);
        if (!target) return;

        // Показуємо обрану категорію
        target.style.display = 'block';
        target.classList.add('fade-in');
        currentCategory = catId;

        // Ховаємо головну сторінку з категоріями
        const categories = document.getElementById('categories');
        const mainBanner = document.getElementById('main-banner');
        if (categories) categories.style.display = 'none';
        if (mainBanner) mainBanner.style.display = 'none';

        // SEO: Оновлюємо title при перемиканні категорії
        const categoryNames = {
            'indoor': 'Внутрішні камери IMOU',
            'outdoor': 'Зовнішні камери IMOU',
            'outdoor_4G': '4G камери IMOU',
            'microSD': 'Карти пам\'яті microSD',
            'alarm': 'Комплекти сигналізації Ajax',
            'hub': 'Хаби та модулі Ajax',
            'protect': 'Внутрішні датчики Ajax',
            'protect_outdoor': 'Зовнішні датчики Ajax',
            'waterstop': 'Захист від потопу Ajax',
            'fire': 'Захист від пожежі Ajax'
        };
        
        if (categoryNames[catId]) {
            document.title = `${categoryNames[catId]} — купити в Харкові | ПРОЗАХИСТ`;
        }

        // Оновлюємо історію браузера та прокручуємо вгору
        if (push) {
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            history.pushState({ category: catId }, '', '#' + catId);
        }
    };

    // Витягування ID продукту з URL
    function extractProductIdFromUrl(url) {
        if (!url) return '';

        // Витягуємо ID з дужок, наприклад: details_indoor_2(IPC-C32EP).html
        const match = url.match(/\(([^)]+)\)/);
        if (match && match[1]) return match[1];

        // Альтернативний спосіб - беремо ім'я файлу без розширення
        const filename = url.split('/').pop().split('?')[0].split('#')[0];
        return filename.replace(/\.[^.]+$/, '') || filename;
    }

    window.openProductDetails = function(pageUrl) {
        const prodId = extractProductIdFromUrl(pageUrl);

        // Зберігаємо поточну категорію та позицію прокрутки
        if (currentCategory) {
            localStorage.setItem('lastCategory', currentCategory);
        }
        if (prodId) {
            localStorage.setItem('lastProductId', prodId);
        }
        localStorage.setItem('lastScroll', String(window.scrollY || 0));

        // Ховаємо банер на мобільних пристроях
        const mainBanner = document.getElementById('main-banner');
        if (window.innerWidth <= 768 && mainBanner) {
            mainBanner.style.display = 'none';
        }

        window.location.href = pageUrl;
    };

    // Обробка стану (історії браузера)
    function handleState(state) {
        const categories = document.getElementById('categories');
        const mainBanner = document.getElementById('main-banner');

        // Ховаємо всі категорії товарів
        document.querySelectorAll('.products').forEach(s => s.style.display = 'none');

        const catId = state ? state.category : null;

        if (catId && document.getElementById(catId)) {
            // Показуємо обрану категорію
            const target = document.getElementById(catId);
            target.style.display = 'block';
            target.classList.add('fade-in');
            currentCategory = catId;

            if (categories) categories.style.display = 'none';
            if (mainBanner) mainBanner.style.display = 'none';
        } else {
            // Показуємо головну сторінку
            currentCategory = null;
            if (categories) categories.style.display = 'flex';
            if (mainBanner) mainBanner.style.display = 'block';
            
            // SEO: Повертаємо головний title
            document.title = "ПРОЗАХИСТ | Системи безпеки Ajax та камери IMOU — Харків, Україна";
        }

        // Оновлюємо кошик
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCart();
    }

    // === 🎵 ЗВУК "НАЗАД" ===
    const backSound = document.getElementById('back-sound');
    if (backSound) {
        backSound.volume = 0.35;
    }

    // ✅ ОНОВЛЕНИЙ popstate ОБРОБНИК З ПІДТРИМКОЮ АПАРАТНОЇ КНОПКИ "НАЗАД"
    window.addEventListener('popstate', (e) => {
        // ✅ СПОЧАТКУ ПЕРЕВІРЯЄМО МОДАЛКУ ВІДГУКІВ
        const modal = document.getElementById('reviewsModal');
        if (modal && modal.classList.contains('active')) {
            if (!e.state || !e.state.reviewsModal) {
                // Закриваємо модалку при натисканні апаратної кнопки "Назад"
                modal.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                return; // Виходимо, не обробляємо категорії
            }
        }
        
        // Обробляємо категорії
        handleState(e.state);
        if (backSound) {
            backSound.currentTime = 0;
            backSound.play().catch(() => {});
        }
    });

    window.addEventListener('pageshow', () => {
        handleState(history.state);
    });

    // Ініціалізація кошика при завантаженні сторінки
    updateCart();

    // === 🎵 Звук при наведенні на картки категорій ===
    const hoverSound = document.getElementById('hover-sound');
    if (hoverSound) {
        hoverSound.volume = 0.4;

        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            });
        });
    }

    // === 📱 Свайпи між категоріями ===
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;

        // Перевіряємо, чи показується зараз будь-яка категорія товарів
        const activeProducts = [...document.querySelectorAll('.products')]
            .find(p => getComputedStyle(p).display === 'block');

        // Якщо на головній сторінці (немає активної категорії) — свайпи ігноруємо
        if (!activeProducts) return;

        // Отримуємо всі категорії
        const products = Array.from(document.querySelectorAll('.products'));
        const currentIndex = products.indexOf(activeProducts);

        const diff = touchEndX - touchStartX;

        // Мінімальна відстань для спрацювання свайпу
        if (Math.abs(diff) < 50) return;

        // Свайп вліво (наступна категорія)
        if (diff < 0 && currentIndex < products.length - 1) {
            products.forEach(p => p.style.display = 'none');
            products[currentIndex + 1].style.display = 'block';
            products[currentIndex + 1].classList.add('fade-in');

            // Оновлюємо currentCategory та історію
            const nextCatId = products[currentIndex + 1].id;
            currentCategory = nextCatId;
            history.pushState({ category: nextCatId }, '', '#' + nextCatId);
        }

        // Свайп вправо (попередня категорія)
        if (diff > 0 && currentIndex > 0) {
            products.forEach(p => p.style.display = 'none');
            products[currentIndex - 1].style.display = 'block';
            products[currentIndex - 1].classList.add('fade-in');

            // Оновлюємо currentCategory та історію
            const prevCatId = products[currentIndex - 1].id;
            currentCategory = prevCatId;
            history.pushState({ category: prevCatId }, '', '#' + prevCatId);
        }
    });
})();

// ⚠️ ВСТАВТЕ ВАШ GOOGLE SCRIPT URL ТУТ ⚠️
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhSB-fcDDeBBhRWBBO1h7ocuHFnOlVqqWUv9rsKXBVED_MHxkEbXHoeeH__q090sU1uw/exec ';

let selectedRating = 0;
let allReviews = [];

// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    initStarRating();
    loadReviewsForWidget();
});

// Завантаження для віджету
async function loadReviewsForWidget() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        if (data.success && data.reviews) {
            allReviews = data.reviews;
            updateWidget(data.reviews);
        } else {
            updateWidget([]);
        }
    } catch (error) {
        updateWidget([]);
    }
}

// Оновлення віджету
function updateWidget(reviews) {
    const count = reviews.length;
    const avgRating = count > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / count 
        : 0;

    // Оновити число
    document.getElementById('widgetRating').textContent = avgRating.toFixed(1);

    // Оновити кількість
    const countText = count === 0 ? 'Немає відгуків' :
                     count === 1 ? '1 відгук' :
                     count < 5 ? `${count} відгуки` :
                     `${count} відгуків`;
    document.getElementById('widgetCount').textContent = countText;

    // Оновити зірки
    renderWidgetStars(avgRating);
}

// Відображення зірок віджету з частковим заповненням
function renderWidgetStars(rating) {
    const container = document.getElementById('widgetStars');
    container.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'widget-star';
        star.innerHTML = '★';

        // Якщо рейтинг більше поточної зірки
        if (rating >= i) {
            // Повністю заповнена зірка
            const filled = document.createElement('span');
            filled.className = 'widget-star-filled';
            filled.style.width = '100%';
            filled.innerHTML = '★';
            star.appendChild(filled);
        } else if (rating > i - 1) {
            // Частково заповнена зірка
            const filled = document.createElement('span');
            filled.className = 'widget-star-filled';
            const percentage = ((rating - (i - 1)) * 100).toFixed(0);
            filled.style.width = percentage + '%';
            filled.innerHTML = '★';
            star.appendChild(filled);
        }

        container.appendChild(star);
    }
}

// ✅ ОНОВЛЕНА ФУНКЦІЯ: Відкрити модальне вікно з підтримкою апаратної кнопки "Назад"
function openReviewsModal() {
    document.getElementById('reviewsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ✅ ДОДАЄМО ЗАПИС В ІСТОРІЮ ДЛЯ АПАРАТНОЇ КНОПКИ "НАЗАД"
    history.pushState({ reviewsModal: true }, '', '#reviews');
    
    loadReviews();
}

// ✅ ОНОВЛЕНА ФУНКЦІЯ: Закрити модальне вікно з підтримкою апаратної кнопки "Назад"
function closeReviewsModal() {
    document.getElementById('reviewsModal').classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // ✅ ВИДАЛЯЄМО ЗАПИС З ІСТОРІЇ
    if (window.location.hash === '#reviews') {
        history.back();
    }
}

function closeModalOnOutsideClick(event) {
    if (event.target.id === 'reviewsModal') {
        closeReviewsModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeReviewsModal();
    }
});

// Перемикання вкладок
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

// Ініціалізація рейтингу форми
function initStarRating() {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('reviewRating').value = selectedRating;
            updateStars(selectedRating);
        });
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

// Показати повідомлення
function showFormMessage(text, type) {
    const msg = document.getElementById('formMessage');
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 5000);
}

// Відправка відгуку
async function submitReview(event) {
    event.preventDefault();

    if (selectedRating === 0) {
        showFormMessage('Будь ласка, оберіть оцінку!', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Відправка...';

    const review = {
        name: document.getElementById('reviewName').value.trim(),
        product: document.getElementById('reviewProduct').value,
        rating: selectedRating,
        text: document.getElementById('reviewText').value.trim(),
        date: new Date().toLocaleDateString('uk-UA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });

        showFormMessage('✓ Дякуємо! Ваш відгук успішно додано!', 'success');

        document.getElementById('reviewName').value = '';
        document.getElementById('reviewProduct').value = '';
        document.getElementById('reviewText').value = '';
        selectedRating = 0;
        updateStars(0);

        setTimeout(() => {
            switchTab('read');
            loadReviews();
            loadReviewsForWidget();
        }, 2000);

    } catch (error) {
        showFormMessage('Помилка відправки. Спробуйте ще раз.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Відправити відгук';
    }
}

// Завантаження відгуків у модальне вікно
async function loadReviews() {
    const loading = document.getElementById('loading');
    const list = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');

    loading.style.display = 'block';
    list.style.display = 'none';
    noReviews.style.display = 'none';

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        loading.style.display = 'none';

        if (data.success && data.reviews && data.reviews.length > 0) {
            updateModalStats(data.reviews);
            displayReviews(data.reviews);
        } else {
            updateModalStats([]);
            noReviews.style.display = 'block';
        }
    } catch (error) {
        loading.style.display = 'none';
        noReviews.style.display = 'block';
    }
}

// Оновлення статистики модального вікна
function updateModalStats(reviews) {
    const count = reviews.length;
    const avgRating = count > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / count 
        : 0;

    document.getElementById('modalRating').textContent = avgRating.toFixed(1);

    const countText = count === 0 ? 'Немає відгуків' :
                     count === 1 ? '1 відгук' :
                     count < 5 ? `${count} відгуки` :
                     `${count} відгуків`;
    document.getElementById('modalCount').textContent = countText;

    // Зірки в модальному вікні
    const modalStars = document.getElementById('modalStars');
    modalStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = i <= Math.round(avgRating) ? 'modal-star' : 'modal-star empty';
        star.textContent = '★';
        modalStars.appendChild(star);
    }
}

// Відображення списку відгуків
function displayReviews(reviews) {
    const list = document.getElementById('reviewsList');
    list.style.display = 'grid';
    list.innerHTML = '';

    reviews.forEach(review => {
        if (!review.name || !review.text) return;

        const initials = review.name.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const stars = Array(5).fill(0)
            .map((_, i) => `<span class="star ${i >= review.rating ? 'empty' : ''}">★</span>`)
            .join('');

        const cat = CATEGORY_MAP[review.product] || CATEGORY_MAP.other;

        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">${initials}</div>
                <div class="review-info">
                    <div class="review-name">${escapeHtml(review.name)}</div>
                    <div class="review-date">${escapeHtml(review.date)}</div>
                </div>
            </div>
            <div class="review-stars">${stars}</div>
            <div class="review-text">${escapeHtml(review.text)}</div>
            <div class="review-product" onclick="goToCategoryFromReview('${review.product}')">
                <img src="${cat.icon}" alt="${cat.label}">
                ${cat.label}
            </div>
        `;

        list.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function goToCategoryFromReview(categoryId) {
    // 1️⃣ Закрываем модалку
    const modal = document.querySelector('.reviews-modal');
    if (modal) {
        modal.classList.remove('active');
    }

    // 2️⃣ Возвращаем скролл страницы
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // 3️⃣ Переключаем категорию
    if (typeof toggleCategory === 'function') {
        toggleCategory(categoryId);
    }

    // 4️⃣ Скроллимся к товарам (с задержкой)
    setTimeout(() => {
        const productsBlock = document.getElementById('products');
        if (productsBlock) {
            productsBlock.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 300);
}
