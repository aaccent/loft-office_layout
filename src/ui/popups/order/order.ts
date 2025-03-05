import { disableScroll } from 'features/scroll'
import { validateTelInput } from 'features/forms'

type FinalInfo = {
    name: string
    tel: string
    email: string
}

interface FinalInfoElement extends HTMLElement {
    dataset: { input: keyof FinalInfo }
}

void (function () {
    disableScroll()

    function openNextStep(targetEl: HTMLElement) {
        const currentStep = targetEl.closest<HTMLElement>('.order-step')
        if (currentStep?.querySelector('.payment-method')) return

        currentStep?.classList.remove('_opened')
        currentStep?.nextElementSibling?.classList.add('_opened')
    }

    function openCheckedStep(e: MouseEvent) {
        const changeStepButton = e.target as HTMLElement
        const step = changeStepButton.closest<HTMLElement>('.order-step')
        const currentOpenStep = document.querySelector<HTMLElement>('.order-step._opened')

        currentOpenStep?.classList.remove('_opened')
        step?.classList.add('_opened')
    }

    function setFinalUserInfo(info: FinalInfo) {
        const userData = document.querySelector<HTMLElement>('.user-data')
        const finalInfoElements = document?.querySelectorAll<FinalInfoElement>('.user-data__final div')

        userData?.classList.add('valid')

        finalInfoElements?.forEach((el) => {
            const key = el.dataset.input
            el.textContent = info[key]
        })
    }

    const radioInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    radioInputs.forEach((input) => {
        input.addEventListener('click', () => openNextStep(input))
    })

    const userDataButton = document.querySelector<HTMLButtonElement>('.order-step .user-data__button')

    userDataButton?.addEventListener('click', () => {
        const userDataRequiredInputs = document.querySelectorAll<HTMLInputElement>('.user-data__inputs input')
        const fullName: string[] = ['']
        const finalInfo: FinalInfo = {
            name: '',
            email: '',
            tel: '',
        }

        userDataRequiredInputs.forEach((input) => {
            if (!input.validity.valid || !validateTelInput(input)) {
                input.classList.add('invalid')
                return
            }

            switch (input.name) {
                case 'name':
                    fullName[1] = input.value
                    break
                case 'last-name':
                    fullName[0] = input.value
                    break
                case 'middle-name':
                    fullName[2] = input.value
                    break
                case 'tel':
                    finalInfo.tel = input.value
                    break
                case 'email':
                    finalInfo.email = input.value
                    break
            }
        })

        const invalids = document.querySelectorAll('.order-step input.invalid')
        if (invalids.length) return

        finalInfo.name = fullName.join(' ')
        openNextStep(userDataButton)
        setFinalUserInfo(finalInfo)
    })

    const changeStepButtons = document.querySelectorAll<HTMLElement>('.order-step__change-button')
    changeStepButtons.forEach((button) => button.addEventListener('click', openCheckedStep))

    const firstStep = document.querySelector<HTMLElement>('.order-step:nth-child(1)')
    firstStep?.classList.add('_opened')
})()
