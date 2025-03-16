import { disableScroll } from 'features/scroll'
import { ReceiveItem } from '@/types/delivery'
import { testPoints } from '@/test-points'

disableScroll()

function setList(list: ReceiveItem[]) {
    const container = document.querySelector('.points__list-wrapper')
    console.log(container)
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
}

window.delivery = {
    setList,
}

window.delivery.setList(testPoints)
