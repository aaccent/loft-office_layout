function convertRuTubeLink(link) {
    const url = new URL(link)
    const pathName = url.pathname.toString().replace('video', 'play/embed')
    return url.origin.toString() + pathName
}

function convertVkVideoLink(link) {
    const url = new URL(link)
    const oid = url.pathname.match(/-\d+/)[0]
    const id = url.pathname.match(/_(\d+)/)[1]
    const newUrl = new URL(url.origin.toString() + '/video_ext.php')
    newUrl.searchParams.set('oid', oid)
    newUrl.searchParams.set('id', id)
    newUrl.searchParams.set('autoplay', '1')
    return newUrl.toString()
}

function createIframe(link, container) {
    const iframe = document.createElement('iframe')
    let src
    if (link.includes('rutube')) {
        src = convertRuTubeLink(link)
    } else if (link.includes('vkvideo')) {
        src = convertVkVideoLink(link)
    }

    iframe.src = src
    iframe.classList.add('review__player', 'review__content')
    container.append(iframe)
}

void (function () {
    document.addEventListener('review-call', (e) => {
        const container = document.querySelector('.review__inner')
        if (e.target.classList.contains('video-reviews__item')) {
            const link = e.target.dataset.link
            createIframe(link, container)
        }

        const removeIframe = (e) => {
            const iframe = e.target.closest('.review__inner').querySelector('.review__content')
            iframe.remove()
            e.target.removeEventListener('click', removeIframe)
        }

        const closeButton = document.querySelector('.close-btn')
        closeButton.addEventListener('click', removeIframe)
    })
})()
