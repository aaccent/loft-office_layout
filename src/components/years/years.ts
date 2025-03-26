import Swiper from 'swiper'

void (function () {
    const yearsSlider = document.querySelector<HTMLElement>('.years__slider.swiper')
    if (!yearsSlider) return

    new Swiper(yearsSlider, {
        slidesPerView: 1,
    })
})()
