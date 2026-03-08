/**
 * ПРОЗАХИСТ - Оптимизированный JavaScript
 * SEO-friendly, доступный, производительный
 */

'use strict';

// ======================================================
// 🗺️ КАРТА КАТЕГОРИЙ
// ======================================================

const CATEGORY_MAP = {
    indoor: {
        label: 'Внутрішні камери IMOU',
        icon: 'reviews_png/cam_indoor.png',
        description: 'Wi-Fi камери для дома та офісу'
    },
    outdoor: {
        label: 'Зовнішні камери IMOU',
        icon: 'reviews_png/cam_outdoor.png',
        description: 'Вуличные камеры видеонаблюдения'
    },
    outdoor_4G: {
        label: 'Зовнішні 4G камери IMOU',
        icon: 'reviews_png/cam_outdoor_4G.png',
        description: 'Автономные 4G камеры'
    },
    microSD: {
        label: 'Карти пам\'яті',
        icon: 'reviews_png/microsd.png',
        description: 'MicroSD карты для видеорегистраторов'
    },
    alarm: {
        label: 'Комплекти сигналізації Ajax',
        icon: 'reviews_png/starterkit.png',
        description: 'Готовые комплекты охранной сигнализации'
    },
    hub: {
        label: 'Хаби, модулі Ajax',
        icon: 'reviews_png/hub.png',
        description: 'Центральные устройства и модули'
    },
    protect: {
        label: 'Внутрішня охорона Ajax',
        icon: 'reviews_png/motionprotect.png',
        description: 'Датчики для внутренней охраны'
    },
    protect_outdoor: {
        label: 'Зовнішня охорона Ajax',
        icon: 'reviews_png/motioncam_outdoor.png',
        description: 'Уличные датчики безопасности'
    },
    waterstop: {
        label: 'Захист від потопу Ajax',
        icon: 'reviews_png/waterstop.png',
        description: 'Системы защиты от протечек'
    },
    fire: {
        label: 'Захист від пожежі Ajax',
        icon: 'reviews_png/manualcallpoint.png',
        description: 'Пожарные датчики и системы'
    },
    other: {
        label: 'Інше',
        icon: 'favicon.svg',
        description: 'Дополнительные товары'
    }
};

// ======================================================
// 🛒 УПРАВЛЕНИЕ КОРЗИНОЙ
// ======================================================

const CartManager = {
    cart: [],
    
    init() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateUI();
        this.bindEvents();
    },

    bindEvents() {
        // Закрытие корзины при клике вне
        document.addEventListener('click', (e) => {
            const cartContent = document.getElementById('cart-content');
            const cartButton = document.querySelector('.cart');
            if (cartContent && cartButton && 
                !cartContent.contains(e.target) && 
                !cartButton.contains(e.target)) {
                cartContent.style.display = 'none';
                cartButton.setAttribute('aria-expanded', 'false');
            }
        });
    },

    updateUI() {
        const cartItems = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        const cartCountElement = document.getElementById('cart-count');
        const stockWarning = document.getElementById('stock-warning');

        if (!cartItems || !totalPriceElement || !cartCountElement) return;

        cartItems.innerHTML = '';
        let total = 0;
        let totalQuantity = 0;

        this.cart.forEach(item => {
            total += item.price * item.quantity;
            totalQuantity += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;object-fit:contain;border-radius:4px;">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                    <div style="color:#666;font-size:12px;">${item.price} грн</div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="CartManager.decreaseQuantity('${item.id}', event)" aria-label="Зменшити кількість">−</button>
                    <span class="quantity" aria-live="polite">${item.quantity}</span>
                    <button class="quantity-btn" onclick="CartManager.increaseQuantity('${item.id}', event)" aria-label="Збільшити кількість">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        totalPriceElement.textContent = total.toFixed(2);
        cartCountElement.textContent = totalQuantity;
        
        if (stockWarning) {
            stockWarning.textContent = totalQuantity > 10 
                ? "Увага! Обмежена кількість товару. Наявність уточнюйте" 
                : "";
        }

        // Проверка скидки
        const discountMessage = document.getElementById('discount-message');
        if (discountMessage) {
            if (total >= 1000) {
                discountMessage.textContent = "🎉 Доступна знижка!";
                discountMessage.style.display = "inline";
            } else {
                discountMessage.style.display = "none";
            }
        }

        // Обновление aria-label для корзины
        const cartButton = document.querySelector('.cart');
        if (cartButton) {
            cartButton.setAttribute('aria-label', `Кошик: ${totalQuantity} товарів на суму ${total.toFixed(2)} грн`);
        }
    },

    increaseQuantity(id, event) {
        if (event) event.stopPropagation();
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity++;
            this.save();
            this.updateUI();
        }
    },

    decreaseQuantity(id, event) {
        if (event) event.stopPropagation();
        const item = this.cart.find(i => i.id === id);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.cart = this.cart.filter(i => i.id !== id);
            }
            this.save();
            this.updateUI();
        }
    },

    addItem(item, event) {
        if (event) event.stopPropagation();
        
        const existingItem = this.cart.find(ci => ci.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            item.quantity = 1;
            this.cart.push(item);
        }
        
        this.save();
        this.updateUI();
        Toast.show(`${item.name} додано до кошика!`);
        
        // Аналитика
        this.trackEvent('add_to_cart', item);
    },

    clear() {
        this.cart = [];
        this.save();
        this.updateUI();
        Toast.show('Кошик очищено');
    },

    save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    toggle() {
        const cartContent = document.getElementById('cart-content');
        const cartButton = document.querySelector('.cart');
        if (!cartContent) return;
        
        const isHidden = getComputedStyle(cartContent).display === 'none';
        cartContent.style.display = isHidden ? 'block' : 'none';
        cartButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        
        if (isHidden) {
            cartContent.focus();
        }
    },

    trackEvent(eventName, item) {
        // Здесь можно добавить Google Analytics, Facebook Pixel и т.д.
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                items: [{
                    id: item.id,
                    name: item.name,
                    price: item.price
                }]
            });
        }
    }
};

