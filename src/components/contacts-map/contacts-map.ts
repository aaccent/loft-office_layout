import { createYMap } from 'features/maps/createYMap'
import { adaptive } from 'globals/adaptive'

void (async function () {
    const contactsMap = document.querySelector<HTMLElement>('.contacts__map')

    if (!contactsMap) return

    const map = await createYMap(contactsMap, {
        setPlacemark: false,
        ui: false,
    })

    const contactsInfo = document.querySelectorAll<HTMLElement>('.contacts__info[data-coords]')
    contactsInfo.forEach((info) => {
        const coords = info.dataset.coords?.split(',').map((coord) => Number(coord))
        if (!coords) return

        const placemark = new ymaps.Placemark(
            coords,
            {},
            {
                iconLayout: 'default#image',
                iconImageHref: 'assets/icons/placemark.svg',
                iconImageSize: adaptive.isMobile ? [54, 54] : [102, 102],
            },
        )

        placemark.events.add('click', () => {
            document.querySelector('.contacts__info._visible')?.classList.remove('_visible')

            info.classList.add('_visible')
        })

        map.geoObjects.add(placemark)
    })

    const bounds = map.geoObjects.getBounds() || [
        [55.790766971638845, 49.09699866947489],
        [55.799094562644115, 49.11788124009805],
    ]

    const zoomMargin = adaptive.isMobile ? [20] : [40, 400, 40, 40]

    await map.setBounds(bounds, { zoomMargin })
})()
