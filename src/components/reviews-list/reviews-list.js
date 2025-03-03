void (function () {
    const reviews = document.querySelectorAll('.reviews__item')

    const reviewPopupCall = new CustomEvent('review-call', { bubbles: true })
    reviews.forEach((review) => {
        review.addEventListener('click', () => review.dispatchEvent(reviewPopupCall))
    })
})()
