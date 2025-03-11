document.querySelectorAll('.selector').forEach((selector) => {
    const itemInputs = selector.querySelectorAll<HTMLInputElement>('.selector__item-input')
    const button = selector.querySelector<HTMLElement>('.selector__button')

    if (!itemInputs.length || !button) return

    button.innerText = itemInputs[0].dataset.showValue || ''
    button.addEventListener('click', () => selector.classList.toggle('opened'))
    itemInputs[0].checked = true

    itemInputs.forEach((input) => {
        input.addEventListener('change', () => {
            button.innerText = input.dataset.showValue || ''
        })
    })
})
