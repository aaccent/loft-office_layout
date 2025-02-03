void (function () {
    const types = document.querySelectorAll('.type-list__item')
    if (!types.length) return

    types.forEach((type) => {
        const id = type.dataset.id
        const typeBlock = document.getElementById(id)
        if (typeBlock) type.classList.add('active')
    })
})()
