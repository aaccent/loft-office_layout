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

function createIframe(link) {
    const iframe = document.createElement('iframe')
    let src
    if (link.includes('rutube')) {
        src = convertRuTubeLink(link)
    } else if (link.includes('vkvideo')) {
        src = convertVkVideoLink(link)
    }

    iframe.src = src
    iframe.classList.add('video-player')
    return iframe
}

void (function () {
    document.addEventListener('review-call', (e) => {
        if (!e.target.classList.contains('video-reviews__item')) return
        const container = document.querySelector('.video-review__inner')
        const link = e.target.dataset.link
        container.append(createIframe(link))

        const removeIframe = (e) => {
            const iframe = container.querySelector('.video-player')
            iframe.remove()
            e.target.removeEventListener('click', removeIframe)
        }

        const closeButton = document.querySelector('.video-review .close-btn')
        closeButton.addEventListener('click', removeIframe)
    })
})()
