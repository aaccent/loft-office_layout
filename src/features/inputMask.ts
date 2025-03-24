import IMask from 'imask'
import type { FactoryArg } from 'imask/masked/factory'

const telInputs = document.querySelectorAll<HTMLElement>('input[type="tel"]')

const maskOptions: FactoryArg = {
    mask: '+{7}(000)000-00-00',
}
telInputs.forEach((input) => IMask(input, maskOptions))

const codeInputs = document.querySelectorAll<HTMLElement>('input[name="code"]')
codeInputs.forEach((input) => {
    IMask(input, { mask: Number })
})

const numberInputs = document.querySelectorAll<HTMLElement>('input[data-format="inn"], input[data-format="kpp"]')

const maskNumberOptions = {
    mask: Number,
}

numberInputs.forEach((input) => IMask(input, maskNumberOptions))
