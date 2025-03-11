document.querySelectorAll('.selector').forEach((selector) => {
    const itemInputs = selector.querySelectorAll<HTMLInputElement>('.selector__item-input')
    const button = selector.querySelector<HTMLElement>('.selector__button')
    const closeButton = selector.querySelector('.close-btn')

    if (!itemInputs.length || !button) return

    button.innerText = itemInputs[0].dataset.showValue || ''
    button.addEventListener('click', () => selector.classList.toggle('opened'))
    closeButton?.addEventListener('click', () => selector.classList.remove('opened'))
    selector.addEventListener('click', (event) => {
        if (event.target !== selector) return
        selector.classList.remove('opened')
    })

    itemInputs[0].checked = true

    itemInputs.forEach((input) => {
        input.addEventListener('change', () => {
            button.innerText = input.dataset.showValue || ''
        })
    })
})
