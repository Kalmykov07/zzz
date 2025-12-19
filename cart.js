// JavaScript для страницы корзины

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница корзины загружена');
    
    // Обновляем активную ссылку
    updateActiveNavLink();
    
    // Инициализация функциональности корзины
    initCartPage();
});

// Инициализация страницы корзины
function initCartPage() {
    // Инициализация кнопок изменения количества
    initQuantityButtons();
    
    // Инициализация кнопок удаления товаров
    initRemoveButtons();
    
    // Инициализация кнопки очистки корзины
    initClearCartButton();
    
    // Инициализация промокода
    initPromoCode();
    
    // Инициализация вариантов доставки и оплаты
    initDeliveryOptions();
    initPaymentOptions();
    
    // Инициализация кнопки оформления заказа
    initCheckoutButton();
    
    // Инициализация кнопок добавления рекомендаций
    initRecommendationButtons();
    
    // Инициализация обновления итогов
    updateCartSummary();
}

// Инициализация кнопок изменения количества
function initQuantityButtons() {
    // Кнопки минус
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateItemTotal(this.closest('.cart-item'));
                updateCartSummary();
            }
        });
    });
    
    // Кнопки плюс
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            if (value < 10) {
                input.value = value + 1;
                updateItemTotal(this.closest('.cart-item'));
                updateCartSummary();
            }
        });
    });
    
    // Прямой ввод количества
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
        });
    });
}

// Обновление суммы за товар
function updateItemTotal(item) {
    const quantity = parseInt(item.querySelector('.quantity-input').value);
    const price = parseFloat(item.querySelector('.current-price').textContent.replace('$', ''));
    const total = quantity * price;
    
    const totalElement = item.querySelector('.total-price');
    totalElement.textContent = `$${total}`;
    
    // Анимация обновления
    totalElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
    }, 200);
}

// Инициализация кнопок удаления товаров
function initRemoveButtons() {
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            const itemName = item.querySelector('.item-title').textContent;
            
            // Анимация удаления
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.remove();
                updateCartSummary();
                showNotification(`Товар "${itemName}" удален из корзины`, 'warning');
                updateCartCount();
            }, 300);
        });
    });
}

// Инициализация кнопки очистки корзины
function initClearCartButton() {
    const clearBtn = document.querySelector('.clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите очистить всю корзину?')) {
                const items = document.querySelectorAll('.cart-item');
                
                // Анимация удаления всех товаров
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                        
                        setTimeout(() => {
                            item.remove();
                            if (index === items.length - 1) {
                                updateCartSummary();
                                showNotification('Корзина очищена', 'warning');
                                updateCartCount();
                            }
                        }, 300);
                    }, index * 100);
                });
            }
        });
    }
}

// Инициализация промокода
function initPromoCode() {
    const promoBtn = document.querySelector('.promo-apply-btn');
    const promoInput = document.querySelector('.promo-input');
    
    if (promoBtn && promoInput) {
        promoBtn.addEventListener('click', applyPromoCode);
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

// Применение промокода
function applyPromoCode() {
    const promoInput = document.querySelector('.promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        showNotification('Введите промокод', 'info');
        return;
    }
    
    // Имитация проверки промокода
    const validPromoCodes = ['SALE10', 'GARDEN15', 'NEWYEAR20'];
    
    if (validPromoCodes.includes(promoCode)) {
        showNotification(`Промокод "${promoCode}" применен!`, 'success');
        promoInput.value = '';
        
        // Добавляем скидку в итоги
        const discountRow = document.querySelector('.discount-value');
        let currentDiscount = parseInt(discountRow.textContent.replace('-$', '').replace('$', '') || '0');
        let newDiscount = 0;
        
        switch(promoCode) {
            case 'SALE10': newDiscount = 10; break;
            case 'GARDEN15': newDiscount = 15; break;
            case 'NEWYEAR20': newDiscount = 20; break;
        }
        
        discountRow.textContent = `-$${currentDiscount + newDiscount}`;
        updateCartSummary();
        
    } else {
        showNotification('Неверный промокод', 'error');
    }
}

// Инициализация вариантов доставки
function initDeliveryOptions() {
    document.querySelectorAll('.delivery-option input').forEach(radio => {
        radio.addEventListener('change', function() {
            // Обновляем активный класс
            document.querySelectorAll('.delivery-option').forEach(option => {
                option.classList.remove('active');
            });
            this.closest('.delivery-option').classList.add('active');
            
            // Обновляем стоимость доставки в итогах
            updateDeliveryPrice(this.value);
            updateCartSummary();
        });
    });
}

// Обновление цены доставки
function updateDeliveryPrice(deliveryType) {
    const deliveryRow = document.querySelectorAll('.summary-row')[2];
    const deliveryValue = deliveryRow.querySelector('.summary-value');
    
    switch(deliveryType) {
        case 'delivery2':
            deliveryValue.textContent = 'Бесплатно';
            break;
        default:
            deliveryValue.textContent = '$20';
    }
}

// Инициализация вариантов оплаты
function initPaymentOptions() {
    document.querySelectorAll('.payment-option input').forEach(radio => {
        radio.addEventListener('change', function() {
            // Убираем checked у всех
            document.querySelectorAll('.payment-option input').forEach(r => {
                r.checked = false;
            });
            // Ставим checked текущему
            this.checked = true;
        });
    });
}

// Инициализация кнопки оформления заказа
function initCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const totalValue = document.querySelector('.total-value').textContent;
            
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
                
                // Имитация оформления заказа
                showOrderConfirmation(totalValue);
            }, 200);
        });
    }
}

