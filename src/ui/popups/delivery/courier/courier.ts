import { getAddressList } from '@/methods/getAddressList'
import { setFinalDeliveryInfo } from 'pages/order/order'
import { closeActivePopup, OpenPopupEvent } from 'features/popup/popup'

void (function () {
    const streetInput = document.querySelector<HTMLInputElement>('input[name="street"]')
    const addressBlock = document.querySelector('.courier-address__list-block')
    const addressList = document.querySelector('.courier-address__list')
    const setAddressButton = document.querySelector('.courier__button')
    let courierInput: HTMLInputElement | null

    const popup = document.querySelector('.courier')
    popup?.addEventListener('opened', (e) => {
        const courierButton = (e as OpenPopupEvent).detail.target
        courierInput = courierButton?.querySelector('input') ? courierButton.querySelector('input') : null
    })

    if (!addressList) return

    streetInput?.addEventListener('input', () => {
        addressList.innerHTML = ''

        getAddressList(streetInput.value).then((list) => {
            if (list.length) {
                addressBlock?.classList.add('_visible')
            } else {
                addressBlock?.classList.remove('_visible')
            }

            list.forEach((address) => {
                const li = document.createElement('li')
                li.classList.add('courier-address__item')
                li.textContent = address.value
                addressList?.append(li)

                li.addEventListener('click', () => {
                    const arrayValue = li.textContent?.split(',').slice(0, 2) || []

                    streetInput.value = arrayValue.join(', ')
                    addressList.innerHTML = ''
                    addressBlock?.classList.remove('_visible')
                })
            })
        })
    })

    streetInput
        ?.closest('.input')
        ?.querySelector('.input__reset')
        ?.addEventListener('click', () => addressBlock?.classList.remove('_visible'))

    setAddressButton?.addEventListener('click', () => {
        const addressInputs = document.querySelectorAll<HTMLInputElement>('.courier-address input')
        const address: string[] = []
        const invalid = Array.from(addressInputs).some((input) => !input.validity.valid)

        if (invalid) return

        addressInputs.forEach((input) => {
            if (input.name === 'street') {
                address[0] = input.value
            }
            if (input.name === 'flat') {
                address[1] = `, кв/оф ${input.value} `
            }
        })

        setFinalDeliveryInfo({
            type: 'Курером',
            popup: 'courier',
            address: address.join(''),
        })

        closeActivePopup()
        if (courierInput) courierInput.checked = true
    })
})()
