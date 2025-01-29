void (function () {
    const reviews = document.querySelectorAll('.review-item')
    if (!reviews.length) return

    const reviewPopupCall = new CustomEvent('review-call', { bubbles: true })
    reviews.forEach((review) => {
        review.addEventListener('click', () => review.dispatchEvent(reviewPopupCall))
    })
})()
