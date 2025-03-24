import { createYMap } from 'features/maps/createYMap'

void (async function () {
    const mapContainer = document.createElement('div')
    mapContainer.classList.add('delivery-map')
    mapContainer.dataset.key = '7955ff0d-1f1e-4271-b357-70c071fadecb'
    document.body.append(mapContainer)
    window.map = createYMap(mapContainer, { setPlacemark: false, ui: false })
})()

const deliveryPopups = document.querySelectorAll('.points, .store')
deliveryPopups.forEach((popup) => {
    popup.addEventListener('opened', async () => {
        const map = await window.map

        const container = popup.querySelector('.popup__inner')
        if (!container) return

        container.prepend(map.container.getParentElement())
        map.container.fitToViewport()
        map.geoObjects.removeAll()
    })
})
