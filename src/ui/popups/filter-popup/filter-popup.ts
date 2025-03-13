document.querySelectorAll('.filter-popup__block--dropdown').forEach((block) => {
    const titleWrapper = block.querySelector('.filter-popup__block-title-wrapper')
    titleWrapper?.addEventListener('click', () => {
        block.classList.toggle('opened')
    })
})
