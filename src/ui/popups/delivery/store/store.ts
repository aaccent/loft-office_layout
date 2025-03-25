import { adaptive } from 'globals/adaptive'
import { FinalDeliveryInfo } from '@/types/delivery'
import { closeActivePopup, OpenPopupEvent } from 'features/popup/popup'
import { setFinalDeliveryInfo } from 'pages/order/order'

async function initStoreMap() {
    const map = await window.map
    map.geoObjects.removeAll()

    const coords = document.querySelectorAll<HTMLElement>('.store__info-content[data-store-coords]')

    coords.forEach((coord) => {
        const coordsValue = coord.dataset.storeCoords?.split(',').map((value) => Number(value))
        const placemark = new ymaps.Placemark(
            coordsValue || [],
            {},
            {
                iconLayout: 'default#image',
                iconImageSize: adaptive.isMobile ? [52, 52] : [102, 102],
                iconImageHref: './assets/icons/store.svg',
                hideIconOnBalloonOpen: false,
                hasBalloon: false,
            },
        )

        placemark.events.add('click', () => {
            const activeCoords = document.querySelector('.store__info-content._visible')
            activeCoords?.classList.remove('_visible')
            coord.classList.add('_visible')
        })

        map.geoObjects.add(placemark)
    })

    const bounds = map.geoObjects.getBounds() || [
        [55.790766971638845, 49.09699866947489],
        [55.799094562644115, 49.11788124009805],
    ]

    await map.setBounds(bounds, { zoomMargin: [40] })
}

document.querySelector('.store')?.addEventListener('opened', (e) => {
    initStoreMap().then(() => {
        const chooseButton = document.querySelector('[data-action="store"]')
        chooseButton?.addEventListener('click', () => {
            const address = document.querySelector('.store__info-content._visible .store__address')?.textContent || ''
            const popupButton = (e as OpenPopupEvent).detail.target
            const storeInput = popupButton?.querySelector<HTMLInputElement>('input')

            const info: FinalDeliveryInfo = {
                type: 'Самовывоз',
                popup: 'store',
                address,
            }

            setFinalDeliveryInfo(info)
            closeActivePopup()
            if (storeInput) storeInput.checked = true
        })
    })
})
