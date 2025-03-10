import { validateTelInput } from 'features/forms'

type FinalInfo = {
    inn: string
    kpp: string
    address: string
    name: string
    tel: string
    email: string
}

interface FinalInfoElement extends HTMLElement {
    dataset: { input: keyof FinalInfo }
}

void (function () {
    function setUserData(userType: string) {
        const userDataInputs = document.querySelectorAll<HTMLInputElement>('.user-data .input')
        userDataInputs.forEach((input) => {
            const inputUserType = input.dataset.userType
            if (inputUserType?.includes(userType)) {
                input.classList.add('_active')
            } else {
                input.classList.remove('_active')
            }
        })
    }

    /**TODO: Кнопка отправки формы должна появляться на последнем шаге - способ доставки или метод оплаты*/
    const userTypeInputs = document.querySelectorAll<HTMLInputElement>('.user-type input')
    userTypeInputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement
            const activeUserType = target.value
            setUserData(activeUserType)

            const orderButton = document.querySelector<HTMLButtonElement>('.order__button')
            console.log(orderButton)
            if (!orderButton) return

            if (activeUserType !== 'private') {
                const deliveryMethodStep = document.querySelector('.order-step:has(.delivery-method)')
                deliveryMethodStep?.append(orderButton)
            }
        })
    })

    function openNextStep(currentStepElement: HTMLElement) {
        const currentStep = currentStepElement.closest<HTMLElement>('.order-step')
        if (currentStep?.querySelector('.order__button')) return

        currentStep?.classList.remove('_opened')
        currentStep?.nextElementSibling?.classList.add('_opened')
    }

    function openCheckedStep(e: MouseEvent) {
        const changeStepButton = e.target as HTMLElement
        const step = changeStepButton.closest<HTMLElement>('.order-step')
        const userData = step?.querySelector<HTMLElement>('.user-data')
        const currentOpenStep = document.querySelector<HTMLElement>('.order-step._opened')

        currentOpenStep?.classList.remove('_opened')
        step?.classList.add('_opened')
        if (userData) userData.classList.remove('_valid')
    }

    function setFinalUserInfo(info: FinalInfo) {
        const userData = document.querySelector<HTMLElement>('.user-data')
        const finalInfoElements = document?.querySelectorAll<FinalInfoElement>('.user-data__final div')

        userData?.classList.add('_valid')

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
        const requireUserInputs = document.querySelectorAll<HTMLInputElement>('.user-data__inputs .input._active input')

        const fullName: string[] = ['']
        const finalInfo: FinalInfo = {
            name: '',
            email: '',
            tel: '',
            kpp: '',
            inn: '',
            address: '',
        }

        requireUserInputs.forEach((input) => {
            if (!input.value || !validateTelInput(input)) {
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
                case 'kpp':
                    finalInfo.kpp = input.value
                    break
                case 'inn':
                    finalInfo.inn = input.value
                    break
                case 'address':
                    finalInfo.address = input.value
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
