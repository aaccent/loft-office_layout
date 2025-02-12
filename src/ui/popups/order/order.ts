import { disableScroll } from 'features/scroll'

void (function () {
    disableScroll()
})()

document.querySelector<HTMLInputElement>('.user-type__list input')?.addEventListener('change', (e) => {
    console.log(e.target)
})
