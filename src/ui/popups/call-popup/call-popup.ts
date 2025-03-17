import { openPopup } from 'features/popup/popup'

document.querySelector('form.call-popup__form')?.addEventListener('form-sent', () => {
    openPopup('thanks')
})
