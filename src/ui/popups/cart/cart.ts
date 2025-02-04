import { Cart, CartInfo, Product } from '@/types'
import { formatPrice } from 'features/formatPrice'

const products: Product[] = [
    {
        id: 1,
        title: 'Стол для руководителя Brooklyn',
        img: 'assets/content/products/1.png',
        size: '120 × 80 × 174 см ',
        color: 'Канадский Дуб',
        totalPrice: 18000,
        //discountPrice: 17200,
        pricePerItem: 4300,
        stock: 8,
        amount: 1,
    },
    {
        id: 2,
        title: 'Стул для руководителя Brooklyn',
        img: 'assets/content/products/2.png',
        size: '120 × 80 × 174 см ',
        color: 'Ткань',
        totalPrice: 25000,
        discountPrice: 23000,
        pricePerItem: 3100,
        stock: 0,
        amount: 1,
    },
    {
        id: 3,
        title: 'Стол для руководителя Brooklyn',
        img: 'assets/content/products/3.png',
        size: '120 × 80 × 174 см ',
        color: 'Канадский Дуб',
        totalPrice: 17200,
        discountPrice: 18000,
        pricePerItem: 4300,
        stock: 5,
        amount: 3,
    },
]

void (function () {
    document.querySelector('.popup.cart')!.classList.add('opened')
    document.documentElement.style.overflow = 'clip'
    document.body.style.overflow = 'clip'
    const html = document.documentElement
    document.body.style.paddingRight = `${window.innerWidth - html.offsetWidth}px`
    html.classList.add('disable-scroll')
})()

// функционал поделиться
function share(e: MouseEvent) {
    if (e.target !== e.currentTarget || !e.target) return
    const element = e.target as HTMLElement

    const link = element.dataset.link
    if (!link) return
    window.navigator.clipboard.writeText(link)

    const tooltip = element.querySelector('.cart__share-tooltip')
    if (!tooltip) return
    tooltip.classList.add('visible')

    const timeout = setTimeout(() => tooltip.classList.remove('visible'), 3000)

    tooltip.addEventListener(
        'click',
        () => {
            tooltip.classList.remove('visible')
            clearTimeout(timeout)
        },
        true,
    )
}
const shareButton = document.querySelector<HTMLButtonElement>('.cart__share')
shareButton!.addEventListener('click', share)

//функционал при скроле
function fixInfo() {
    const productsAmountInCart = document.querySelectorAll('.cart-list__product').length
    if (productsAmountInCart < 3) return

    const cartInfo = document.querySelector('.cart-info')
    const cartInfoFixed = document.querySelector('.cart-info__fixed')

    if (!cartInfo || !cartInfoFixed) return

    const observer = new IntersectionObserver(([entries]) => {
        if (entries.isIntersecting) cartInfoFixed.classList.remove('visible')
        else {
            cartInfoFixed.classList.add('visible')
        }
    })
    observer.observe(cartInfo)
}

function setTrigger() {
    const triggerBlock = document.querySelector<HTMLElement>('.cart-info__discount')
    const priceBlock = document.querySelector<HTMLElement>('.cart-info__price')
    console.log({ triggerBlock, priceBlock })
    if (!triggerBlock || !priceBlock) return

    const priceForDiscount = Number(triggerBlock.dataset.priceForDiscount)
    const totalPrice = Number(priceBlock.dataset.totalPrice)
    const orderForDiscount = priceForDiscount - totalPrice
    if (orderForDiscount > 0) {
        triggerBlock.classList.add('trigger')
        triggerBlock.querySelector('.cart-info__discount-action span')!.textContent =
            ` ${formatPrice(orderForDiscount)}`
    }
}

function addItems(list: Product[]) {
    const cartList = document.querySelector('.cart-list')
    if (!cartList) return
    list.forEach((item) => {
        const productElement = document.createElement('div')
        productElement.classList.add('cart-list__product')
        productElement.setAttribute('data-id', `${item.id}`)
        productElement.innerHTML = `
                <img class="cart-list__product-img" src=${item.img} alt="">
                <div class="cart-list__product-info">
                  <div class="cart-list__product-title">${item.title}</div>
                  <div class="cart-list__product-characteristic"><span class="cart-list__product-size">${item.size}</span><span class="cart-list__product-color">${item.color}</span></div>
                  <div class="cart-list__product-amount"><button class="decrease">-</button><span class="number">${item.amount}</span><button class="increase">+</button></div>
                  <div class="cart-list__product-stock">наличие: ${item.stock} шт</div>
                </div>
                <div class="cart-list__product-price">
                  <div class="cart-list__product-remove"></div>
                  <div class="cart-list__product-price__peritem">${formatPrice(item.pricePerItem)}/шт</div>
                  <div class="cart-list__product-price__container">
                    <div class="cart-list__product-price__total">${formatPrice(item.totalPrice)}</div>
                  </div>
                </div>`
        if (item.discountPrice) {
            const discountPriceEl = document.createElement('div')
            discountPriceEl.classList.add('cart-list__product-price__discount')
            discountPriceEl.textContent = `${formatPrice(item.discountPrice)}`
            productElement.querySelector('.cart-list__product-price__container')!.append(discountPriceEl)
        }

        if (item.stock === 0) {
            productElement.querySelector('.cart-list__product-stock')!.remove()
            const preorderBtn = document.createElement('button')
            preorderBtn.classList.add('cart-list__product-preorder')
            preorderBtn.textContent = 'предзаказ'
            productElement.querySelector('.cart-list__product-info')!.append(preorderBtn)
        }

        cartList.append(productElement)
    })
    fixInfo()
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
        }
    })

    setTrigger()
}

addItems(products)
setInfo({
    totalPrice: 52200,
    discountPrice: 42000,
    weight: 312,
})

export const cart: Cart = {
    addItems,
    removeItem(id: Product['id']) {},
    clear() {},
    setInfo,
}

//функционал заполнения кружочка
function createCircle(container: Element) {
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
    outerCircle.setAttribute('cx', '30')
    outerCircle.setAttribute('cy', '30')
    outerCircle.setAttribute('r', '30')
    outerSvg.append(outerCircle)
    animateCircle(outerSvg)

    container.append(innerSvg)
    container.append(outerSvg)
}

function animateCircle(svgItem: SVGSVGElement) {}

const circleContainer = document.querySelector('.cart-info__discount-circle')
createCircle(circleContainer!)
