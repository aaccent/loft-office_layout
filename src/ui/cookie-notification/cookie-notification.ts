import { COOKIES, cookies, ONE_YEAR_IN_SECONDS, setCookie } from 'features/cookies'

void (function () {
    const notification = document.querySelector('.cookie-notification')
    if (!notification) return

    if (cookies().get(COOKIES.COOKIE_NOTIFICATION)) return

    notification.classList.add('opened')

    document.querySelector('.cookie-notification__button')?.addEventListener('click', () => {
        setCookie('cookie-notification', 'true', {
            path: '/',
            maxAge: ONE_YEAR_IN_SECONDS * 40,
        })

        notification.classList.remove('opened')
    })
})()
