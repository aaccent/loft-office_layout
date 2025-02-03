const header = document.querySelector('.header')

if (header) header.style.marginBottom = `-${header.offsetHeight}px`

window.addEventListener('resize', () => {
    if (header) header.style.marginBottom = `-${header.offsetHeight}px`
})
