import { CartInfo, CartNotification, Product } from '@/types/cart'
import { formatPrice } from 'features/formatPrice'
import { testProducts } from '@/test-products'

function camelCaseToKebab(camelCaseString: string) {
    return camelCaseString.replaceAll(/[A-Z]/g, (substring) => `-${substring.toLowerCase()}`)
}

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
    const triggerBlock = document.querySelector<HTMLElement>('.cart__info-trigger')
    if (!triggerBlock) return

    const priceForDiscount = Number(triggerBlock.dataset.priceForDiscount)

    if (priceForDiscount - totalPrice < 0) return

    triggerBlock.classList.add('trigger')
    triggerBlock.querySelector('.cart__info-trigger-action span')!.textContent =
        ` ${formatPrice(priceForDiscount - totalPrice)}`

    fillCircle(totalPrice, priceForDiscount)
}

/** Липкий блок при скроле */
function stickyInfo() {
    const cartPopup = document.querySelector<HTMLElement>('.popup.cart')
    const cartInfo = document.querySelector<HTMLElement>('.cart__info')

    const setCartInfoBorder = (e: Event) => {
        const popup = e.target as HTMLElement
        const popupEnd = popup.scrollTop + popup.offsetHeight === popup.scrollHeight
        const divider = cartInfo?.querySelector<HTMLElement>('.cart__info-divider')
        if (popupEnd) {
            divider!.style.display = 'none'
        } else {
            divider!.style.display = 'block'
        }
    }

    const productsAmountInCart = document.querySelectorAll('.cart__list .cart__list-product').length
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
    const amount = document.querySelectorAll('.cart__list .cart__list-product').length
    window.cart.amount = amount

    document.querySelector<HTMLElement>('.cart__amount')!.textContent = amount.toString()

    const cartButton = document.querySelector<HTMLElement>('.header__cart-button')
    if (!cartButton) return

    cartButton.dataset.count = amount.toString()
    cartButton.classList.toggle('header__with-counter--hidden', amount <= 0)
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
        const dataEl = element.querySelector<HTMLElement>(`[data-${camelCaseToKebab(key)}]`)
        if (!dataEl) return

        if (dataEl instanceof HTMLImageElement) {
            return (dataEl.src = value)
        }

        const isPriceValue = key === 'totalPrice' || key === 'discountPrice' || key === 'pricePerItem'
        if (isPriceValue) {
            return (dataEl.textContent = formatPrice(value))
        }

        if (key === 'stock' && value) {
            dataEl.style.display = 'block'
            dataEl.textContent = `наличие: ${value} шт`
            element.querySelector<HTMLElement>('[data-preorder]')!.style.display = 'none'
            return
        }

        dataEl.textContent = value.toString()
    })
}

/** Создание товара */
function createProduct(product: Product) {
    const productLayout = document.querySelector('.cart__product-layout')
    if (!productLayout) return ''

    const productElement = productLayout.cloneNode(true) as HTMLElement
    productElement.classList.remove('cart__product-layout')
    productElement.dataset.id = product.id.toString()
    const removeButton = productElement.querySelector('[data-remove]')
    removeButton?.addEventListener('click', () => removeItem(product.id))
    updateProductData(product, productElement)

    return productElement
}

/** Инициализация */
function init() {
    const shareButton = document.querySelector<HTMLButtonElement>('.cart__share')
    shareButton?.addEventListener('click', shareLink)

    const circleContainer = document.querySelector('.cart__info-trigger-circle')
    if (!circleContainer) return
    createSVGCircle(circleContainer)

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
        document.querySelector('.cart__empty')?.classList.add('hidden')
    }

    list.forEach((item) => {
        const itemInCart = document.querySelector<HTMLElement>(`.cart__list-product[data-id='${item.id}']`)

        if (itemInCart) {
            updateProductData(item, itemInCart, true)
        } else {
            cartList?.append(createProduct(item))
        }
    })

    //window.order.showProductsImages()
    stickyInfo()
    updateAmount()
}

function setItems(list: Product[]) {
    clear()
    addItems(list)
}

function setInfo(info: CartInfo) {
    const priceEl = document.querySelector('.cart__info-price')
    Object.entries(info).forEach(([key, value]) => {
        switch (key) {
            case 'totalPrice':
                priceEl!.setAttribute('data-total-price', `${info.totalPrice}`)
                priceEl!.querySelector('.cart__info-price-total')!.textContent = formatPrice(value)
                break
            case 'discountPrice':
                const discountPriceEl = document.createElement('div')
                discountPriceEl.classList.add('cart__info-price-discount')
                discountPriceEl.textContent = formatPrice(value)
                priceEl!.append(discountPriceEl)
                break
            case 'deliveryPrice':
                const deliveryEl = document.querySelector('.cart__info-delivery span')
                deliveryEl!.textContent = value
                break
            case 'weight':
                const weightEl = document.querySelector('.cart__info-weight span')
                weightEl!.textContent = value + ' кг'
                break
        }
    })
    updateTrigger(info.totalPrice)
}

function removeItem(id: Product['id']) {
    const products = document.querySelectorAll<HTMLElement>('.cart__list .cart__list-product')
    products.forEach((product) => {
        if (id.toString() === product.dataset.id) {
            product.remove()
        }
    })
    stickyInfo()
    updateAmount()
}

function clear() {
    document.querySelectorAll('.cart__list .cart__list-product').forEach((product) => product.remove())
}

const notificationEl = {
    _: document.querySelector<HTMLElement>('.cart-notification'),
    img: document.querySelector<HTMLImageElement>('img.cart-notification__image'),
    text: document.querySelector<HTMLElement>('.cart-notification__text'),
}

notificationEl._?.addEventListener('click', () => notificationEl._?.classList.remove('active'))

function showNotification(props: CartNotification) {
    if (!notificationEl._ || !notificationEl.img || !notificationEl.text) {
        throw new Error(
            'Document do not have `.cart-notification`, `img.cart-notification__image` or `.cart-notification__text`',
        )
    }

    notificationEl.img.src = props.image
    notificationEl.text.innerText = props.name

    notificationEl._.classList.add('active')
    setTimeout(() => notificationEl._?.classList.remove('active'), 2000)
}

window.cart = {
    addItems,
    setItems,
    setInfo,
    removeItem,
    clear,
    amount: 0,
    showNotification,
}

init()
updateAmount()

window.cart.setItems(testProducts)
window.cart.setInfo({
    totalPrice: 89898,
    discountPrice: 12121,
    deliveryPrice: '500',
    weight: 1,
})
