import Swiper from 'swiper'
import { Pagination, EffectFade } from 'swiper/modules'
import { adaptive } from 'globals/adaptive'

function initProductCard(cardTop: HTMLElement, slides: HTMLElement[], swiper: Swiper) {
    const hoverContainer = document.createElement('div')
    hoverContainer.className = 'product-card__hover-container'

    slides.forEach((_, index) => {
        const hoverItem = document.createElement('div')
        hoverItem.className = 'product-card__hover-item'
        hoverItem.addEventListener('mouseenter', () => {
            swiper.slideTo(index)
        })

        hoverContainer.append(hoverItem)
    })

    cardTop.prepend(hoverContainer)
}

new Swiper('.product-card .swiper', {
    createElements: true,
    slidesPerView: 'auto',
    effect: 'fade',
    pagination: {
        enabled: true,
        modifierClass: 'slider-pagination-',
        bulletClass: 'slider-pagination-bullet',
        bulletActiveClass: 'slider-pagination-bullet-active',
    },
    modules: [Pagination, EffectFade],
    on: {
        init(swiper) {
            if (adaptive.isDesktop) return

            initProductCard(swiper.el, swiper.slides, swiper)
        },
    },
})
