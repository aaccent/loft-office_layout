void (function () {
    const textReviews = document.querySelectorAll('.text-reviews-list__item')

    textReviews.forEach((review) => {
        const reviewImages = review.querySelectorAll('.text-reviews-list__item-text img')
        if (!reviewImages.length) return
        const media = review.querySelector('.text-reviews-list__item-media')
        const span = document.createElement('span')
        span.textContent = `${reviewImages.length} фото`
        media.append(span)
    })
})()
