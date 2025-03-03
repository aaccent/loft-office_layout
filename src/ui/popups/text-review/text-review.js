import { createContentSwiper } from 'ui/content/content.js'

function showTextReviewPopup(preview) {
    const popup = document.querySelector('.text-review.popup')
    const popupInner = popup.querySelector('.text-review__inner')

    const reviewItemHeader = preview.querySelector('.text-reviews-list__item-header').cloneNode(true)
    const reviewContent = preview.querySelector('.text-reviews-list__item-text').innerHTML

    const container = document.querySelector('.text-review__container')
    container.append(reviewItemHeader)

    const content = document.createElement('div')
    content.classList.add('text-review__content', 'content')
    content.innerHTML = reviewContent

    container.append(content)
    popupInner.append(container)
    createContentSwiper()

    const closeButton = popupInner.querySelector('.close-btn')
    closeButton.addEventListener('click', () => (container.innerHTML = ''), { once: true })

    popup.addEventListener(
        'click',
        (e) => {
            if (e.currentTarget !== e.target) return
            container.innerHTML = ''
        },
        { once: true },
    )
}

document.addEventListener('review-call', (e) => {
    const reviewPreview = e.target
    if (!reviewPreview.classList.contains('text-reviews-list__item')) return
    showTextReviewPopup(reviewPreview)
})
