import { getAddressList } from '@/methods/getAddressList'

void (function () {
    const streetInput = document.querySelector<HTMLInputElement>('input[name="street"]')
    const addressBlock = document.querySelector('.courier-address__list-block')
    const addressList = document.querySelector('.courier-address__list')

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
})()
