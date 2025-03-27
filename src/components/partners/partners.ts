void (function () {
    const scrollContainer = document.querySelector<HTMLElement>('.partners__container')
    const scrollList = document.querySelector<HTMLElement>('.partners__list')
    if (!scrollList || !scrollContainer) return

    if (scrollList.offsetWidth < document.documentElement.offsetWidth) return

    scrollList.classList.add('_scroll')
    const clone = scrollList.cloneNode(true) as HTMLElement
    clone.setAttribute('aria-hidden', 'true')
    scrollContainer.append(clone)
})()
