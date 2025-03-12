import { validateTelInput } from 'features/forms'
import Swiper from 'swiper'
import { AdditionalPriceInfo, OrderInfo } from '@/types/order'
import { orderInfo } from '@/test-order-info'

type FinalInfo = {
    address: string
    name: string
    tel: string
    email: string
}

interface FinalInfoElement extends HTMLElement {
    dataset: { input: keyof FinalInfo }
}

type User = 'private' | 'commerce' | 'commerce-nds' | 'commerce,commerce-nds'
interface UserTypeInput extends HTMLInputElement {
    value: User
}

/** Определяет поля для шага Личные данные, которые относятся к выбранному типу пользователя */
function setUserData(userType: User) {
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
    const currentVisibleButton = document.querySelector('.order__button._visible')
    currentVisibleButton?.classList.remove('_visible')

    const visibleButton =
        userType === 'private'
            ? document.querySelector('.order-step:has(.payment-method) .order__button')
            : document.querySelector('.order-step:has(.delivery-method) .order__button')

    visibleButton?.classList.add('_visible')
}

function openNextStep(currentStepElement: HTMLElement) {
    const currentStep = currentStepElement.closest<HTMLElement>('.order-step')
    if (currentStep?.querySelector('.order__button._visible')) return

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

/** Заполняет данные для отображения в шаге Личные данные */
function setFinalUserInfo(info: FinalInfo) {
    const userData = document.querySelector<HTMLElement>('.user-data')
    const finalInfoElements = document.querySelectorAll<FinalInfoElement>('.user-data__final div')

    userData?.classList.add('_valid')

    finalInfoElements?.forEach((el) => {
        const key = el.dataset.input
        el.textContent = info[key]
    })
}

function init() {
    /** Определение полей в шаге Личные данные и места показа кнопки отправки формы. */
    const userTypeInputs = document.querySelectorAll<UserTypeInput>('.user-type input')
    userTypeInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const activeUserType = input.value
            setUserData(activeUserType)
            setSubmitButton(activeUserType)
            const userTypeFinal = document.querySelector('.user-type__final')
            const checkedUserType = input.closest('.user-type')
            if (!userTypeFinal || !checkedUserType) return
            userTypeFinal.textContent = checkedUserType.textContent
        })
    })

    /** Закрытие текущего шага и открытие следующего при выборе  */
    const radioInputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    radioInputs.forEach((input) => {
        input.addEventListener('change', () => openNextStep(input))
    })

    /** Проверка валидности полей в шаге Личные данные и вывод финальных данных */
    const userDataButton = document.querySelector<HTMLButtonElement>('.order-step .user-data__button')
    userDataButton?.addEventListener('click', () => {
        const requireUserInputs = document.querySelectorAll<HTMLInputElement>('.user-data__inputs .input._active input')

        const fullName: string[] = ['']
        const finalInfo: FinalInfo = {
            name: '',
            email: '',
            tel: '',
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

    /** Открытие предыдущего шага */
    const changeStepButtons = document.querySelectorAll<HTMLElement>('.order-step__change-button')
    changeStepButtons.forEach((button) => button.addEventListener('click', openCheckedStep))

    const firstStep = document.querySelector<HTMLElement>('.order-step:nth-child(1)')
    firstStep?.classList.add('_opened')

    /** Кнопка закрыть */
    const closeButton = document.querySelector('.order__close')
    closeButton?.addEventListener('click', () => window.history.back())
}

function createProductImage(src: string) {
    const img = document.createElement('img')
    img.src = src
    img.classList.add('order__items-img', 'swiper-slide')
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
        slidesPerView: 3.5,
        spaceBetween: 12,
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
    const name = addsOrderInfoItem.querySelector('.name') as HTMLElement
    const value = addsOrderInfoItem.querySelector('.value') as HTMLElement
    name.textContent = info.title
    value.textContent = info.text

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
