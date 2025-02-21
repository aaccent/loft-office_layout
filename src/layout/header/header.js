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

    /** @type {number | null} */
    let timeout = null
    const THRESHOLD_MS_BEFORE_CLOSE = 600

    function clearCatalogTimeout() {
        if (!timeout) return

        clearTimeout(timeout)
        timeout = null
    }

    function openCatalogMenu() {
        clearCatalogTimeout()
        if (catalogMenu?.classList.contains('opened')) return

        catalogMenu?.classList.add('opened')
    }

    /** @param {MouseEvent} event */
    function deferCloseCatalogMenu(event) {
        if (!catalogMenu?.classList.contains('opened')) return

        timeout = setTimeout(() => {
            catalogMenu?.classList.remove('opened')
        }, THRESHOLD_MS_BEFORE_CLOSE)
    }

    document.querySelectorAll('[data-action="catalog-menu"]').forEach((button) => {
        button.addEventListener('mouseenter', openCatalogMenu)
        button.addEventListener('mouseleave', deferCloseCatalogMenu)
    })

    catalogMenu.addEventListener('mouseenter', openCatalogMenu)
    catalogMenu.addEventListener('mouseleave', deferCloseCatalogMenu)
})()
