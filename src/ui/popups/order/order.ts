import { disableScroll } from 'features/scroll'

interface FinalInfo {
    name: string
    tel: string
    email: string
}

void (function () {
    disableScroll()

    function openNextStep(targetEl: HTMLElement) {
        const currentStep = targetEl.closest<HTMLElement>('.order-step')
        if (currentStep?.querySelector('.payment-method')) return

        currentStep?.classList.remove('_opened')
        currentStep?.nextElementSibling?.classList.add('_opened')
    }

    function setFinalUserInfo(info: FinalInfo) {
        const userDataStep = document.querySelector<HTMLElement>('.order-step .user-data')
        const finalInfoElements = userDataStep?.querySelectorAll<HTMLElement>('.user-data__final div')

        userDataStep?.classList.add('valid')
    }

    const radioInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    radioInputs.forEach((input) => {
        input.addEventListener('click', () => openNextStep(input))
    })

    const userDataButton = document.querySelector<HTMLButtonElement>('.order-step .user-data__button')

    userDataButton?.addEventListener('click', () => {
        const userDataRequiredInputs = document.querySelectorAll<HTMLInputElement>('.user-data__inputs input')
        const invalidInputs: HTMLElement[] = []

        const fullName: string[] = []

        // const invalidInputs = userDataRequiredInputs.filter((input) => !input.validity.valid)
        // if (!invalidInputs.length) {
        //     openNextStep(userDataButton)
        //     //setFinalUserInfo()
        //     return
        // }

        userDataRequiredInputs.forEach((input) => {
            input.addEventListener('input', () => input.classList.remove('invalid'), { once: true })
            if (!input.validity.valid) {
                input.classList.add('invalid')
                invalidInputs.push(input)
                return
            }
            switch (input.name) {
                case 'name':
                    fullName[1] = input.name
                    break
                case 'last-name':
                    fullName[0] = input.name
                    break
                case 'middle-name':
                    fullName[2] = input.name
                    break
            }
        })
    })

    const firstStep = document.querySelector<HTMLElement>('.order-step:first-child')
    firstStep?.classList.add('_opened')
})()
