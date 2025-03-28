import { adaptive } from 'globals/adaptive'
import { openPopup } from 'features/popup/popup'
import { createMutationObserver } from 'features/mutationObserver'
import { Input } from 'postcss'

const header = document.querySelector('.header')
const search = document.querySelector('.search')
const burgerMenu = document.querySelector('.burger-menu')
const catalogMenu = document.querySelector('.catalog-menu')
const mobileMenuWrapper = document.querySelector('.header__menu-wrapper')

/**
 * Закрывает все меню кроме `menuInstead`
 * @param {'catalog' | 'burger' | 'search' | 'mobile'} menuForExclude
 */
function closeAllMenusExclude(menuForExclude) {
    if (menuForExclude !== 'catalog') {
        catalogMenu?.classList.remove('opened')
    }

    if (menuForExclude !== 'burger') {
        burgerMenu?.classList.remove('opened')
    }

    if (menuForExclude !== 'search') {
        search?.classList.remove('opened')
    }

    if (menuForExclude !== 'mobile') {
        mobileMenuWrapper?.classList.remove('opened')
    }
}

function isAnyMenuOpenedExcludeCatalog() {
    return (
        search.classList.contains('opened') ||
        burgerMenu.classList.contains('opened') ||
        mobileMenuWrapper.classList.contains('opened')
    )
}

/** Высота и позиционирование шапки и его меню */
void (function () {
    /** Выставляет переменную в CSS с высотой шапки для позиционирования меню */
    function setHeaderHeight() {
        if (!header) return

        const height = `${header.offsetHeight}px`
        document.documentElement.style.setProperty('--header-height', height)
    }
    setHeaderHeight()

    window.addEventListener('resize', setHeaderHeight)
})()

/** Открытие и закрытие меню каталога */
void (function () {
    if (!catalogMenu) return

    /** @type {number | null} */
    let timeout = null
    const THRESHOLD_MS_BEFORE_CLOSE = 600

    function clearCatalogTimeout() {
        if (!timeout) return

        clearTimeout(timeout)
        timeout = null
    }

    function openCatalogMenu() {
        if (adaptive.isMobile) return

        clearCatalogTimeout()
        if (catalogMenu?.classList.contains('opened')) return

        closeAllMenusExclude('catalog')
        catalogMenu?.classList.add('opened')
        header.classList.add('opened')
    }

    function deferCloseCatalogMenu() {
        if (adaptive.isMobile) return
        if (!catalogMenu?.classList.contains('opened')) return

        timeout = setTimeout(() => {
            catalogMenu?.classList.remove('opened')
            if (isAnyMenuOpenedExcludeCatalog()) return
            header.classList.remove('opened')
        }, THRESHOLD_MS_BEFORE_CLOSE)
    }

    document.querySelectorAll('[data-action="catalog-menu"]').forEach((button) => {
        button.addEventListener('mouseenter', openCatalogMenu)
        button.addEventListener('mouseleave', deferCloseCatalogMenu)
        button.addEventListener('click', () => {
            if (adaptive.isDesktop) return

            catalogMenu?.classList.toggle('opened')
        })
    })

    catalogMenu.addEventListener('mouseenter', openCatalogMenu)
    catalogMenu.addEventListener('mouseleave', deferCloseCatalogMenu)
})()

/** Бургер меню */
void (function () {
    if (!burgerMenu) return

    document.querySelectorAll('[data-action="burger-menu"]').forEach((button) => {
        button.addEventListener('click', () => {
            closeAllMenusExclude('burger')
            burgerMenu.classList.toggle('opened')
            header.classList.toggle('opened', burgerMenu.classList.contains('opened'))
        })
    })
})()

