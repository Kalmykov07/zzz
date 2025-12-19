// JavaScript для страницы "Все распродажи"

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница "Все распродажи" загружена');
    
    // Обновляем активную ссылку
    updateActiveNavLink();
    
    // Инициализация функциональности
    initClearancePage();
});

// Инициализация страницы распродаж
function initClearancePage() {
    // Инициализация фильтров
    initClearanceFilters();
    
    // Инициализация кнопок добавления в корзину
    initAddToCartButtons();
    
    // Инициализация пагинации
    initClearancePagination();
    
    // Инициализация таймеров обратного отсчета
    initCountdownTimers();
    
    // Инициализация кнопки сброса фильтров
    initResetFiltersButton();
}

// Инициализация фильтров распродаж
function initClearanceFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterType = this.previousElementSibling?.textContent || 'Фильтр';
            const value = this.value;
            
            console.log(`Фильтр "${filterType}": ${value}`);
            
            // Применение фильтрации
            applyClearanceFilter(value);
        });
    });
}

// Применение фильтра распродаж
function applyClearanceFilter(filterValue) {
    const clearanceCards = document.querySelectorAll('.clearance-card');
    let visibleCount = 0;
    
    clearanceCards.forEach(card => {
        let shouldShow = true;
        
        // Получаем процент скидки
        const discountText = card.querySelector('.discount-badge').textContent;
        const discountPercent = parseInt(discountText.replace('-', '').replace('%', ''));
        
        // Фильтрация по категории
        if (filterValue === 'tools') {
            shouldShow = card.querySelector('.product-category').textContent === 'Инструменты';
        } else if (filterValue === 'decor') {
            shouldShow = card.querySelector('.product-category').textContent === 'Садовый декор';
        } else if (filterValue === 'plants') {
            shouldShow = card.querySelector('.product-category').textContent === 'Посадочный материал';
        } else if (filterValue === 'fertilizer') {
            shouldShow = card.querySelector('.product-category').textContent === 'Удобрения';
        }
        
        // Фильтрация по размеру скидки
        if (filterValue === 'high') {
            shouldShow = discountPercent >= 50;
        } else if (filterValue === 'medium') {
            shouldShow = discountPercent >= 30 && discountPercent < 50;
        } else if (filterValue === 'low') {
            shouldShow = discountPercent < 30;
        }
        
        // Фильтрация по сортировке (имитация)
        if (filterValue === 'biggest') {
            shouldShow = discountPercent >= 50;
        } else if (filterValue === 'ending') {
            shouldShow = Math.random() > 0.5; // Для демонстрации
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
    
    // Показываем сообщение, если ничего не найдено
    showFilterResultsMessage(visibleCount);
}

// Показ сообщения о результатах фильтрации
function showFilterResultsMessage(count) {
    // Удаляем старое сообщение, если есть
    const oldMessage = document.querySelector('.filter-results-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    if (count === 0) {
        const grid = document.querySelector('.clearance-grid');
        if (!grid) return;
        
        const message = document.createElement('div');
        message.className = 'filter-results-message';
        message.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; border: 2px dashed #e0e0e0;">
                <div style="font-size: 3rem; color: #e0e0e0; margin-bottom: 20px;">
                    <i class="fas fa-search"></i>
                </div>
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Товары не найдены</h3>
                <p style="color: #666; margin-bottom: 20px;">Попробуйте изменить параметры фильтрации</p>
                <button class="reset-filters-btn" style="padding: 10px 20px; background: #0e8a25; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Сбросить фильтры
                </button>
            </div>
        `;
        
        grid.prepend(message);
        
        // Обработчик кнопки сброса
        const resetBtn = message.querySelector('.reset-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetClearanceFilters);
        }
    }
}

// Инициализация кнопки сброса фильтров
function initResetFiltersButton() {
    const resetBtn = document.querySelector('.filter-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetClearanceFilters);
    }
}

// Сброс всех фильтров
function resetClearanceFilters() {
    // Сбрасываем значения select
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = 'all';
    });
    
    // Показываем все товары
    document.querySelectorAll('.clearance-card').forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = '';
        }, Math.random() * 300);
    });
    
    // Удаляем сообщение о результатах
    const message = document.querySelector('.filter-results-message');
    if (message) {
        message.remove();
    }
    
    // Показываем уведомление
    showNotification('Фильтры сброшены', 'info');
}

// Инициализация кнопок добавления в корзину
function initAddToCartButtons() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const productCard = this.closest('.clearance-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const currentPrice = productCard.querySelector('.current-price').textContent;
            const discount = productCard.querySelector('.discount-badge').textContent;
            
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
                
                // Добавление в корзину
                addToCartFromClearance(productName, currentPrice, discount);
                
                // Анимация кнопки
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
                this.disabled = true;
                this.style.background = '#27ae60';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    this.style.background = '';
                }, 1500);
            }, 200);
        });
    });
}

// Добавление в корзину со страницы распродаж
function addToCartFromClearance(productName, price, discount) {
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
    
    // Показ специального уведомления для распродаж
    showClearanceNotification(productName, price, discount);
}

// Показ уведомления для распродаж
function showClearanceNotification(productName, price, discount) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 100px; right: 20px; background: linear-gradient(135deg, #e74c3c, #ff6b6b); color: white; padding: 20px; border-radius: 12px; z-index: 1000; box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3); max-width: 350px; animation: slideIn 0.5s ease;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: white; color: #e74c3c; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 1.3rem;">
                    <i class="fas fa-fire"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 1.1rem;">Товар с распродажи добавлен!</h4>
                    <div style="font-size: 0.8rem; opacity: 0.9;">Вы получили максимальную скидку</div>
                </div>
            </div>
            <p style="margin: 10px 0; font-size: 1.1rem; font-weight: 600;">${productName}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <div>
                    <span style="font-size: 1.4rem; font-weight: 800;">${price}</span>
                    <span style="background: white; color: #e74c3c; padding: 4px 10px; border-radius: 4px; margin-left: 10px; font-weight: 700;">${discount}</span>
                </div>
                <span style="font-size: 0.9rem; opacity: 0.9;">В корзине: ${document.querySelector('.cart-count').textContent} шт.</span>
            </div>
        </div>
    `;
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.firstChild.style.animation = 'slideOut 0.5s ease forwards';
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 500);
    }, 4000);
}

// Инициализация пагинации
function initClearancePagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    const nextBtn = document.querySelector('.page-next');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            pageBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Имитация загрузки страницы
            simulateClearancePageLoad();
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

// Имитация загрузки страницы распродаж
function simulateClearancePageLoad() {
    const clearanceGrid = document.querySelector('.clearance-grid');
    const clearanceCards = clearanceGrid.querySelectorAll('.clearance-card');
    
    // Анимация исчезновения
    clearanceCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });
    
    // Имитация задержки загрузки
    setTimeout(() => {
        // Анимация появления
        clearanceCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = '';
            }, index * 50);
        });
    }, 300);
}