// ======================================================
// 🔔 TOAST УВЕДОМЛЕНИЯ
// ======================================================

const Toast = {
    show(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.add('show');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
};

// ======================================================
// 📂 УПРАВЛЕНИЕ КАТЕГОРИЯМИ
// ======================================================

const CategoryManager = {
    currentCategory: null,

    init() {
        this.bindEvents();
        this.checkInitialState();
    },

    bindEvents() {
        // Обработка истории браузера
        window.addEventListener('popstate', (e) => {
            this.handleState(e.state);
            this.playSound('back-sound');
        });

        window.addEventListener('pageshow', () => {
            this.handleState(history.state);
        });

        // Свайпы для мобильных
        this.initSwipe();
    },

    checkInitialState() {
        // Проверяем хеш в URL
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            this.showCategory(hash, false);
        }
    },

    showCategory(catId, pushState = true) {
        // Скрываем все категории
        document.querySelectorAll('.products').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        const target = document.getElementById(catId);
        if (!target) return;

        // Показываем выбранную категорию
        target.style.display = 'block';
        target.classList.add('active', 'fade-in');
        this.currentCategory = catId;

        // Обновляем SEO мета-теги
        this.updateSEOMeta(catId);

        // Скрываем главную страницу
        const categories = document.getElementById('categories');
        const mainBanner = document.getElementById('main-banner');
        if (categories) categories.style.display = 'none';
        if (mainBanner) mainBanner.style.display = 'none';

        // Обновляем хлебные крошки
        this.updateBreadcrumbs(catId);

        // Обновляем историю
        if (pushState) {
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            history.pushState({ category: catId }, '', `#${catId}`);
        }

        // Аналитика
        this.trackEvent('view_category', { category: catId });
    },

    updateSEOMeta(catId) {
        const category = CATEGORY_MAP[catId];
        if (!category) return;

        // Обновляем title
        document.title = `${category.label} — купити в Харкові | ПРОЗАХИСТ`;
        
        // Обновляем description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = `${category.label} — ${category.description}. Купити в Харкові з доставкою по Україні. Гарантія, монтаж, консультації. Тел: +380935016040`;
        }

        // Обновляем canonical
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = `https://прозахист.pp.ua/#${catId}`;
        }
    },

    updateBreadcrumbs(catId) {
        const category = CATEGORY_MAP[catId];
        if (!category) return;

        const breadcrumbs = document.querySelector('.breadcrumbs ol');
        if (!breadcrumbs) return;

        breadcrumbs.innerHTML = `
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a itemprop="item" href="/"><span itemprop="name">Головна</span></a>
                <meta itemprop="position" content="1">
            </li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <span itemprop="name" aria-current="page">${category.label}</span>
                <meta itemprop="position" content="2">
            </li>
        `;
    },

    handleState(state) {
        const categories = document.getElementById('categories');
        const mainBanner = document.getElementById('main-banner');

        document.querySelectorAll('.products').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        const catId = state ? state.category : null;

        if (catId && document.getElementById(catId)) {
            const target = document.getElementById(catId);
            target.style.display = 'block';
            target.classList.add('active', 'fade-in');
            this.currentCategory = catId;
            this.updateBreadcrumbs(catId);
            
            if (categories) categories.style.display = 'none';
            if (mainBanner) mainBanner.style.display = 'none';
        } else {
            this.currentCategory = null;
            if (categories) categories.style.display = 'flex';
            if (mainBanner) mainBanner.style.display = 'block';
            
            // Восстанавливаем главный title
            document.title = "ПРОЗАХИСТ | Системи безпеки Ajax та камери IMOU — Харків, Україна";
            
            const breadcrumbs = document.querySelector('.breadcrumbs ol');
            if (breadcrumbs) {
                breadcrumbs.innerHTML = `
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <span itemprop="name" aria-current="page">Головна</span>
                        <meta itemprop="position" content="1">
                    </li>
                `;
            }
        }

        CartManager.init();
    },

    initSwipe() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            
            const activeProducts = [...document.querySelectorAll('.products')]
                .find(p => getComputedStyle(p).display === 'block');
            
            if (!activeProducts) return;

            const products = Array.from(document.querySelectorAll('.products'));
            const currentIndex = products.indexOf(activeProducts);
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) < 50) return;

            if (diff < 0 && currentIndex < products.length - 1) {
                this.showCategory(products[currentIndex + 1].id);
            } else if (diff > 0 && currentIndex > 0) {
                this.showCategory(products[currentIndex - 1].id);
            }
        }, { passive: true });
    },

    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    },

    trackEvent(eventName, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }
};

