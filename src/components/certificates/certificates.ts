void (function () {
    const CERTIFICATES_IN_VIEW = 4
    const certificates = document.querySelectorAll('.certificates__item')
    const moreButton = document.querySelector<HTMLElement>('.certificates__more-button')

    certificates.forEach((item, index) => {
        if (index + 1 > CERTIFICATES_IN_VIEW) item.classList.add('_hidden')
    })

    moreButton?.addEventListener('click', () => {
        document.querySelectorAll('.certificates__item._hidden').forEach((item) => {
            moreButton.setAttribute('style', 'display: none')
            item.classList.remove('_hidden')
        })
    })
})()
