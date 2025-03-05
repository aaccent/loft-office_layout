const dataInputs = document.querySelectorAll('.input')

dataInputs.forEach((container) => {
    const input = container.querySelector('input')
    if (input.value) container.classList.add('process')
    const inputTel = container.querySelector('input[type="tel"]')

    const resetButton = document.createElement('button')
    resetButton.classList.add('input__reset')
    resetButton.addEventListener('click', () => {
        input.value = ''
        container.classList.remove('process')
    })
    container.append(resetButton)

    const error = document.createElement('div')
    error.classList.add('input__error')
    error.textContent = 'ошибка'
    container.append(error)

    input.addEventListener('focus', () => {
        input.classList.remove('invalid')
        container.classList.add('process')
    })

    input.addEventListener('blur', () => {
        if (input.value) return
        container.classList.remove('process')
    })
})