// Показ подтверждения заказа
function showOrderConfirmation(total) {
    const confirmation = document.createElement('div');
    confirmation.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: popup 0.5s ease;">
                <div style="width: 80px; height: 80px; background: #0e8a25; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2.5rem;">
                    <i class="fas fa-check"></i>
                </div>
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Заказ оформлен!</h2>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">
                    Спасибо за ваш заказ на сумму <strong style="color: #0e8a25;">${total}</strong>. 
                    Наш менеджер свяжется с вами в течение 30 минут для подтверждения заказа.
                </p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: left;">
                    <h4 style="margin-bottom: 10px; color: #2c3e50;">Детали заказа:</h4>
                    <p style="margin: 5px 0; color: #666;">
                        <i class="fas fa-receipt" style="color: #0e8a25; margin-right: 10px;"></i>
                        Номер заказа: #${Math.floor(Math.random() * 10000) + 1000}
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <i class="fas fa-clock" style="color: #0e8a25; margin-right: 10px;"></i>
                        Время оформления: ${new Date().toLocaleTimeString()}
                    </p>
                </div>
                <button class="close-confirmation-btn" style="padding: 12px 30px; background: #0e8a25; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%;">
                    Понятно
                </button>
            </div>
        </div>
    `;
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popup {
            from {
                transform: scale(0.5);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(confirmation);
    
    // Закрытие подтверждения
    const closeBtn = confirmation.querySelector('.close-confirmation-btn');
    closeBtn.addEventListener('click', function() {
        confirmation.style.opacity = '0';
        confirmation.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            document.body.removeChild(confirmation);
            document.head.removeChild(style);
            
            // Очищаем корзину
            document.querySelectorAll('.cart-item').forEach(item => item.remove());
            updateCartSummary();
            updateCartCount();
            
            // Показываем финальное сообщение
            showNotification('Заказ успешно оформлен! Спасибо за покупку.', 'success');
        }, 300);
    });
}

// Инициализация кнопок добавления рекомендаций
function initRecommendationButtons() {
    document.querySelectorAll('.rec-add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.recommendation-item');
            const itemName = item.querySelector('.rec-title').textContent;
            const itemPrice = item.querySelector('.rec-price').textContent;
            
            // Анимация добавления
            this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            this.style.background = '#0e8a25';
            this.style.color = 'white';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Добавить';
                this.style.background = '';
                this.style.color = '';
                this.disabled = false;
            }, 1500);
            
            // Показываем уведомление
            showNotification(`"${itemName}" добавлен в корзину за ${itemPrice}`, 'success');
            
            // Обновляем счетчик корзины
            updateCartCount();
        });
    });
}

// Обновление итогов корзины
function updateCartSummary() {
    let itemsTotal = 0;
    let itemsCount = 0;
    
    // Считаем общую стоимость и количество
    document.querySelectorAll('.cart-item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const price = parseFloat(item.querySelector('.current-price').textContent.replace('$', ''));
        itemsTotal += quantity * price;
        itemsCount += quantity;
    });
    
    // Получаем скидку из промокода
    const discountElement = document.querySelector('.discount-value');
    let discount = 0;
    if (discountElement) {
        const discountText = discountElement.textContent;
        if (discountText.includes('-')) {
            discount = parseFloat(discountText.replace('-$', '').replace('$', '')) || 0;
        }
    }
    
    // Получаем стоимость доставки
    const deliveryElement = document.querySelectorAll('.summary-row')[2].querySelector('.summary-value');
    let delivery = 0;
    if (deliveryElement.textContent !== 'Бесплатно') {
        delivery = parseFloat(deliveryElement.textContent.replace('$', '')) || 0;
    }
    
    // Обновляем значения
    const subtotalElement = document.querySelectorAll('.summary-row')[0].querySelector('.summary-value');
    subtotalElement.textContent = `$${itemsTotal}`;
    
    // Обновляем счетчик товаров в заголовке
    const itemsCountElement = document.querySelector('.items-count');
    if (itemsCountElement) {
        itemsCountElement.textContent = `(${itemsCount} шт.)`;
    }
    
    // Считаем итог
    const total = itemsTotal - discount + delivery;
    const totalElement = document.querySelector('.total-value');
    totalElement.textContent = `$${total}`;
}

// Обновление счетчика в шапке
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        let itemsCount = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            itemsCount += parseInt(item.querySelector('.quantity-input').value);
        });
        cartCountElement.textContent = itemsCount;
        
        // Анимация обновления
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
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
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
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
        notification.firstChild.style.animation = 'slideOutRight 0.5s ease forwards';
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 500);
    }, 3000);
}

// Обновление активной ссылки
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'cart.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Экспорт функций
window.cartModule = {
    initCartPage,
    updateCartSummary,
    updateCartCount
};