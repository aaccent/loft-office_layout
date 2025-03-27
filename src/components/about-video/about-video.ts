void (function () {
    const video = document.querySelector<HTMLVideoElement>('.about-video video')

    if (!video) return

    const videoDuration = document.querySelector('.about-video__duration') as HTMLElement
    const videoControls = document.querySelector<HTMLElement>('.about-video__control')
    const title = document.querySelector<HTMLElement>('.about-video__title')

    const stopVideo = (event: MouseEvent) => {
        const el = event.target as HTMLVideoElement
        videoControls?.classList.remove('_hidden')
        title?.classList.remove('_hidden')
        el.pause()
        el.removeEventListener('click', stopVideo)
    }

    const playVideo = (el: HTMLVideoElement) => {
        videoControls?.classList.add('_hidden')
        title?.classList.add('_hidden')
        el.play().then(() => {
            el.addEventListener('click', stopVideo)
        })
    }

    video.oncanplay = () => {
        const durationInSec = Math.trunc(video.duration)
        videoDuration.textContent = `${Math.trunc(durationInSec / 60)}:${durationInSec % 60}`
        videoControls?.addEventListener('click', () => playVideo(video))
    }
})()
