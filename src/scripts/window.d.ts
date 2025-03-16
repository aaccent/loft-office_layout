import { ScriptStatus, ScriptTypes } from '@/features/loadScript'
import { CartInfo, Product } from '@/types/types'
import { ReceiveItem } from '@/types/delivery'

declare global {
    interface Window {
        initMap: () => void
        onYouTubeIframeAPIReady: () => void
        globalScripts: {
            [key in ScriptTypes]?: ScriptStatus
        }
        cart: {
            /** Добавляет элементы в корзину, если элемент с таким id уже есть, то заменяет его новыми данными */
            addItems(list: Product[]): void
            /** Полностью обновляет корзину */
            setItems(list: Product[]): void
            /** Убирает элемент из корзины по id. Если элемента с таким id нет - ничего не происходит */
            removeItem(id: Product['id']): void
            /** Очищает корзину */
            clear(): void
            /** Выставляет цену в корзине */
            setInfo(info: CartInfo): void
            /** Общее количество товаров в корзине */
            amount: number
        }
        order: {
            showProductsImages(): void
            setOrderInfo(info: OrderInfo): void
        }

        delivery: {
            setList(list: ReceiveItem[]): void
        }
    }
}
