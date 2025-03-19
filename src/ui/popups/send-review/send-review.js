const FILE_LIMIT = 4

function progress() {
    const previewsAmount = document.querySelectorAll('.preview').length
    const length = document.querySelector('.send-review__progress-bar').offsetWidth
    const segment = length / FILE_LIMIT
    const progress = document.querySelector('.send-review__progress-bar span')

    progress.style.width = previewsAmount * segment + 'px'

    const amount = document.querySelector('.send-review__progress-amount span')
    amount.textContent = `0${previewsAmount}`
}

function createFilePreview(src) {
    const previewsList = document.querySelector('.send-review__drop-files')

    const preview = document.createElement('div')
    preview.classList.add('preview')
    const img = document.createElement('img')
    img.src = src
    preview.append(img)

    const removeButton = document.createElement('button')
    removeButton.classList.add('preview__remove-button')
    removeButton.onclick = (e) => {
        e.target.closest('.preview').remove()
        progress()
    }
    preview.append(removeButton)

    previewsList.append(preview)
}

document.querySelector('input[type="file"]')?.addEventListener('change', (e) => {
    const previewsLength = document.querySelectorAll('.preview').length
    const files = [...e.target.files].slice(0, FILE_LIMIT - previewsLength)

    files.forEach((file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            createFilePreview(event.target.result)
            progress()
        }
    })
})
