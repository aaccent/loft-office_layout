const scrollButton = document.querySelector('.main-banner__scroll-button')
scrollButton?.addEventListener('click', () => {
    const nextSection = scrollButton?.closest('section')?.nextElementSibling
    nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
