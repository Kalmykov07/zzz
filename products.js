// JavaScript для страницы "Все скидки"

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница "Все скидки" загружена');
    
    // Инициализация функциональности
    initSalesPage();
});

// Инициализация страницы скидок
function initSalesPage() {
    // Инициализация фильтров скидок
    initSalesFilters();
    
    // Инициализация кнопок покупки
    initBuyButtons();
    
    // Инициализация пагинации
    initSalesPagination();
    
    // Инициализация таймера для товаров со скидкой
    initDiscountTimers();
}

// Инициализация фильтров скидок
function initSalesFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterType = this.closest('.filter-item')?.querySelector('h3')?.textContent || 'Фильтр';
            const value = this.value;
            
            console.log(`Фильтр скидок "${filterType}": ${value}`);
            
            // Применение фильтрации
            applySalesFilter(value);
        });
    });
}

// Применение фильтра скидок
function applySalesFilter(filterValue) {
    const salesCards = document.querySelectorAll('.sales-product-card');
    const salesCount = document.querySelector('.count-number');
    
    let visibleCount = 0;
    
    salesCards.forEach(card => {
        let shouldShow = true;
        
        switch(filterValue) {
            case 'all':
                // Все товары - ничего не фильтруем
                shouldShow = true;
                break;
            case 'big':
                shouldShow = card.classList.contains('big-discount');
                break;
            case 'ending':
                shouldShow = card.classList.contains('ending-soon');
                break;
            case 'new':
                // Нет класса для новых, показываем случайные
                shouldShow = Math.random() > 0.5;
                break;
            case 'high':
                // Фильтрация по большой скидке
                const discountLabel = card.querySelector('.discount-label')?.textContent;
                const discountValue = parseInt(discountLabel?.replace('-', '').replace('%', '') || '0');
                shouldShow = discountValue >= 30;
                break;
            case 'low':
                // Фильтрация по маленькой скидке
                const discountLabelLow = card.querySelector('.discount-label')?.textContent;
                const discountValueLow = parseInt(discountLabelLow?.replace('-', '').replace('%', '') || '0');
                shouldShow = discountValueLow < 30;
                break;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
            
            // Анимация появления
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = '';
            }, Math.random() * 300);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Обновление счетчика
    if (salesCount) {
        salesCount.textContent = visibleCount;
    }
}

// Инициализация кнопок покупки
function initBuyButtons() {
    const buyButtons = document.querySelectorAll('.buy-now-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const productCard = this.closest('.sales-product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const discountPrice = productCard.querySelector('.discount-price').textContent;
            const discountLabel = productCard.querySelector('.discount-label').textContent;
            
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
                
                // Добавление в корзину
                addToCartFromSales(productName, discountPrice, discountLabel);
                
                // Анимация кнопки
                const originalText = this.textContent;
                this.textContent = 'Добавлено в корзину!';
                this.disabled = true;
                
                if (this.classList.contains('urgent')) {
                    this.style.background = '#27ae60';
                } else {
                    this.style.background = '#27ae60';
                }
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.background = '';
                }, 2000);
            }, 200);
        });
    });
}

// Добавление в корзину со страницы скидок
function addToCartFromSales(productName, price, discount) {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    let currentCount = parseInt(cartCountElement.textContent) || 0;
    currentCount++;
    cartCountElement.textContent = currentCount;
    
    // Анимация счетчика
    cartCountElement.style.transition = 'all 0.2s ease';
    cartCountElement.style.transform = 'scale(1.4)';
    
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 200);
    
    // Показ уведомления
    showSalesNotification(productName, price, discount);
}

// Показ уведомления о покупке со скидкой
function showSalesNotification(productName, price, discount) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 100px; right: 20px; background: linear-gradient(135deg, #0e8a25, #27ae60); color: white; padding: 20px; border-radius: 10px; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-width: 350px; animation: slideIn 0.5s ease;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: white; color: #0e8a25; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 1.2rem;">
                    <i class="fas fa-tag"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.2rem;">Товар со скидкой добавлен!</h4>
            </div>
            <p style="margin: 5px 0; font-size: 1.1rem; font-weight: 600;">${productName}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div>
                    <span style="font-size: 1.4rem; font-weight: 800;">${price}</span>
                    <span style="background: #e74c3c; padding: 4px 10px; border-radius: 4px; margin-left: 10px; font-weight: 600;">${discount}</span>
                </div>
                <span style="font-size: 0.9rem; opacity: 0.9;">В корзине: ${document.querySelector('.cart-count').textContent} шт.</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        notification.firstChild.style.animation = 'slideOut 0.5s ease forwards';
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 500);
    }, 3000);
}

// Инициализация пагинации
function initSalesPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    const nextBtn = document.querySelector('.page-next');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            pageBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Имитация загрузки страницы
            simulateSalesPageLoad();
        });
    });
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Находим следующую страницу
            const activeBtn = document.querySelector('.page-btn.active');
            const currentPage = parseInt(activeBtn.textContent);
            const nextPage = currentPage + 1;
            
            // Проверяем, есть ли кнопка для следующей страницы
            const nextPageBtn = Array.from(pageBtns).find(btn => 
                parseInt(btn.textContent) === nextPage
            );
            
            if (nextPageBtn) {
                nextPageBtn.click();
            } else {
                // Если следующей страницы нет, переходим на первую
                pageBtns[0].click();
            }
        });
    }
}

// Имитация загрузки страницы скидок
function simulateSalesPageLoad() {
    const salesGrid = document.querySelector('.sales-grid');
    const salesCards = salesGrid.querySelectorAll('.sales-product-card');
    
    // Анимация исчезновения
    salesCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });
    
    // Имитация задержки загрузки
    setTimeout(() => {
        // Анимация появления
        salesCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = '';
            }, index * 50);
        });
    }, 300);
}

// Инициализация таймеров для товаров со скидкой
function initDiscountTimers() {
    const endingCards = document.querySelectorAll('.ending-soon');
    
    endingCards.forEach(card => {
        const timeLeftElement = card.querySelector('.time-left');
        if (!timeLeftElement) return;
        
        // Устанавливаем случайное время для демонстрации
        let hours = Math.floor(Math.random() * 24);
        let minutes = Math.floor(Math.random() * 60);
        let seconds = Math.floor(Math.random() * 60);
        
        // Функция обновления таймера
        function updateTimer() {
            seconds--;
            
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    
                    if (hours < 0) {
                        // Скидка закончилась
                        timeLeftElement.textContent = 'Скидка закончилась!';
                        timeLeftElement.style.background = '#95a5a6';
                        clearInterval(timerInterval);
                        return;
                    }
                }
            }
            
            timeLeftElement.textContent = `Осталось: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Запускаем таймер
        const timerInterval = setInterval(updateTimer, 1000);
        
        // Сохраняем ID интервала в data-атрибут
        card.dataset.timerId = timerInterval;
    });
}

// Очистка таймеров при уходе со страницы
window.addEventListener('beforeunload', function() {
    const endingCards = document.querySelectorAll('.ending-soon');
    endingCards.forEach(card => {
        const timerId = card.dataset.timerId;
        if (timerId) {
            clearInterval(parseInt(timerId));
        }
    });
});

// Экспорт функций
window.salesModule = {
    initSalesPage,
    applySalesFilter,
    addToCartFromSales
};