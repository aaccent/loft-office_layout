import Swiper from 'swiper'
import { EffectFade, Navigation, Pagination } from 'swiper/modules'

export function createContentSwiper() {
    const content = document.querySelector('.content')

    const imageGroup = content.querySelectorAll('div:has(img+img)')
    imageGroup.forEach((group) => {
        group.classList.add('swiper')

        const swiperWrapper = document.createElement('div')
        swiperWrapper.classList.add('swiper-wrapper')

        group.querySelectorAll('img').forEach((img) => {
            img.classList.add('swiper-slide')
            swiperWrapper.append(img)
        })
        group.append(swiperWrapper)

        const navigation = document.createElement('div')
        navigation.classList.add('navigation')

        const prev = document.createElement('button')
        const next = document.createElement('button')
        prev.classList.add('navigation--prev')
        next.classList.add('navigation--next')

        navigation.append(prev, next)

        const pagination = document.createElement('div')
        pagination.classList.add('pagination')

        group.append(navigation, pagination)

        new Swiper(group, {
            modules: [EffectFade, Pagination, Navigation],
            effect: 'fade',
            fadeEffect: { crossFade: true },
            slidesPerView: 1,
            pagination: {
                el: '.swiper .pagination',
            },
            breakpoints: {
                1000: {
                    navigation: {
                        nextEl: '.swiper .navigation--next',
                        prevEl: '.swiper .navigation--prev',
                    },
                },
            },
        })
    })
}
