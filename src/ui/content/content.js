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

function getCoords(element) {
    const rect = element.getBoundingClientRect()
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY }
}

void (function () {
    const tocList = document.querySelector('.article__toc-list')
    const PERCENT_15_WINDOW = window.innerWidth * 0.1

    if (!tocList) return

    const headings = document.querySelectorAll('.article__content h2')
    headings.forEach((header) => {
        const coords = getCoords(header)
        const scrollToCoords = { left: 0, top: coords.y - PERCENT_15_WINDOW }

        const listItem = document.createElement('li')
        listItem.className = 'article__toc-list-item'

        const button = document.createElement('button')
        button.innerText = header.innerText
        button.onclick = () => window.scrollTo(scrollToCoords)
        listItem.append(button)

        tocList.append(listItem)
    })
})()