/** Мобильное меню */
void (function () {
    const mobileMenuList = document.querySelector('.header__menu-list')

    document.querySelectorAll('[data-action="mobile-menu"]').forEach((button) => {
        button.addEventListener('click', () => {
            mobileMenuWrapper.classList.toggle('opened')
            header.classList.toggle('opened', mobileMenuWrapper.classList.contains('opened'))

            if (!mobileMenuWrapper.classList.contains('opened')) {
                catalogMenu.classList.remove('opened')
            } else {
                closeAllMenusExclude('mobile')
            }

            document.querySelectorAll('.header li.opened').forEach((li) => {
                li.classList.remove('opened')
            })
        })
    })

    // Копирование пунктов бургер меню в мобильное меню
    const headerMenuItems = Array.from(document.querySelectorAll('.header__menu-list > li > :is(button,span,a)'))
    const headerMenuLastItem = document.querySelector('.header__menu-list > li:last-child')

    const contactsItemText = headerMenuItems.findLast((i) => i.textContent.trim().toLowerCase() === 'контакты')
    const insertBeforeItem = contactsItemText?.parentElement || headerMenuLastItem

    document.querySelectorAll('.burger-menu__list > li').forEach((item) => {
        const clone = item.cloneNode(true)
        clone.classList.add('header__mobile-menu-item')

        const ul = clone.querySelector('ul')

        const liWithButton = document.createElement('li')
        liWithButton.className = 'header__menu-item-button'

        const callBtn = document.createElement('button')
        callBtn.innerText = 'Связаться'
        callBtn.className = 'button button--dark'
        callBtn.addEventListener('click', () => openPopup('call'))

        liWithButton.append(callBtn)
        ul.append(liWithButton)

        mobileMenuList.insertBefore(clone, insertBeforeItem)
    })

    // Добавление кнопок закрытия подпунктов в мобильной версии меню
    document.querySelectorAll(':is(.header__menu-list,.catalog-menu__list) > li').forEach((item) => {
        const link = item.querySelector(':is(a,span,button)')
        const ul = item.querySelector('ul')
        if (!ul) return

        const li = document.createElement('li')
        li.className = 'list-item-close-button'

        const closeButton = document.createElement('button')
        closeButton.innerText = link.textContent
        closeButton.addEventListener('click', () => {
            item.classList.remove('opened')
        })

        li.append(closeButton)
        ul.prepend(li)
    })

    document.querySelectorAll(':is(.catalog-menu__list,.header__menu-list) li:has(ul)').forEach((item) => {
        const link = item.querySelector(':is(a,span,button)')
        const subcategory = item.querySelector('ul')

        if (!link || !subcategory) return

        link.addEventListener('click', (event) => {
            if (adaptive.isDesktop) return
            event.preventDefault()

            item.classList.toggle('opened')
        })
    })
})()

/** Шапка во время прокрутки страницы */
void (function () {
    const header = document.querySelector('.header')

    function headerStickyHandler() {
        if (!header) return

        if (window.scrollY >= 15 && !header.classList.contains('sticky')) {
            header.classList.add('sticky')
        } else if (window.scrollY < 15 && header.classList.contains('sticky')) {
            header.classList.remove('sticky')
        }
    }

    window.addEventListener('scroll', headerStickyHandler, { passive: true })
    headerStickyHandler()
})()

void (function () {
    const favoriteButton = document.querySelector('.header__favorite-button-wrapper')
    if (!favoriteButton) return

    function checkFavoriteCounter() {
        const count = parseInt(favoriteButton.dataset.count || '0')
        favoriteButton.classList.toggle('header__with-counter--hidden', count <= 0)
    }
    checkFavoriteCounter()

    createMutationObserver(favoriteButton, checkFavoriteCounter, {
        attributes: true,
        subtree: false,
        childList: false,
    })
})()

// Попап поиска
void (function () {
    const search = document.querySelector('.search')

    document.querySelectorAll('[data-action="search"]').forEach((button) => {
        button.addEventListener('click', () => {
            if (!search || !header) return

            closeAllMenusExclude('search')
            search.classList.toggle('opened')
            header.classList.toggle('opened', search.classList.contains('opened'))
        })
    })
})()

import './search.ts'
