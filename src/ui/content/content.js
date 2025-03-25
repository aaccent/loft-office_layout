import Swiper from 'swiper'
import { EffectFade, Navigation, Pagination } from 'swiper/modules'

export function createContentSwiper() {
    const imageGroup = document.querySelectorAll('.content div:has(img+img)')
    imageGroup.forEach((group) => {
        group.querySelectorAll('img').forEach((img) => img.classList.add('swiper-slide'))

        new Swiper(group, {
            modules: [EffectFade, Pagination, Navigation],
            effect: 'fade',
            createElements: true,
            fadeEffect: { crossFade: true },
            slidesPerView: 1,
            pagination: {
                enabled: true,
            },
            navigation: {
                enabled: true,
            },
            breakpoints: {
                1000: {
                    pagination: {
                        enabled: false,
                    },
                    navigation: {
                        enabled: true,
                    },
                },
            },
        })
    })
}

void (function () {
    if (!document.querySelector('.article')) return

    createContentSwiper()
})()

document.querySelectorAll('dl').forEach((list) => {
    list.querySelectorAll('dt').forEach((title) => {
        title.addEventListener('click', () => {
            list.querySelector('dt.active')?.classList.remove('active')
            title.classList.toggle('active')
        })
    })
})
