void (function () {
    const authorizationTel = document.querySelector('.authorization-tel')
    const authorizationCode = document.querySelector('.authorization-code')
    if (!authorizationTel || !authorizationCode) return

    const changeTelButton = authorizationCode.querySelector('.authorization-code__change-number-button')
    const codeInputs = authorizationCode.querySelectorAll('.authorization-code__input')

    authorizationTel.addEventListener('form-sent', () => {
        authorizationCode.classList.add('_visible')
        setTimeout(() => codeInputs[0].focus(), 100)

        codeInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('_code')
                    if (index === codeInputs.length - 1) return
                    input.nextElementSibling.focus()
                } else {
                    input.classList.remove('_code')
                    if (index === 0) return
                    input.previousElementSibling.focus()
                }
            })
        })

        const telNumber = authorizationTel.querySelector('.authorization-tel__input').value
        const authorizationNumber = authorizationCode.querySelector('.authorization__number')
        authorizationNumber.textContent = ' ' + telNumber

        const getCodeButton = authorizationCode.querySelector('.authorization-code__get-code-button')
        getCodeButton.onclick = () => getCodeButton.classList.remove('_visible')

        const getCodeTimer = authorizationCode.querySelector('.authorization-code__timer')

        const time = getCodeTimer.querySelector('.authorization-code__timer span')
        const getNewCodeIn = 60
        time.textContent = ` ${getNewCodeIn} сек.`

        let timer = setTimeout(function tick() {
            if (parseInt(time.textContent) === 1) {
                clearTimeout(timer)
                getCodeButton.classList.add('_visible')
            } else {
                time.textContent = ` ${parseInt(time.textContent) - 1} сек.`
                timer = setTimeout(tick, 1000)
            }
        }, 1000)
    })

    changeTelButton.onclick = () => {
        codeInputs.forEach((input) => (input.value = ''))
        authorizationCode.classList.remove('_visible')
    }
})()
