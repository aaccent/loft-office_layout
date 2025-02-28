import { CartInfo, Product } from '@/types'
import { formatPrice } from 'features/formatPrice'
import { testProducts } from '@/test-products'

/** Тултип ССЫЛКА СКОПИРОВАНА */
function shareLink(e: MouseEvent) {
    if (e.target !== e.currentTarget) return
    const element = e.target as HTMLElement

    const link = element.dataset.link
    if (!link) return
    window.navigator.clipboard.writeText(link)

    const tooltip = element.querySelector('.cart__share-tooltip')
    tooltip?.classList.add('visible')

    const timeout = setTimeout(() => tooltip?.classList.remove('visible'), 3000)

    tooltip?.addEventListener(
        'click',
        () => {
            tooltip.classList.remove('visible')
            clearTimeout(timeout)
        },
        true,
    )
}

/** Создание заполняющегося svg круга */
function createSVGCircle(container: Element) {
    const innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    innerSvg.setAttribute('viewBox', '0 0 60 60')
    innerSvg.classList.add('inner')

    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    innerCircle.setAttribute('cx', '30')
    innerCircle.setAttribute('cy', '30')
    innerCircle.setAttribute('r', '30')
    innerSvg.append(innerCircle)

    const outerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    outerSvg.setAttribute('viewBox', '0 0 60 60')
    outerSvg.classList.add('outer')

    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    outerCircle.setAttribute('cx', '50%')
    outerCircle.setAttribute('cy', '50%')
    outerCircle.setAttribute('r', '50%')
    outerSvg.append(outerCircle)

    container.append(innerSvg)
    container.append(outerSvg)
}

/** Заполнение круга */
function fillCircle(totalPrice: number, priceForDiscount: number) {
    const svgEl = document.querySelector<SVGSVGElement>('svg.outer')
    if (!svgEl) return

    const circleLength = svgEl.viewBox.baseVal.width * 3.14
    const circle = svgEl?.querySelector('circle') as SVGCircleElement
    circle.style.strokeDasharray = circleLength.toString()
    const offset = circleLength - (circleLength * totalPrice) / priceForDiscount
    circle.style.strokeDashoffset = offset.toString()
}

/** Расчет суммы для скидки */
function updateTrigger(totalPrice: number = 0) {
    const triggerBlock = document.querySelector<HTMLElement>('.cart-info__trigger')
    if (!triggerBlock) return

    const priceForDiscount = Number(triggerBlock.dataset.priceForDiscount)

    if (priceForDiscount - totalPrice < 0) return

    triggerBlock.classList.add('trigger')
    triggerBlock.querySelector('.cart-info__trigger-action span')!.textContent =
        ` ${formatPrice(priceForDiscount - totalPrice)}`

    fillCircle(totalPrice, priceForDiscount)
}

/** Липкий блок при скроле */
function stickyInfo() {
    const cartPopup = document.querySelector<HTMLElement>('.popup.cart')
    const cartInfo = document.querySelector<HTMLElement>('.cart-info')

    const setCartInfoBorder = (e: Event) => {
        const popup = e.target as HTMLElement
        const popupEnd = popup.scrollTop + popup.offsetHeight === popup.scrollHeight
        const divider = cartInfo?.querySelector<HTMLElement>('.cart-info__divider')
        if (popupEnd) {
            divider!.style.display = 'none'
        } else {
            divider!.style.display = 'block'
        }
    }

    const productsAmountInCart = document.querySelectorAll('.cart__list-product').length
    if (productsAmountInCart < 3) {
        cartInfo?.classList.remove('sticky')
        cartPopup?.removeEventListener('scroll', setCartInfoBorder)
    } else {
        cartInfo?.classList.add('sticky')
        cartPopup?.addEventListener('scroll', setCartInfoBorder)
    }
}

/** Обновление общего счетчика товаров в корзине в заголовке*/
function updateAmount() {
    const amount = document.querySelectorAll('.cart__list-product').length
    window.cart.amount = amount
    document.querySelector<HTMLElement>('.cart__amount')!.textContent = amount.toString()
}

/** Записывает или обновляет данные о товаре в корзине
 * @param rawProduct
 * @param element
 * @param rewrite - если true, то обновляются только цены, наличие и количество
 */
