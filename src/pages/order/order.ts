import { validateTelInput } from 'features/forms'
import Swiper from 'swiper'
import { AdditionalPriceInfo, OrderInfo } from '@/types/order'
import { orderInfo } from '@/test-order-info'
import { adaptive } from 'globals/adaptive'

type FinalUserDataInfo = {
    address: string
    name: string
    tel: string
    email: string
}

interface FinalInfoElement extends HTMLElement {
    dataset: { final: keyof FinalUserDataInfo }
}

type User = 'private' | 'commerce' | 'commerce-nds' | 'commerce,commerce-nds'
interface UserTypeInput extends HTMLInputElement {
    value: User
}

/** Определяет поля для показа в форме Личные данные */
function setUserDataForm(userType: User) {
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

/** @param userType если 'private', то кнопка Оплаты появляемся в шаге Методы оплаты. Если другое, то в шаге Методы доставки */
function setSubmitButton(userType: User) {
    const submitButton = document.querySelector<HTMLElement>('.order__button')
    if (!submitButton) return

    submitButton?.classList.remove('_visible')

    if (userType === 'private') {
        document.querySelector('.order-step:has(.payment-method) .order-step__body')?.append(submitButton)
    } else {
        document.querySelector('.order-step:has(.delivery-method) .order-step__body')?.append(submitButton)
    }
}

/** Открытие следующего шага, если в текущем нет кнопки отправки формы */
function openNextStep(currentStepElement: HTMLElement) {
    const currentStep = currentStepElement.closest<HTMLElement>('.order-step')
    currentStep?.classList.add('_valid')
    if (currentStep?.querySelector('.order__button')) return

    currentStep?.classList.remove('_opened')
    currentStep?.nextElementSibling?.classList.add('_opened')
}

/** Проверка валидности полей в шаге Личные данные */
function validateUserData() {
    let valid = true
    const userDataStep = document.querySelector('.user-data')
    const requireUserInputs = userDataStep?.querySelectorAll<HTMLInputElement>('.input._active input')

    const fullName: string[] = ['']
    const finalInfo: FinalUserDataInfo = {
        name: '',
        email: '',
        tel: '',
        address: '',
    }

    requireUserInputs?.forEach((input) => {
        if (!input.value || !validateTelInput(input)) {
            input.classList.add('invalid')
            userDataStep?.classList.remove('_valid')
            valid = false
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
            case 'address':
                finalInfo.address = input.value
                break
        }
    })

    userDataStep?.classList.add('_valid')
    finalInfo.name = fullName.join(' ')
    setFinalUserData(finalInfo)

    return valid
}

/** Открытие/закрытие шага */
function openCloseStep(e: MouseEvent) {
    const target = e.target as HTMLElement
    const targetStep = target.closest('.order-step')

    const stepWithSubmitButton = !!targetStep?.querySelector('.order__button')
    if (stepWithSubmitButton) return

    const userDataStep = !!targetStep?.querySelector('.user-data')
    if (userDataStep) validateUserData()

    const checkedStep = targetStep?.classList.contains('_valid')
    if (!checkedStep) return

    targetStep?.classList.toggle('_opened')
}

/** Заполняет финальные данные ТОЛЬКО для шага Личные данные */
function setFinalUserData(info: FinalUserDataInfo) {
    const finalInfoElements = document.querySelectorAll<FinalInfoElement>('.user-data__final div')

    finalInfoElements?.forEach((el) => {
        const key = el.dataset.final
        el.textContent = info[key]
    })
}

/** Действия при выботе типа покупателя */
function setUserType(input: UserTypeInput) {
    const activeUserType = input.value
    setUserDataForm(activeUserType)
    setSubmitButton(activeUserType)
}

function init() {
    /** Типы покупателей */
    const userTypeInputs = document.querySelectorAll<UserTypeInput>('.user-type input')
    userTypeInputs.forEach((input) => {
        input.addEventListener('change', () => setUserType(input))
    })

    /** Все инпуты с типом radio */
    const radioInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    radioInputs.forEach((input) => {
        input.addEventListener('change', () => openNextStep(input))
    })

    /** Кнопка Далее в шаге Личные данные */
    const userDataButton = document.querySelector<HTMLButtonElement>('.order-step .user-data__button')
    userDataButton?.addEventListener('click', (e) => {
        if (!validateUserData()) return
        const target = e.target as HTMLElement
        openNextStep(target)
    })

    /** Кнопки Изменить */
    const changeStepButton = document.querySelectorAll<HTMLElement>('.order-step__change-button')
    changeStepButton.forEach((button) => {
        button.addEventListener('click', openCloseStep)
    })

    /** Заголовки шагов */
    const stepTitles = document.querySelectorAll<HTMLElement>('.order-step__title')
    stepTitles.forEach((title) => {
        title.addEventListener('click', openCloseStep)
    })

    /** Кнопка закрыть */
    const closeButton = document.querySelector('.order__close')
    closeButton?.addEventListener('click', () => window.history.back())

    const firstStep = document.querySelector<HTMLElement>('.order-step:nth-child(1)')
    firstStep?.classList.add('_opened')

    /** Изменения внешнего вида в мобильном разрешении */
    if (adaptive.isDesktop) return

    /** Кнопка Входа в ЛК */
    void (function () {
        const autorizationButton = document.querySelector('.order__autorization-button')
        if (!autorizationButton) return

        autorizationButton.textContent = 'уже есть акаунт? войти'
        const stepBody = autorizationButton.closest('.order-step')?.querySelector('.order-step__body')
        stepBody?.append(autorizationButton)
    })()

    /** Кнопки Изменить, локация  */
    void (function () {
        const location = document.querySelector<HTMLElement>('.order__location')
        const elements = location ? Array.from(changeStepButton).concat(location) : changeStepButton

        elements.forEach((button) => {
            const finalBlock = button.closest('.order-step')?.querySelector('.order-step__final')
            finalBlock?.after(button)
        })
    })()
}

function createProductImage(src: string) {
    const img = document.createElement('img')
    img.src = src
    img.classList.add('order-details__img', 'swiper-slide')
    return img
}

function showProductsImages() {
    const container = document.querySelector('.order__items .swiper-wrapper')
    if (!container) return
    const productsImages = document.querySelectorAll<HTMLImageElement>('.cart__list-product-img ')
    productsImages.forEach((image) => {
        if (image.src) container.append(createProductImage(image.src))
    })
    new Swiper('.order__items', {
        slidesPerView: 2.5,
        spaceBetween: 8,
        breakpoints: {
            1000: {
                slidesPerView: 3.5,
                spaceBetween: 12,
            },
        },
    })
}

function updateOrderInfoItem(orderInfoElement: HTMLElement, newInfo: AdditionalPriceInfo) {
    const name = orderInfoElement.querySelector('.name') as HTMLElement
    const value = orderInfoElement.querySelector('.value') as HTMLElement

    name.textContent = newInfo.title
    value.textContent = newInfo.text
}

function createOrderInfoItem(info: AdditionalPriceInfo) {
    const addsOrderInfoItem = document.querySelector('.order-info__item._layout')?.cloneNode(true) as HTMLElement

    addsOrderInfoItem.classList.remove('_layout')
    addsOrderInfoItem.setAttribute('data-id', `${info.id}`)
    if (info.type === 'discount') addsOrderInfoItem.classList.add('order-info__item--discount')
    updateOrderInfoItem(addsOrderInfoItem, info)

    return addsOrderInfoItem
}

function setAdditionalInfo(info: AdditionalPriceInfo[] | undefined, container: HTMLElement) {
    if (!info || info.length === 0) {
        const adds = document.querySelectorAll('.order-info-item[data-id]')
        adds.forEach((element) => element.remove())
        return
    }

    info.forEach((info) => {
        const presentAdds = document.querySelector<HTMLElement>(`.order-info[data-id='${info.id}']`)

        if (presentAdds) {
            updateOrderInfoItem(presentAdds, info)
        } else {
            container.prepend(createOrderInfoItem(info))
        }
    })
}

function setOrderInfo(info: OrderInfo) {
    const container = document.querySelector<HTMLElement>('.order-info')
    if (!container) return

    setAdditionalInfo(info.additional, container)

    Object.entries(info).forEach(([key, value]) => {
        if (key === 'additional') return

        const valueElement = document.querySelector(`.order-info__item[data-info='${key}'] span`)
        if (!valueElement) return

        valueElement.textContent = value
    })
}
window.order = {
    showProductsImages,
    setOrderInfo,
}

init()
window.order.setOrderInfo(orderInfo)
