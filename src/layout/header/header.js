const header = document.querySelector('.header')

function setHeaderHeight() {
    if (!header) return

    const height = `${header.offsetHeight}px`
    header.style.marginBottom = `-${height}`
    document.documentElement.style.setProperty('--header-height', height)
}
setHeaderHeight()

window.addEventListener('resize', setHeaderHeight)
