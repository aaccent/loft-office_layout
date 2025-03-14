import { adaptive } from 'globals/adaptive'
import { openPopup } from 'features/popup/popup'

/** Высота и позиционирование шапки и его меню */
void (function () {
    const header = document.querySelector('.header')

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
    const catalogMenu = document.querySelector('.catalog-menu')
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

        catalogMenu?.classList.add('opened')
    }

    function deferCloseCatalogMenu() {
        if (adaptive.isMobile) return
        if (!catalogMenu?.classList.contains('opened')) return

        timeout = setTimeout(() => {
            catalogMenu?.classList.remove('opened')
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
    const burgerMenu = document.querySelector('.burger-menu')

    if (!burgerMenu) return

    document.querySelectorAll('[data-action="burger-menu"]').forEach((button) => {
        button.addEventListener('click', () => {
            burgerMenu.classList.toggle('opened')
        })
    })
})()

/** Мобильное меню */
void (function () {
    const mobileMenuWrapper = document.querySelector('.header__menu-wrapper')
    const mobileMenuList = document.querySelector('.header__menu-list')
    const catalogMenu = document.querySelector('.catalog-menu')

    document.querySelectorAll('[data-action="mobile-menu"]').forEach((button) => {
        button.addEventListener('click', () => {
            mobileMenuWrapper.classList.toggle('opened')
            if (!mobileMenuWrapper.classList.contains('opened')) {
                catalogMenu.classList.remove('opened')
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
        const ul = clone.querySelector('ul')

        const liWithButton = document.createElement('li')
        liWithButton.className = 'header__menu-item-button'

        const callBtn = document.createElement('button')
        callBtn.innerText = 'Связаться'
        callBtn.className = 'button button--brown'
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
        if (window.scrollY >= 15 && !header.classList.contains('sticky')) {
            header.classList.add('sticky')
        } else if (window.scrollY < 15 && header.classList.contains('sticky')) {
            header.classList.remove('sticky')
        }
    }

    window.addEventListener('scroll', headerStickyHandler, { passive: true })
    headerStickyHandler()
})()
