interface TabButtonElement extends HTMLElement {
    dataset: {
        tab: string | undefined
    }
}

document.querySelectorAll<TabButtonElement>('.product-info__title-button').forEach((button) => {
    button.addEventListener('click', () => {
        if (button.classList.contains('active')) return

        const tabName = button.dataset.tab || ''
        const tabBody = document.querySelector(`[data-tab-body="${tabName}"]`)

        if (!tabBody) return

        document
            .querySelectorAll('[data-tab].active,[data-tab-body].active')
            .forEach((i) => i.classList.remove('active'))

        button.classList.add('active')
        tabBody.classList.add('active')
    })
})

document.querySelector('.product-info__prop-more-button')?.addEventListener('click', (event) => {
    const propList = document.querySelector('.product-info__prop-list')
    if (!propList) return

    propList.classList.add('opened')
    ;(event.currentTarget as HTMLElement).remove()
})
