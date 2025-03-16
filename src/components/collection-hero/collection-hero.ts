import { formatPrice } from 'features/formatPrice'

interface ProductPointElement extends HTMLElement {
    dataset: {
        title: string
        size: string
        color: string
        price: string
        priceDiscount: string | undefined
        isFavorite: string | undefined
        image: string | undefined
        stock: string | undefined
    }
}

type ProductInfoCardDataItems =
    | 'data-img'
    | 'data-title'
    | 'data-size'
    | 'data-color'
    | 'data-stock'
    | 'data-preorder'
    | 'data-price-per-item'
    | 'data-total-price'
    | 'data-discount-price'

const productInfoCard = document.querySelector('.collection-hero__product-info-card')
const mainSlider = document.querySelector('.collection-hero__main-slider')

function setProductInfoCardData(field: ProductInfoCardDataItems, value: string) {
    if (!productInfoCard) return

    const dataEl = productInfoCard.querySelector<HTMLElement>(`[${field}]`)
    if (!dataEl) return

    if (dataEl instanceof HTMLImageElement) {
        return (dataEl.src = value)
    }

    const priceValue =
        field === 'data-total-price' || field === 'data-discount-price' || field === 'data-price-per-item'
    if (priceValue) {
        return (dataEl.textContent = value)
    }

    if (field === 'data-stock' && parseInt(value)) {
        dataEl.style.display = 'block'
        dataEl.textContent = `наличие: ${value} шт`
        productInfoCard.querySelector<HTMLElement>('[data-preorder]')!.style.display = 'none'
        return
    } else if (field === 'data-stock' && !parseInt(value)) {
        dataEl.style.display = 'none'
        productInfoCard.querySelector<HTMLElement>('[data-preorder]')!.style.display = 'flex'
        return
    }

    return (dataEl.textContent = value.toString())
}

function clearProductInfoCard() {
    if (!productInfoCard) return

    setProductInfoCardData('data-img', '')
    setProductInfoCardData('data-title', '')
    setProductInfoCardData('data-size', '')
    setProductInfoCardData('data-color', '')
    setProductInfoCardData('data-stock', '0')
    setProductInfoCardData('data-total-price', '0')
    setProductInfoCardData('data-discount-price', '0')
}

function fillProductInfoCardFromPoint(point: ProductPointElement) {
    setProductInfoCardData('data-img', point.dataset.image || '')
    setProductInfoCardData('data-total-price', point.dataset.price || '0')
    setProductInfoCardData('data-discount-price', point.dataset.priceDiscount || '0')
    setProductInfoCardData('data-stock', point.dataset.stock || '0')
    setProductInfoCardData('data-color', point.dataset.color)
    setProductInfoCardData('data-size', point.dataset.size)
    setProductInfoCardData('data-title', point.dataset.title)
}

function timer(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

document.querySelectorAll<ProductPointElement>('.collection-hero__point').forEach((point) => {
    point.addEventListener('click', async () => {
        if (!productInfoCard || !mainSlider) return

        if (point.classList.contains('active')) {
            point.classList.remove('active')

            await timer(310)

            clearProductInfoCard()
            mainSlider.prepend(productInfoCard)
        } else {
            fillProductInfoCardFromPoint(point)
            point.append(productInfoCard)

            await timer(10)

            document.querySelector('.collection-hero__point.active')?.classList.remove('active')
            point.classList.add('active')
        }
    })
})
