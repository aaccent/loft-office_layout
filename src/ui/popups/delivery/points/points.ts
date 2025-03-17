import { FinalDeliveryInfo, ReceiveItem } from '@/types/delivery'
import { testPoints } from '@/test-points'
import { adaptive } from 'globals/adaptive'
import { setFinalDeliveryInfo } from 'pages/order/order'
import { closeActivePopup, OpenPopupEvent } from 'features/popup/popup'

async function initPickUpPointsMap(points: ReceiveItem[]) {
    const map = await window.map
    map.geoObjects.removeAll()

    points.forEach((point) => {
        const baloonContent = `
    <div class="points__baloon points__item" data-point-id="${point.id}">
        <div class="points__baloon-address points__item-address ">${point.address}</div>
        <div class="points__baloon-price points__item-price">${point.price}</div>
        <div class="points__baloon-date points__item-date">${point.date}</div>
        <button class="points__baloon-button button button--dark" type="button" data-action="points">выбрать пункт</button>
    </div>`

        const placemark = new ymaps.Placemark(
            point.coords,
            {
                balloonContent: baloonContent,
            },
            {
                iconLayout: 'default#image',
                iconImageSize: [54, 54],
                iconImageHref: './assets/icons/SDEK.svg',
                hideIconOnBalloonOpen: false,
                hasBalloon: adaptive.isDesktop,
            },
        )

        placemark.events.add('click', () => {
            Object.entries(point).forEach(([key, value]) => {
                const baloonMobile = document.querySelector<HTMLElement>('.points__baloon--mobile')
                const baloonContent = document.querySelector(`[data-baloon-id='${key}']`)
                if (!baloonContent || !baloonMobile) return

                baloonContent.textContent = value
                baloonMobile.classList.add('_visible')
                baloonMobile.dataset.pointId = point.id.toString()
            })
        })

        map.geoObjects.add(placemark)
    })

    map.balloon.events.add('open', () => {
        const choosePointButton = document.querySelector('.points__baloon-button')
        choosePointButton?.addEventListener('click', onPointChooseButtonClick)
    })

    const bounds = map.geoObjects.getBounds() || [
        [55.790766971638845, 49.09699866947489],
        [55.799094562644115, 49.11788124009805],
    ]

    await map.setBounds(bounds, { zoomMargin: [40] })
}

function showErrorMessage() {
    const wrapper = document.querySelector('.points__list-wrapper')
    if (!wrapper) return
    wrapper.innerHTML = '<div class="points__error-message">Пункт выдачи не найден, попробуйте изменить запрос!</div>'
}

function setList(list: ReceiveItem[]) {
    if (!list.length) {
        return showErrorMessage()
    }
    const container = document.querySelector('.points__list-container')
    if (!container) return

    container.innerHTML = ''
    const listElement = document.createElement('ul')
    listElement.classList.add('points__list')

    list.forEach((item) => {
        const point = document.createElement('li')
        point.classList.add('points__item')
        point.dataset.pointId = item.id.toString()
        point.dataset.coords = item.coords.join(',')

        const address = document.createElement('div')
        address.classList.add('points__item-address')
        address.textContent = item.address

        const price = document.createElement('div')
        price.classList.add('points__item-price')
        price.textContent = item.price.toString()

        const date = document.createElement('div')
        date.classList.add('points__item-date')
        date.textContent = item.date

        const button = document.createElement('button')
        button.classList.add('points__item-button')
        button.type = 'button'
        button.dataset.action = 'points'
        button.textContent = 'Выбрать'

        point.append(address, price, date, button)
        listElement.append(point)
    })

    container.append(listElement)
    initPickUpPointsMap(list).then(() => {
        const choosePointButtons = document.querySelectorAll('[data-action="points"]')
        choosePointButtons.forEach((button) => button.addEventListener('click', onPointChooseButtonClick))
    })
}

export function onPointChooseButtonClick(e: Event) {
    const target = e.target as HTMLElement
    const point = target.closest<HTMLElement>('[data-point-id]')
    const address = point?.querySelector('.points__item-address')
    const date = point?.querySelector('.points__item-date')
    const pointsCompany = document.querySelector<HTMLElement>('.popup.points')?.dataset.company
    const companyInput = document.querySelector<HTMLInputElement>(
        `.delivery-method[data-company='${pointsCompany}'] input`,
    )

    const info: FinalDeliveryInfo = {
        type: 'Пункт выдачи',
        popup: 'points',
        address: address?.textContent || '',
        extra: date?.textContent || '',
    }

    setFinalDeliveryInfo(info)
    closeActivePopup()
    if (companyInput) companyInput.checked = true
}

void (function () {
    const list = document.querySelector('.points__info')

    const showListButton = document.querySelector('.points__show-list-button')
    showListButton?.addEventListener('click', () => {
        list?.classList.add('_visible')
    })

    const closeListButton = document.querySelector('.points__info-close')
    closeListButton?.addEventListener('click', () => {
        list?.classList.remove('_visible')
    })

    const closeBaloonButton = document.querySelector('.points__baloon--mobile .points__baloon-close')
    closeBaloonButton?.addEventListener('click', () => {
        closeBaloonButton.closest('.points__baloon--mobile')?.classList.remove('_visible')
    })
})()

window.delivery = {
    setList,
}

document.querySelector('.popup.points')?.addEventListener('opened', (e) => {
    const popupBtn = (e as OpenPopupEvent).detail.target
    const companyName = popupBtn?.querySelector<HTMLElement>('.delivery-method')?.dataset.company

    const popup = e.currentTarget as HTMLElement
    popup.dataset.company = companyName

    window.delivery.setList(testPoints)
})
