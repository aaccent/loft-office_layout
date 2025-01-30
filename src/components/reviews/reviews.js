void (function () {
    const reviews = document.querySelectorAll('.reviews__item')
    if (!reviews.length) return

    const reviewPopupCall = new CustomEvent('review-call', { bubbles: true })
    reviews.forEach((review) => {
        review.addEventListener('click', () => review.dispatchEvent(reviewPopupCall))
    })
})()

void (function () {
    const textReviewsContent = document.querySelectorAll('.text-reviews__item-text')

    if (!textReviewsContent.length) return
    textReviewsContent.forEach((content) => {
        const reviewImages = content.querySelectorAll('img')
        if (reviewImages.length) {
            const media = content.closest('.text-reviews__item').querySelector('.text-reviews__item-media')
            const span = document.createElement('span')
            span.textContent = `${reviewImages.length} фото`
            media.append(span)
        }
    })
})()
