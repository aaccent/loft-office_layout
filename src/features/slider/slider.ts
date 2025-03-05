export interface SlideElement extends HTMLElement {
    dataset: {
        index: string
    }
}

export interface SlideChangedEventDetail {
    slide: SlideElement
}

type SlideChangedEvent = CustomEvent<SlideChangedEventDetail>

type SlideChangedAddEventListener = (
    type: 'slide-changed',
    listener: (this: HTMLElement, ev: SlideChangedEvent) => void,
) => void

export type SliderElement = HTMLElement & {
    addEventListener: HTMLElement['addEventListener'] & SlideChangedAddEventListener
}

class Slider {
    element: HTMLElement

    activeSlideIndex: number = 0
    activeSlideEl!: SlideElement
    slides: NodeListOf<SlideElement>
    lastSlideIndex: number
    SLIDE_CHANGED_EVENT_NAME = 'slide-changed'

    autoplayId: number | null = null
    autoplayCounter = 0
    AUTOPLAY_TIME_MS = 4000
    AUTOPLAY_STEP_MS = 25

    bulletContainer: HTMLElement | null

    constructor(element: HTMLElement) {
        this.element = element
        this.bulletContainer = element.querySelector('.slider__pagination')
        this.slides = element.querySelectorAll<SlideElement>('.slider__item')
        this.lastSlideIndex = this.slides.length - 1

        this.initSlides()
        this.setActiveSlide(0)
        this.initControls()
        this.initAutoplay()
    }

    createBullet(index: number) {
        if (!this.bulletContainer) return

        const bullet = document.createElement('span')
        bullet.className = 'slider__bullet'
        bullet.dataset.index = index.toString()

        this.bulletContainer.append(bullet)
    }

    initSlides() {
        this.slides.forEach((slide, index) => {
            slide.dataset.index = index.toString()

            this.createBullet(index)
        })
    }

    initControls() {
        const prevButton = this.element.querySelector('.slider__slide-button--prev')
        const nextButton = this.element.querySelector('.slider__slide-button--next')

        prevButton?.addEventListener('click', () => this.switchSlide(-1))
        nextButton?.addEventListener('click', () => this.switchSlide(1))
    }

    setActiveSlide(index: number) {
        let newSlideIndex = index
        if (newSlideIndex >= this.slides.length) newSlideIndex = 0
        if (newSlideIndex < 0) newSlideIndex = this.lastSlideIndex

        if (!this.slides[newSlideIndex]) return

        this.activeSlideIndex = newSlideIndex
        this.activeSlideEl = this.slides[newSlideIndex]

        this.element.querySelector('.slider__item.active')?.classList.remove('active')
        this.activeSlideEl.classList.add('active')

        this.bulletContainer?.querySelector('.slider__bullet.active')?.classList.remove('active')
        this.bulletContainer?.querySelector(`.slider__bullet[data-index="${newSlideIndex}"]`)?.classList.add('active')

        const event = new CustomEvent<SlideChangedEventDetail>(this.SLIDE_CHANGED_EVENT_NAME, {
            detail: {
                slide: this.activeSlideEl,
            },
        })

        this.element.dispatchEvent(event)
    }

    switchSlide(mod: 1 | -1) {
        let newSlideIndex = this.activeSlideIndex + mod

        this.setActiveSlide(newSlideIndex)
    }

    autoplayTimer() {
        if (!this.autoplayId) return

        if (this.autoplayCounter >= this.AUTOPLAY_TIME_MS) {
            this.autoplayCounter = 0
            this.switchSlide(1)
        }

        this.autoplayCounter += this.AUTOPLAY_STEP_MS
    }

    initAutoplay() {
        this.autoplayId = setInterval(() => this.autoplayTimer(), this.AUTOPLAY_STEP_MS)
    }
}

document.querySelectorAll<HTMLElement>('.slider').forEach((slider) => new Slider(slider))
