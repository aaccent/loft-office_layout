import { disableScroll } from 'features/scroll'
import { ReceiveItem } from '@/types/delivery'
import { testPoints } from '@/test-points'
import { createYMap } from 'features/maps/createYMap'

disableScroll()

async function initPickUpPointsMap(points: ReceiveItem[]) {
    const map = await createYMap('.points__map', { setPlacemark: false, ui: false })

    points.forEach((point) => {
        const baloonContent = `
<div class="points__baloon points__item" data-point-id="${point.id}">
    <div class="points__baloon-address points__item-address ">${point.title}</div>
    <div class="points__baloon-price points__item-price">${point.price}</div>
    <div class="points__baloon-date points__item-date">${point.date}</div>
    <button class="points__baloon-button button button--dark">выбрать пункт</button>
</div>`

        map.geoObjects.add(
            new ymaps.Placemark(
                point.coords,
                {
                    balloonContent: baloonContent,
                },
                {
                    iconLayout: 'default#image',
                    iconImageSize: [54, 54],
                    iconImageHref: './assets/icons/SDEK.svg',
                },
            ),
        )
    })

    const bounds = map.geoObjects.getBounds() || [
        [55.790766971638845, 49.09699866947489],
        [55.799094562644115, 49.11788124009805],
    ]

    await map.setBounds(bounds)
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
    const container = document.querySelector('.points__list-wrapper')
    if (!container) return

    const newListContainer = document.createElement('div')
    newListContainer.classList.add('points__list-container')

    const listElement = document.createElement('ul')
    listElement.classList.add('points__list')

    list.forEach((item) => {
        const point = document.createElement('li')
        point.classList.add('points__item')
        point.dataset.id = item.id.toString()
        point.dataset.coords = item.coords.join(',')

        const address = document.createElement('div')
        address.classList.add('points__item-address')
        address.textContent = item.title

        const price = document.createElement('div')
        price.classList.add('points__item-price')
        price.textContent = item.price.toString()

        const date = document.createElement('div')
        date.classList.add('points__item-date')
        date.textContent = item.date

        const button = document.createElement('button')
        button.classList.add('points__item-button')
        button.textContent = 'Выбрать'

        point.append(address, price, date, button)
        listElement.append(point)
    })

    newListContainer.append(listElement)
    container.append(newListContainer)

    initPickUpPointsMap(list)
}

window.delivery = {
    setList,
}

window.delivery.setList(testPoints)

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
})()
