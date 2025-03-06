document.querySelectorAll<HTMLElement>('.products-showcase__switch-button').forEach((button) => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab || ''
        const tab = document.querySelector(`.products-showcase__list[data-tab="${tabName}"]`)

        if (!tab) return

        document.querySelector('.products-showcase__switch-button.active')?.classList.remove('active')
        document.querySelector('.products-showcase__list.active')?.classList.remove('active')

        button.classList.add('active')
        tab.classList.add('active')
    })
})
