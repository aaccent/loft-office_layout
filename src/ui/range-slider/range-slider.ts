interface RangeElement extends HTMLElement {
    dataset: {
        min: string
        max: string
        isPrice: string | undefined
    }
}

interface RangeInputElement extends HTMLInputElement {
    dataset: {
        num: string
        mask: string
    }
}

type Key = 'from' | 'to'

class RangeSlider {
    el: RangeElement
    limit = { from: 0, to: 500000 }
    offset: number
    onePercent: number
    value = { from: 0, to: 500000 }
    isPrice: boolean

    // Input
    input = {} as { from: RangeInputElement; to: RangeInputElement }
    priceFormatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

    // Track, line and thumbs
    thumb = {} as { from: HTMLElement; to: HTMLElement }
    thumbOffsetPx = { from: 0, to: 0 }
    line!: HTMLElement
    track!: HTMLElement
    trackWidth!: number
    trackWidthOnePercent!: number
    draggedThumb: null | HTMLElement = null

    constructor(rangeElement: RangeElement) {
        this.el = rangeElement
        this.isPrice = typeof this.el.dataset.isPrice === 'string' && this.el.dataset.isPrice !== 'false'

        this.limit.from = +rangeElement.dataset.min
        this.limit.to = +rangeElement.dataset.max
        this.offset = this.limit.from
        this.onePercent = (this.limit.to - this.offset) * 0.01

        this.initInputs()
        this.initTrack()
        this.initThumbs()
        this.initLine()
    }

    /** Если `number` является числом, то возвращает его, иначе `fallback` */
    numberWithFallback(number: number | undefined | null, fallback: number) {
        return typeof number === 'number' ? number : fallback
    }

    boundsValue(value: number) {
        if (value < this.limit.from) value = this.limit.from
        if (value > this.limit.to) value = this.limit.to
        return value
    }

    initTrack() {
        const track = this.el.querySelector<HTMLElement>('.range-slider__track')
        if (!track) throw new Error('У .range-slider нет .range-slider__track')

        this.track = track
        this.trackWidth = track.offsetWidth
        this.trackWidthOnePercent = track.offsetWidth * 0.01
    }

    initThumb(key: Key) {
        const thumb = this.el.querySelector<HTMLElement>(`.range-slider__thumb--${key}`)
        if (!thumb) throw new Error(`У .range-slider нет .range-slider__thumb--${key}`)

        thumb.addEventListener('mousedown', () => (this.draggedThumb = thumb))

        this.thumb[key] = thumb
        this.thumbOffsetPx[key] = (this.trackWidth * (this.value[key] / this.onePercent)) / 100
    }

    initThumbs() {
        document.addEventListener('mouseup', () => {
            this.draggedThumb = null
            document.body.style.cursor = ''
        })
        document.addEventListener('mousemove', (event) => this.thumbDragHandler(event))

        this.initThumb('from')
        this.initThumb('to')

        this.setThumb('from')
        this.setThumb('to')
    }

    thumbDragHandler(event: MouseEvent) {
        if (!this.draggedThumb) return
        document.body.style.cursor = 'grabbing'

        const rightLimit = this.track.getBoundingClientRect().right - this.track.getBoundingClientRect().left
        let offset = event.clientX - this.track.getBoundingClientRect().left
        if (offset < 0) offset = 0
        if (offset > rightLimit) offset = rightLimit

        const offsetPercent = offset / this.trackWidthOnePercent
        let value = Math.trunc(((this.limit.to - this.offset) * offsetPercent) / 100 + this.offset)

        const key = this.draggedThumb === this.thumb.from ? 'from' : 'to'

        if (key === 'from' && value >= this.value.to) {
            value = this.value.to
        }

        if (key === 'to' && value <= this.value.from) {
            value = this.value.from
        }

        this.value[key] = value
        this.setInputValue(key)
        this.setThumb(key)
        this.setLine()
    }

    initLine() {
        const line = this.el.querySelector<HTMLElement>('.range-slider__line')
        if (!line) throw new Error('У .range-slider нет .range-slider__line')

        this.line = line
        this.setLine()
    }

    initInput(key: Key) {
        const input = this.el.querySelector<RangeInputElement>(`.range-slider__input--${key}`)
        if (!input) throw new Error(`У .range-slider нет .range-slider__input--${key}`)

        input.addEventListener('focus', () => (this.input[key].value = this.value[key].toString()))
        input.addEventListener('input', (event) => this.inputHandler(event as InputEvent, key))
        input.addEventListener('change', () => this.setInputValue(key))
        input.addEventListener('blur', () => this.setInputValue(key))

        this.input[key] = input
        this.value[key] = this.boundsValue(this.numberWithFallback(parseInt(input.dataset.num), this.limit[key]))

        this.setInputValue(key)
    }

    initInputs() {
        this.initInput('from')
        this.initInput('to')
    }

    inputHandler(event: InputEvent, key: Key) {
        let value = parseInt((event.currentTarget as HTMLInputElement).value.replaceAll(/\D/g, ''))
        value = this.boundsValue(value)

        this.value[key] = value
        this.setInputValue(key)
        this.setThumb(key)
        this.setLine()
    }

    setInputValue(key: Key) {
        this.input[key].dataset.num = this.value[key].toString()

        // Если поле в фокусе, то не форматировать его значение
        if (document.activeElement === this.input[key]) return

        const priceFormatted = this.isPrice ? this.priceFormatter.format(this.value[key]) : this.value[key]
        this.input[key].value = this.input[key].dataset.mask.replace('%d', priceFormatted.toString())
    }

    setThumb(key: Key) {
        const leftOffsetInPercents = Math.trunc((this.value[key] - this.offset) / this.onePercent)
        let leftOffsetInPixels = Math.trunc((this.trackWidth * leftOffsetInPercents) / 100)

        // Если ползунок будет "прибит" к левому краю, то нужно исключить его ширину
        if (key === 'to') {
            leftOffsetInPixels -= this.thumb.to.offsetWidth
        }

        // Если левый ползунок будет впритык к правому, то добавляем между ними 2px
        if (key === 'from' && leftOffsetInPixels >= this.thumbOffsetPx.to) {
            leftOffsetInPixels -= this.thumb.to.offsetWidth + 2
        }

        // Если правый ползунок будет впритык к левому, то добавляем между ними 2px
        if (key === 'to' && leftOffsetInPixels <= this.thumbOffsetPx.from) {
            leftOffsetInPixels += this.thumb.from.offsetWidth + 2
        }

        this.thumb[key].style.left = `${leftOffsetInPixels / this.trackWidthOnePercent}%`
    }

    setLine() {
        this.line.style.left = this.thumb.from.style.left
        this.line.style.right = `${100 - parseInt(this.thumb.to.style.left) - 0.6}%`
    }
}

document.querySelectorAll<RangeElement>('.range-slider').forEach((range) => new RangeSlider(range))
