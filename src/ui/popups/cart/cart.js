document.querySelector('.popup.cart').classList.add('opened')
document.documentElement.style.overflow = 'clip'
document.body.style.overflow = 'clip'
const html = document.documentElement
document.body.style.paddingRight = `${window.innerWidth - html.offsetWidth}px`
html.classList.add('disable-scroll')
