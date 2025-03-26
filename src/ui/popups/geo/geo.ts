import { GeoItem } from '@/types/geo'

const geoInput = document.querySelector<HTMLInputElement>('.geo-popup__input')
const title = document.querySelector<HTMLElement>('.geo-popup__result-title')
const resultBody = document.querySelector<HTMLElement>('.geo-popup__result-body')
const popularCities = resultBody?.innerHTML || ''

function setSearchResult(list: GeoItem[], handler?: (event: MouseEvent) => void) {
    if (!title || !resultBody) return

    if (!list.length) {
        title.style.display = 'none'
        resultBody.innerHTML = 'Город не найден, попробуйте изменить запрос!'
    } else {
        list.forEach((city) => {
            const link = document.createElement('a')
            link.className = 'geo-popup__result-item'
            link.href = city.link
            link.innerText = city.title
            link.onclick = (event) => {
                event.preventDefault()
                handler?.(event)
            }

            resultBody.innerHTML = ''
            resultBody.append(link)
        })
    }
}

function showPopularCities() {
    if (!geoInput || !title || !resultBody) return

    title.style.display = 'block'
    title.innerText = 'популярные города'
    resultBody.innerHTML = popularCities
}

geoInput?.addEventListener('input', () => {
    if (!geoInput || !title || !resultBody) return

    if (!geoInput.value) {
        showPopularCities()
    }
})

document.querySelector('.geo-popup__clear-input-button')?.addEventListener('click', () => {
    if (!geoInput || !title || !resultBody) return

    geoInput.value = ''
    showPopularCities()
})

const geoNotification = document.querySelector('.geo-notification')
const geoNotificationCityName = document.querySelector<HTMLElement>('.geo-notification__title span')
const geoButton = document.querySelector<HTMLElement>('.header__geo-button')
const mobileGeoButton = document.querySelector<HTMLElement>(
    '.header__mobile-geo-button .header__mobile-action-item-text',
)

function openGeoNotification() {
    geoNotification?.classList.add('active')
}

document.querySelectorAll('.geo-notification__button').forEach((button) => {
    button.addEventListener('click', () => geoNotification?.classList.remove('active'))
})

function setCity(text: string) {
    if (!mobileGeoButton || !geoButton || !geoNotificationCityName) return

    geoNotificationCityName.innerText = text
    geoButton.innerText = text
    mobileGeoButton.innerText = text
}

window.geo = {
    setSearchResult,
    openGeoNotification,
    setCity,
}
