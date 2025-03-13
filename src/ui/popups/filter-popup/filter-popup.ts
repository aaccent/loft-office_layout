document.querySelectorAll('.filter-popup__block--dropdown').forEach((block) => {
    const titleWrapper = block.querySelector('.filter-popup__block-title-wrapper')
    const body = block.querySelector('.filter-popup__block-body')

    titleWrapper?.addEventListener('click', () => block.classList.toggle('opened'))

    if (!body || !titleWrapper) return

    const title = block.querySelector('.filter-popup__block-title')?.textContent || ''
    const mobileTitleWrapper = document.createElement('div')
    mobileTitleWrapper.className = 'filter-popup__block-mobile-title-wrapper'

    const mobileTitleButton = document.createElement('button')
    mobileTitleButton.innerText = title
    mobileTitleButton.type = 'button'
    mobileTitleButton.className = 'filter-popup__block-mobile-title'
    mobileTitleButton.addEventListener('click', () => block.classList.toggle('opened'))

    const resetButton = block.querySelector('.filter-popup__block-reset-button')?.cloneNode(true)
    mobileTitleWrapper.append(mobileTitleButton)
    if (resetButton) mobileTitleWrapper.append(resetButton)

    body.prepend(mobileTitleWrapper)
})
