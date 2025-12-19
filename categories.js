// Обновленный скрипт с поддержкой страницы категорий

// Функция для обновления активной ссылки навигации
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Убираем активный класс со всех ссылок
        link.classList.remove('active');
        
        // Добавляем активный класс к текущей странице
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === '') ||
            (currentPage === 'categories.html' && linkHref === 'categories.html')) {
            link.classList.add('active');
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем активную ссылку
    updateActiveNavLink();
    
    // Обработка мобильного меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function () {
            mainNav.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                mainNav.classList.remove('active');
            });
        });
    }

    // Обработка активного состояния ссылок
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            // Если ссылка ведет на другую страницу, обновим активный класс
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                document.querySelectorAll('.nav-link').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Корзина
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');

    function addToCart() {
        if (cartCountElement) {
            cartCount++;
            cartCountElement.textContent = cartCount;
            cartCountElement.style.transform = 'scale(1.2)';

            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 300);
        }
    }

    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', function (e) {
            e.preventDefault();
            addToCart();
        });
    }

    // Обработка карточек категорий
    document.querySelectorAll('.category-card-item').forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();

            this.style.transform = 'scale(0.98)';

            setTimeout(() => {
                this.style.transform = '';
            }, 200);

            const randomItems = Math.floor(Math.random() * 2) + 1;
            let currentCount = parseInt(cartCountElement ? cartCountElement.textContent : 0);

            for (let i = 0; i < randomItems; i++) {
                setTimeout(() => {
                    currentCount++;
                    if (cartCountElement) {
                        cartCountElement.textContent = currentCount;
                        cartCountElement.style.transform = 'scale(1.3)';

                        setTimeout(() => {
                            cartCountElement.style.transform = 'scale(1)';
                        }, 200);
                    }
                }, i * 150);
            }

            this.style.boxShadow = '0 0 0 3px rgba(14, 138, 37, 0.3)';
            this.style.borderColor = '#0e8a25';

            setTimeout(() => {
                this.style.boxShadow = '';
                this.style.borderColor = '#e0e0e0';
            }, 1000);

            const categoryTitle = this.querySelector('.category-card-title')?.textContent;
            if (categoryTitle) {
                console.log(`Выбрана категория: ${categoryTitle}`);
            }
        });
    });

    // Кнопка "All categories"
    const allCategoriesBtn = document.querySelector('.all-categories-btn');
    if (allCategoriesBtn) {
        allCategoriesBtn.addEventListener('click', function (e) {
            e.preventDefault();

            this.style.transform = 'scale(0.95)';

            setTimeout(() => {
                this.style.transform = '';
            }, 200);

            const randomItems = Math.floor(Math.random() * 8) + 3;
            let currentCount = parseInt(cartCountElement ? cartCountElement.textContent : 0);

            for (let i = 0; i < randomItems; i++) {
                setTimeout(() => {
                    currentCount++;
                    if (cartCountElement) {
                        cartCountElement.textContent = currentCount;
                        cartCountElement.style.transform = 'scale(1.3)';

                        setTimeout(() => {
                            cartCountElement.style.transform = 'scale(1)';
                        }, 200);
                    }
                }, i * 100);
            }

            alert('Переход ко всем категориям! В корзину добавлены случайные товары.');
        });
    }

    // Обработка формы скидки
    const discountForm = document.querySelector('.discount-form');
    if (discountForm) {
        discountForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Получаем значения полей формы
            const name = document.getElementById('name')?.value;
            const phone = document.getElementById('phone')?.value;
            const email = document.getElementById('email')?.value;

            // Валидация
            if (!name || !phone || !email) {
                alert('Пожалуйста, заполните все поля формы');
                return;
            }

            // Простая валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email адрес');
                return;
            }

            // Имитация отправки данных
            const submitBtn = document.querySelector('.discount-submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Здесь обычно отправка данных на сервер
                alert(`Спасибо, ${name}! Ваша заявка на скидку 5% принята. Мы свяжемся с вами в ближайшее время по телефону ${phone}.`);

                // Сброс формы
                discountForm.reset();

                // Восстановление кнопки
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Добавляем товар в корзину как бонус
                const randomBonus = Math.floor(Math.random() * 3) + 1;
                let currentCount = parseInt(cartCountElement ? cartCountElement.textContent : 0);
                currentCount += randomBonus;
                if (cartCountElement) {
                    cartCountElement.textContent = currentCount;

                    cartCountElement.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        cartCountElement.style.transform = 'scale(1)';
                    }, 300);
                }

            }, 1500);
        });
    }
});