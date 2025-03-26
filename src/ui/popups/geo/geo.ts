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

window.geo = {
    setSearchResult,
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
