import { SlideElement, SliderElement } from 'features/slider/slider'

type MainHeroSlideElement = SlideElement & {
    dataset: {
        title: string
        subtitle: string
        link: string
        text: string
    }
}

const title = document.querySelector('.main-hero__title')
const subtitle = document.querySelector('.main-hero__subtitle')
const anchor = document.querySelector<HTMLAnchorElement>('a.main-hero__button')
const text = document.querySelector('.main-hero__text')

document.querySelector<SliderElement>('.main-hero .slider')?.addEventListener('slide-changed', (event) => {
    const slide = event.detail.slide as MainHeroSlideElement

    if (title) title.innerHTML = slide.dataset.title || ''
    if (subtitle) subtitle.innerHTML = slide.dataset.subtitle || ''
    if (anchor) anchor.href = slide.dataset.link || ''
    if (text) text.innerHTML = slide.dataset.text || ''
})
