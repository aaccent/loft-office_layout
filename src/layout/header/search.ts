import { adaptive } from 'globals/adaptive'
import { SearchResultItem, SearchResultProduct } from '@/types/search'

const inputContainer = document.querySelector<HTMLElement>('.search__input-container')
const input = document.querySelector<HTMLInputElement>('input.search__field')
const suggestionContainer = document.querySelector<HTMLElement>('.search__main-suggestion')

const productsContainer = document.querySelector<HTMLElement>('.search__products-result')
const cachedPopularProducts = productsContainer?.innerHTML || ''

const resultsWrapper = document.querySelector('.search__body')
const searchResultBody = document.querySelector('.search__categories-result-body')
const cachedPopularSuggestion = searchResultBody?.innerHTML || ''

const resultTitle = document.querySelector<HTMLElement>('.search__categories-result-title')

let suggestion = ''

function showSuggestionUnderField() {
    if (!input || !suggestionContainer) return

    const value = input.value || ''
    const suggestionRegex = new RegExp(`^${value}`, 'i')

    if (value && suggestionRegex.test(suggestion)) {
        suggestionContainer.innerText = suggestion.replace(suggestionRegex, '')
    } else {
        suggestionContainer.innerText = ''
    }
}

/** Устанавливает элементы и вид в колонке результатов справа */
function setSearchResultCategories(list: SearchResultItem[]) {
    if (!searchResultBody || !resultTitle) return

    if (!list.length) {
        resultTitle.innerText = 'результаты по запросу'

        const emptyMessage = document.createElement('div')
        emptyMessage.innerText = 'К сожалению, ничего не найдено, попробуйте изменить запрос!'
        emptyMessage.className = 'search__categories-result-list-item'

        searchResultBody.innerHTML = ''
        searchResultBody.append(emptyMessage)
        return
    }

    if (list[0]) {
        suggestion = list[0].title
        showSuggestionUnderField()
    }

    searchResultBody.innerHTML = ''

    list.forEach((category) => {
        const link = document.createElement('a')
        link.href = category.link
        link.innerText = category.title
        link.className = 'search__categories-result-list-item'
        resultTitle.innerText = 'Похожие запросы'

        searchResultBody.append(link)
    })
}

function setSearchResultProducts(list: SearchResultProduct[]) {
    if (!productsContainer) return

    if (!list.length) {
        productsContainer.innerHTML = cachedPopularProducts
        return
    }

    productsContainer.innerHTML = ''

    list.forEach((product) => {
        const productEl = document.createElement('a')
        productEl.className = 'small-product-card'
        productEl.href = product.link
        productEl.innerHTML =
            '<div class="small-product-card__image-wrapper">' +
            `<img src="${product.image}" alt="">` +
            '</div>' +
            `<span class="small-product-card__color">${product.color}</span>` +
            `<div class="small-product-card__title">${product.title}</div>` +
            `<div class="small-product-card__price">${product.price}</div>`

        productsContainer.append(productEl)
    })
}

window.search = {
    setSearchResultCategories,
    setSearchResultProducts,
}

void (function () {
    if (!input || !inputContainer) return

    // Плейсхолдер при инициализации
    if (!input.value && input.placeholder) {
        inputContainer.innerText = input.placeholder
        inputContainer.classList.add('_placeholder')
    }

    if (adaptive.isMobile) {
        input.placeholder = 'Найти товар'
    }

    // Ввод поля
    input.addEventListener('input', () => {
        const value = input.value || ''

        if (!value && input.placeholder) {
            inputContainer.innerText = input.placeholder
            inputContainer.classList.add('_placeholder')

            if (!searchResultBody || !resultTitle || !productsContainer) return
            searchResultBody.innerHTML = cachedPopularSuggestion
            productsContainer.innerHTML = cachedPopularProducts
            resultTitle.innerText = 'Популярные запросы'
        } else {
            setSearchResultCategories([])
            inputContainer.innerText = value
            inputContainer.classList.remove('_placeholder')
        }

        resultTitle?.scrollIntoView()
    })

    // Подсказка для поля
    input.addEventListener('input', showSuggestionUnderField)
})()
