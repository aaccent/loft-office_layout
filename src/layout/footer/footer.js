import { adaptive } from 'globals/adaptive'

document.querySelectorAll('[data-action="scroll-top"]').forEach((button) => {
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, left: 0 })
    })
})

document.querySelectorAll('.footer__menu-category').forEach((category) => {
    const button = category.querySelector('.footer__menu-category-title')

    button.addEventListener('click', () => {
        if (adaptive.isDesktop) return

        category.classList.toggle('opened')
    })
})
