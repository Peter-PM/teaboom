(function () {
    'use strict';

    // Форматирование цены в рублях: 1432 -> "1 432,00 ₽"
    function formatPrice(value) {
        const num = Number(value);
        if (Number.isNaN(num)) return '';
        return num.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' ₽';
    }

    // Выбор фасовки
    const variantRadios = document.querySelectorAll('input[name="variant"]');
    const priceValueEl = document.getElementById('product-price-value');
    const priceCurrentEl = document.getElementById('product-price-current');
    const oldPriceEl = document.getElementById('product-old-price');
    const oldPriceValueEl = document.getElementById('product-old-price-value');
    const skuEl = document.getElementById('product-sku');
    const priceMetaEl = document.querySelector('strong[itemprop="price"]');
    const addToCartBtn = document.getElementById('add-to-cart');

    function updateVariant(radio) {
        if (!radio) return;

        const price = radio.dataset.price;
        const oldPrice = radio.dataset.oldPrice;
        const sku = radio.dataset.sku;
        const variantId = radio.value;

        // Текущая цена
        priceValueEl.textContent = formatPrice(price);
        if (priceMetaEl) {
            priceMetaEl.setAttribute('content', price);
        }

        // Старая цена
        if (oldPrice) {
            oldPriceValueEl.textContent = formatPrice(oldPrice);
            oldPriceEl.hidden = false;
            priceCurrentEl.classList.add('is-sale');
        } else {
            oldPriceEl.hidden = true;
            priceCurrentEl.classList.remove('is-sale');
        }

        // Артикул
        skuEl.textContent = sku;

        // ID варианта для кнопки
        if (addToCartBtn) {
            addToCartBtn.dataset.variantId = variantId;
        }
    }

    variantRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (radio.checked) {
                updateVariant(radio);
            }
        });
    });

    // Инициализация при загрузке
    const checkedRadio = document.querySelector('input[name="variant"]:checked');
    updateVariant(checkedRadio);

    //    Галерея
    const mainImage = document.getElementById('product-main-image');
    const thumbs = document.querySelectorAll('.product__thumb');

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            mainImage.src = thumb.dataset.imageSrc;
            mainImage.alt = thumb.dataset.imageAlt || '';

            thumbs.forEach(function (t) {
                t.classList.remove('is-active');
                t.removeAttribute('aria-current');
            });
            thumb.classList.add('is-active');
            thumb.setAttribute('aria-current', 'true');
        });
    });

    // Кнопка "В корзину"
    const cartStatus = document.getElementById('cart-status');
    let cartTimer = null;

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            // const variantId = addToCartBtn.dataset.variantId;
            // const productId = addToCartBtn.dataset.productId;
            const checked = document.querySelector('input[name="variant"]:checked');
            const variantName = checked
                ? checked.closest('.product__variant').querySelector('.product__variant-name').textContent.trim()
                : '';

            // fetch('/cart/add', { method: 'POST', body: JSON.stringify({ productId, variantId }) })

            cartStatus.textContent = 'Товар «Ананасовый улун, ' + variantName + '» добавлен в корзину.';
            cartStatus.classList.remove('visually-hidden');

            const textEl = addToCartBtn.querySelector('.button__text');
            const originalText = textEl.textContent;
            textEl.textContent = 'Добавлено';
            addToCartBtn.disabled = true;

            if (cartTimer) clearTimeout(cartTimer);
            cartTimer = setTimeout(function () {
                textEl.textContent = originalText;
                cartStatus.textContent = '';
                cartStatus.classList.add('visually-hidden');
                addToCartBtn.disabled = false;
            }, 1500);
        });
    }

    // Хлебные крошки
    const breadcrumbs = document.getElementById('breadcrumbs');
    const list = Array.from(breadcrumbs.children)
    if (list.length > 2) {
        list.forEach((item, index) => {
            if (index < list.length - 2) {
                item.classList.add('visually-hidden')
            }
        })

        const ellipsisLi = document.createElement('li');
        ellipsisLi.className = 'breadcrumbs__ellipsis-item';

        const ellipsisBtn = document.createElement('button');
        ellipsisBtn.type = 'button';
        ellipsisBtn.className = 'breadcrumbs__ellipsis';
        ellipsisBtn.setAttribute('aria-expanded', 'false');
        ellipsisBtn.setAttribute('aria-label', 'Показать скрытые хлебные крошки');
        ellipsisBtn.textContent = '…';

        ellipsisLi.appendChild(ellipsisBtn);
        breadcrumbs.prepend(ellipsisLi)

        ellipsisBtn.addEventListener('click', () => {
            list.forEach((item) => {
                item.classList.remove('visually-hidden')
            })
            ellipsisLi.remove()
        })
    }

    // Описание
    const maxHeigthBlocks = document.querySelectorAll('.max-heigth-block');

    maxHeigthBlocks.length && maxHeigthBlocks.forEach((item) => {
        const maxTextLine = item.getAttribute('data-max-textLine');
        const lineHeight = parseInt(getComputedStyle(item).lineHeight, 10);
        const maxHeigth = maxTextLine * lineHeight;

        const maxHeigthBlockText = item.querySelector('.max-heigth-block__text');
        maxHeigthBlockText.style.WebkitLineClamp = maxTextLine;
        maxHeigthBlockText.style.maxHeight = `${maxHeigth}px`;
        const maxHeigthBlockButton = item.querySelector('.max-heigth-block__button');

        maxHeigthBlockButton?.addEventListener('click', (evt) => {
            evt.preventDefault();
            requestAnimationFrame(() => {
                let scrollHeight = maxHeigthBlockText.scrollHeight;

                if (maxHeigthBlockText.children.length) {
                    Array.from(maxHeigthBlockText.children).forEach((item) => {
                        scrollHeight += item.scrollHeight;
                    });
                }

                if (maxHeigthBlockText.style.maxHeight === `${maxHeigth}px`) {
                    maxHeigthBlockText.style.maxHeight = `${scrollHeight}px`;
                    maxHeigthBlockText.style.WebkitLineClamp = 'none';
                    maxHeigthBlockButton.textContent = 'Свернуть';
                } else {
                    maxHeigthBlockText.style.maxHeight = `${maxHeigth}px`;
                    setTimeout(() => {
                        maxHeigthBlockText.style.WebkitLineClamp = maxTextLine;
                        maxHeigthBlockButton.textContent = 'Подробнее';
                    }, 200)
                }
            });
        })
    })

})();