function updateProductData(rawProduct: Product, element: HTMLElement, rewrite: boolean = false) {
    const product = rewrite
        ? {
              totalPrice: rawProduct.totalPrice,
              discountPrice: rawProduct.discountPrice,
              pricePerItem: rawProduct.pricePerItem,
              stock: rawProduct.stock,
              amount: rawProduct.amount,
          }
        : rawProduct

    Object.entries(product).forEach(([key, value]) => {
        const dataEl = element.querySelector<HTMLElement>(`[data-${key}]`)
        if (!dataEl) return
        if (dataEl instanceof HTMLImageElement) {
            return (dataEl.src = value)
        }
        const priceValue = key === 'totalPrice' || key === 'discountPrice' || key === 'pricePerItem'
        if (priceValue) {
            return (dataEl.textContent = formatPrice(value))
        }

        if (key === 'stock' && value) {
            dataEl.style.display = 'block'
            dataEl.textContent = `наличие: ${value} шт`
            element.querySelector<HTMLElement>('.cart__list-product-preorder')!.style.display = 'none'
            return
        }

        dataEl.textContent = value.toString()
    })
}

/** Создание товара */
function createProduct(product: Product) {
    const productLayout = document.querySelector('.product__layout')
    if (!productLayout) return ''

    const productElement = productLayout.cloneNode(true) as HTMLElement
    productElement.classList.remove('product__layout')
    productElement.classList.add('cart__list-product')
    productElement.dataset.id = product.id.toString()
    const removeButton = productElement.querySelector('.cart__list-product-remove')
    removeButton?.addEventListener('click', () => removeItem(product.id))
    updateProductData(product, productElement)

    return productElement
}

/** Инициализация */
function init() {
    const shareButton = document.querySelector<HTMLButtonElement>('.cart__share')
    shareButton?.addEventListener('click', shareLink)

    const circleContainer = document.querySelector('.cart-info__trigger-circle')
    createSVGCircle(circleContainer!)

    const promoInput = document.querySelector<HTMLInputElement>('.cart__promo-input')
    const promoButton = document.querySelector('.cart__promo-button')
    promoInput?.addEventListener('input', () => {
        if (promoInput.value) {
            promoButton?.removeAttribute('disabled')
        } else {
            promoButton?.setAttribute('disabled', 'true')
        }
    })

    const clearButton = document.querySelector('.cart__clear')
    clearButton?.addEventListener('click', () => clear())
}

function addItems(list: Product[]) {
    const cartList = document.querySelector('.cart__list')
    if (!cartList) return

    const products = cartList.querySelectorAll('.cart__list-product')
    if (!products.length) {
        const empty = document.querySelector('.cart__empty')
        empty?.classList.add('hidden')
    }

    list.forEach((item) => {
        const itemInCart = Array.from(cartList.querySelectorAll<HTMLElement>('.cart__list-product')).find(
            (el) => el.id === item.id,
        )
        if (itemInCart) updateProductData(item, itemInCart, true)
        cartList?.append(createProduct(item))
    })
    stickyInfo()
    updateAmount()
}

function setItems(list: Product[]) {
    clear()
    addItems(list)
}

function setInfo(info: CartInfo) {
    const priceEl = document.querySelector('.cart-info__price')
    Object.entries(info).forEach(([key, value]) => {
        switch (key) {
            case 'totalPrice':
                priceEl!.setAttribute('data-total-price', `${info.totalPrice}`)
                priceEl!.querySelector('.cart-info__price-total')!.textContent = formatPrice(value)
                break
            case 'discountPrice':
                const discountPriceEl = document.createElement('div')
                discountPriceEl.classList.add('cart-info__price-discount')
                discountPriceEl.textContent = formatPrice(value)
                priceEl!.append(discountPriceEl)
                break
            case 'deliveryPrice':
                const deliveryEl = document.querySelector('.cart-info__delivery span')
                deliveryEl!.textContent = value
                break
            case 'weight':
                const weightEl = document.querySelector('.cart-info__weight span')
                weightEl!.textContent = value + ' кг'
                break
        }
    })
    updateTrigger(info.totalPrice)
}

function removeItem(id: Product['id']) {
    const products = document.querySelectorAll<HTMLElement>('.cart__list-product')
    products.forEach((product) => {
        if (id.toString() === product.dataset.id) {
            product.remove()
        }
    })
    stickyInfo()
    updateAmount()
}

function clear() {
    document.querySelectorAll('.cart__list-product').forEach((product) => product.remove())
}

window.cart = {
    addItems,
    setItems,
    setInfo,
    removeItem,
    clear,
    amount: 0,
}

init()
addItems(testProducts)
setInfo({
    totalPrice: 69872,
    discountPrice: 45632,
    weight: 896,
})
