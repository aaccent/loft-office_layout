void (function () {
    const reviewTypeButtons = document.querySelectorAll('.reviews-type__item')

    if (!reviewTypeButtons.length) return

    reviewTypeButtons.forEach((button) => {
        button.onclick = () => !button.classList.contains('active')
    })
})()