// ======================================================
// 🔗 НАВИГАЦИЯ ПО ТОВАРАМ
// ======================================================

const ProductNavigator = {
    extractProductId(url) {
        if (!url) return '';
        const match = url.match(/\(([^)]+)\)/);
        if (match && match[1]) return match[1];
        
        const filename = url.split('/').pop().split('?')[0].split('#')[0];
        return filename.replace(/\.[^.]+$/, '') || filename;
    },

    openDetails(pageUrl) {
        const prodId = this.extractProductId(pageUrl);

        if (CategoryManager.currentCategory) {
            localStorage.setItem('lastCategory', CategoryManager.currentCategory);
        }
        if (prodId) {
            localStorage.setItem('lastProductId', prodId);
        }
        localStorage.setItem('lastScroll', String(window.scrollY || 0));

        // Скрываем баннер на мобильных
        const mainBanner = document.getElementById('main-banner');
        if (window.innerWidth <= 768 && mainBanner) {
            mainBanner.style.display = 'none';
        }

        window.location.href = pageUrl;
    },

    goToCategory(categoryId) {
        const modal = document.querySelector('.reviews-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        CategoryManager.showCategory(categoryId);

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
};

// ======================================================
// ⭐ СИСТЕМА ОТЗЫВОВ
// ======================================================

const ReviewsSystem = {
    scriptUrl: 'https://script.google.com/macros/s/AKfycbzhSB-fcDDeBBhRWBBO1h7ocuHFnOlVqqWUv9rsKXBVED_MHxkEbXHoeeH__q090sU1uw/exec',
    selectedRating: 0,
    allReviews: [],

    init() {
        this.initStarRating();
        this.loadForWidget();
        this.bindModalEvents();
    },

    bindModalEvents() {
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    },

    async loadForWidget() {
        try {
            const response = await fetch(this.scriptUrl);
            const data = await response.json();

            if (data.success && data.reviews) {
                this.allReviews = data.reviews;
                this.updateWidget(data.reviews);
            } else {
                this.updateWidget([]);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.updateWidget([]);
        }
    },

    updateWidget(reviews) {
        const count = reviews.length;
        const avgRating = count > 0 
            ? reviews.reduce((sum, r) => sum + (parseInt(r.rating) || 0), 0) / count 
            : 0;

        const ratingEl = document.getElementById('widgetRating');
        const countEl = document.getElementById('widgetCount');
        
        if (ratingEl) ratingEl.textContent = avgRating.toFixed(1);
        
        if (countEl) {
            const countText = count === 0 ? 'Немає відгуків' :
                             count === 1 ? '1 відгук' :
                             count < 5 ? `${count} відгуки` :
                             `${count} відгуків`;
            countEl.textContent = countText;
        }

        this.renderWidgetStars(avgRating);
    },

    renderWidgetStars(rating) {
        const container = document.getElementById('widgetStars');
        if (!container) return;
        
        container.innerHTML = '';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'widget-star';
            star.innerHTML = '★';
            star.setAttribute('aria-hidden', 'true');

            if (rating >= i) {
                const filled = document.createElement('span');
                filled.className = 'widget-star-filled';
                filled.style.width = '100%';
                filled.innerHTML = '★';
                star.appendChild(filled);
            } else if (rating > i - 1) {
                const filled = document.createElement('span');
                filled.className = 'widget-star-filled';
                const percentage = ((rating - (i - 1)) * 100).toFixed(0);
                filled.style.width = percentage + '%';
                filled.innerHTML = '★';
                star.appendChild(filled);
            }

            container.appendChild(star);
        }
    },

    openModal() {
        const modal = document.getElementById('reviewsModal');
        if (!modal) return;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
        
        // Фокус на первый элемент
        setTimeout(() => {
            const closeBtn = modal.querySelector('.reviews-modal-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
        
        this.loadReviews();
    },

    closeModal() {
        const modal = document.getElementById('reviewsModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modal.setAttribute('aria-hidden', 'true');
        
        // Возвращаем фокус на виджет
        const widget = document.querySelector('.reviews-widget');
        if (widget) widget.focus();
    },

    closeOnOutside(e) {
        if (e.target.id === 'reviewsModal') {
            this.closeModal();
        }
    },

    switchTab(tab) {
        const tabs = document.querySelectorAll('.reviews-tab');
        const contents = document.querySelectorAll('.reviews-tab-content');

        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        contents.forEach(c => c.classList.remove('active'));

        if (tab === 'read') {
            tabs[0].classList.add('active');
            tabs[0].setAttribute('aria-selected', 'true');
            document.getElementById('readTab').classList.add('active');
        } else {
            tabs[1].classList.add('active');
            tabs[1].setAttribute('aria-selected', 'true');
            document.getElementById('writeTab').classList.add('active');
        }
    },

    initStarRating() {
        const stars = document.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.selectedRating = index + 1;
                document.getElementById('reviewRating').value = this.selectedRating;
                this.updateStars(this.selectedRating);
            });
            
            star.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    star.click();
                }
            });
            
            star.setAttribute('tabindex', '0');
            star.setAttribute('role', 'button');
            star.setAttribute('aria-label', `Оцінка ${index + 1} з 5`);
        });
    },

    updateStars(rating) {
        const stars = document.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
            star.setAttribute('aria-pressed', index < rating ? 'true' : 'false');
        });
    },

    showMessage(text, type) {
        const msg = document.getElementById('formMessage');
        if (!msg) return;
        
        msg.textContent = text;
        msg.className = `message ${type}`;
        msg.style.display = 'block';
        msg.setAttribute('role', 'alert');
        
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000);
    },

    async submit(e) {
        e.preventDefault();

        if (this.selectedRating === 0) {
            this.showMessage('Будь ласка, оберіть оцінку!', 'error');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправка...';

        const review = {
            name: document.getElementById('reviewName').value.trim(),
            product: document.getElementById('reviewProduct').value,
            rating: this.selectedRating,
            text: document.getElementById('reviewText').value.trim(),
            date: new Date().toLocaleDateString('uk-UA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };

        try {
            await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            });

            this.showMessage('✓ Дякуємо! Ваш відгук успішно додано!', 'success');

            // Сброс формы
            document.getElementById('reviewName').value = '';
            document.getElementById('reviewProduct').value = '';
            document.getElementById('reviewText').value = '';
            this.selectedRating = 0;
            this.updateStars(0);

            setTimeout(() => {
                this.switchTab('read');
                this.loadReviews();
                this.loadForWidget();
            }, 2000);

        } catch (error) {
            this.showMessage('Помилка відправки. Спробуйте ще раз.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Відправити відгук';
        }
    },

    async loadReviews() {
        const loading = document.getElementById('loading');
        const list = document.getElementById('reviewsList');
        const noReviews = document.getElementById('noReviews');

        if (loading) loading.style.display = 'block';
        if (list) list.style.display = 'none';
        if (noReviews) noReviews.style.display = 'none';

        try {
            const response = await fetch(this.scriptUrl);
            const data = await response.json();

            if (loading) loading.style.display = 'none';

            if (data.success && data.reviews && data.reviews.length > 0) {
                this.updateModalStats(data.reviews);
                this.displayReviews(data.reviews);
            } else {
                this.updateModalStats([]);
                if (noReviews) noReviews.style.display = 'block';
            }
        } catch (error) {
            if (loading) loading.style.display = 'none';
            if (noReviews) noReviews.style.display = 'block';
        }
    },

    updateModalStats(reviews) {
        const count = reviews.length;
        const avgRating = count > 0 
            ? reviews.reduce((sum, r) => sum + (parseInt(r.rating) || 0), 0) / count 
            : 0;

        const ratingEl = document.getElementById('modalRating');
        const countEl = document.getElementById('modalCount');
        
        if (ratingEl) ratingEl.textContent = avgRating.toFixed(1);
        
        if (countEl) {
            const countText = count === 0 ? 'Немає відгуків' :
                             count === 1 ? '1 відгук' :
                             count < 5 ? `${count} відгуки` :
                             `${count} відгуків`;
            countEl.textContent = countText;
        }

        const modalStars = document.getElementById('modalStars');
        if (modalStars) {
            modalStars.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = i <= Math.round(avgRating) ? 'modal-star' : 'modal-star empty';
                star.textContent = '★';
                star.setAttribute('aria-hidden', 'true');
                modalStars.appendChild(star);
            }
        }
    },

    displayReviews(reviews) {
        const list = document.getElementById('reviewsList');
        if (!list) return;
        
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
                .map((_, i) => `<span class="star ${i >= (review.rating || 0) ? 'empty' : ''}" aria-hidden="true">★</span>`)
                .join('');

            const cat = CATEGORY_MAP[review.product] || CATEGORY_MAP.other;

            const card = document.createElement('article');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar" aria-hidden="true">${initials}</div>
                    <div class="review-info">
                        <div class="review-name">${this.escapeHtml(review.name)}</div>
                        <time class="review-date">${this.escapeHtml(review.date)}</time>
                    </div>
                </div>
                <div class="review-stars" aria-label="Оцінка ${review.rating || 0} з 5">${stars}</div>
                <p class="review-text">${this.escapeHtml(review.text)}</p>
                <a href="#${review.product}" class="review-product" onclick="ProductNavigator.goToCategory('${review.product}'); return false;">
                    <img src="${cat.icon}" alt="" loading="lazy">
                    ${cat.label}
                </a>
            `;

            list.appendChild(card);
        });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ======================================================
// 🚀 ИНИЦИАЛИЗАЦИЯ
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация модулей
    CartManager.init();
    CategoryManager.init();
    ReviewsSystem.init();

    // Звуки
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

    // Глобальные функции для onclick
    window.toggleCart = () => CartManager.toggle();
    window.clearCart = () => CartManager.clear();
    window.addToCart = (e, item) => CartManager.addItem(item, e);
    window.addToCartFromProductPage = (e, item) => CartManager.addItem(item, e);
    window.toggleCategory = (catId) => CategoryManager.showCategory(catId);
    window.openProductDetails = (url) => ProductNavigator.openDetails(url);
    window.openReviewsModal = () => ReviewsSystem.openModal();
    window.closeReviewsModal = () => ReviewsSystem.closeModal();
    window.closeModalOnOutsideClick = (e) => ReviewsSystem.closeOnOutside(e);
    window.switchTab = (tab) => ReviewsSystem.switchTab(tab);
    window.submitReview = (e) => ReviewsSystem.submit(e);
    window.goToCategoryFromReview = (catId) => ProductNavigator.goToCategory(catId);
    window.increaseQuantity = (id, e) => CartManager.increaseQuantity(id, e);
    window.decreaseQuantity = (id, e) => CartManager.decreaseQuantity(id, e);
});