// Инициализация таймеров обратного отсчета
function initCountdownTimers() {
    const timers = document.querySelectorAll('.timer .time-left');
    
    timers.forEach(timer => {
        // Устанавливаем случайное время (от 1 до 24 часов)
        let hours = Math.floor(Math.random() * 24) + 1;
        let minutes = Math.floor(Math.random() * 60);
        let seconds = Math.floor(Math.random() * 60);
        
        // Функция обновления таймера
        function updateCountdown() {
            seconds--;
            
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    
                    if (hours < 0) {
                        // Время вышло
                        timer.textContent = '00:00:00';
                        timer.style.color = '#e74c3c';
                        timer.parentElement.style.background = '#ffebee';
                        
                        // Отключаем кнопку добавления в корзину
                        const addBtn = timer.closest('.clearance-card').querySelector('.add-to-cart-btn');
                        if (addBtn) {
                            addBtn.textContent = 'Время вышло';
                            addBtn.disabled = true;
                            addBtn.style.background = '#95a5a6';
                        }
                        
                        clearInterval(timerInterval);
                        return;
                    }
                }
            }
            
            // Обновляем отображение
            timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Меняем цвет при малом остатке времени
            if (hours === 0 && minutes < 30) {
                timer.style.color = '#e74c3c';
                timer.parentElement.style.background = '#ffebee';
            }
        }
        
        // Запускаем таймер
        const timerInterval = setInterval(updateCountdown, 1000);
        
        // Сохраняем ID интервала в data-атрибут
        timer.dataset.intervalId = timerInterval;
    });
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#0e8a25' : 
                   type === 'warning' ? '#f39c12' : 
                   type === 'error' ? '#e74c3c' : '#3498db';
    
    notification.innerHTML = `
        <div style="position: fixed; top: 100px; right: 20px; background: ${bgColor}; color: white; padding: 15px 20px; border-radius: 8px; z-index: 1000; box-shadow: 0 5px 15px rgba(0,0,0,0.2); max-width: 300px; animation: slideInRight 0.5s ease;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Обновление активной ссылки
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'clearance.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Очистка таймеров при уходе со страницы
window.addEventListener('beforeunload', function() {
    document.querySelectorAll('.time-left').forEach(timer => {
        const intervalId = timer.dataset.intervalId;
        if (intervalId) {
            clearInterval(parseInt(intervalId));
        }
    });
});

// Экспорт функций
window.clearanceModule = {
    initClearancePage,
    applyClearanceFilter,
    resetClearanceFilters
};