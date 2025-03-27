import { OpenPopupEvent } from 'features/popup/popup'
import { PreorderInfo } from '@/types/preorder'

const preorderPopup = document.querySelector('.preorder-popup')

preorderPopup?.addEventListener('closed', () => {
    window.preorderInfo = null
})

interface PreorderFieldElement extends HTMLElement {
    dataset: {
        field: keyof PreorderInfo | undefined
        id: string | undefined
    }
}

type PopupField = HTMLElement | HTMLImageElement | HTMLInputElement

preorderPopup?.addEventListener('opened', (event) => {
    const button = (event as OpenPopupEvent).detail.target
    const bounds = button?.closest('.preorder-bounds')

    if (!bounds) return

    const title = preorderPopup.querySelector<HTMLElement>('.preorder-popup__title')
    if (title) {
        title.innerText = document.querySelector('.product-hero__body:not(._preorder)')
            ? 'Купить в 1 клик'
            : 'Предзаказ'
    }

    bounds.querySelectorAll<PreorderFieldElement>('[data-field]').forEach((valueField) => {
        const popupField = preorderPopup.querySelector<PopupField>(`[data-field="${valueField.dataset.field}"]`)
        if (!popupField) return

        if (popupField instanceof HTMLImageElement && valueField instanceof HTMLImageElement) {
            popupField.src = valueField.src || ''
            return
        }

        if (popupField instanceof HTMLInputElement) {
            popupField.value = valueField.dataset.id || ''
            return
        }

        if (!valueField.dataset.field) return

        popupField.innerText = (valueField.innerText || '').trim()
    })
})
