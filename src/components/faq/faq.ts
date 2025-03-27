void (function () {
    const questions = document.querySelectorAll('.faq__question')
    questions.forEach((question) => {
        question.addEventListener('click', () => {
            const currentOpened = document.querySelector('.faq__question._opened')
            currentOpened?.classList.remove('_opened')
            question.classList.add('_opened')
        })
    })
})()
