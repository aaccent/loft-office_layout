import { adaptive } from 'globals/adaptive'

/** Высота и позиционирование шапки и его меню */
void (function () {
    const header = document.querySelector('.header')

    /** Выставляет переменную в CSS с высотой шапки для позиционирования меню */
    function setHeaderHeight() {
        if (!header) return

        const height = `${header.offsetHeight}px`
        header.style.marginBottom = `-${height}`
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

    // Добавление кнопок закрытия подпунктов в мобильной версии
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
})()

/** Мобильное меню */
void (function () {
    const mobileMenu = document.querySelector('.header__menu-wrapper')

    document.querySelectorAll('[data-action="mobile-menu"]').forEach((button) => {
        button.addEventListener('click', () => {
            mobileMenu.classList.toggle('opened')
        })
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
