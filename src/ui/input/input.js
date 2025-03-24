const dataInputs = document.querySelectorAll('.input')

dataInputs.forEach((container) => {
    const input = container.querySelector('input')

    const resetButton = document.createElement('button')
    resetButton.type = 'button'
    resetButton.classList.add('input__reset')
    resetButton.addEventListener('click', () => {
        input.value = ''
    })
    container.append(resetButton)

    const error = document.createElement('div')
    error.classList.add('input__error')
    error.textContent = 'ошибка'
    container.append(error)

    input.addEventListener('focus', () => {
        input.classList.remove('invalid')
    })

    input.addEventListener('blur', () => {
        if (input.value) return
    })
})
