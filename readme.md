# Верстка Loft офис

## Скрипты и стили

Скрипты и стили разбиты на части:

- Для всех страниц (`main.bundle.js` и `styles.css`)
- Слайдеры для всех страниц (`swiper.bundle.js`)
- Главная страница (`main-page.bundle.js` и `main-page.styles.css`)
- Каталог (`catalog.bundle.js` и `catalog.styles.css`)
- Страница коллекции (`collection.bundle.js` и `collection.styles.css`)
- Страница продукта (`product.bundle.js` и `product.styles.css`)
- Остальные (`other.bundle.js` и `other.styles.css`)

## Корзина

В глобальной области видимости есть объект `cart` с методами:

```typescript
interface Product {
    id: string | number
    title: string
    img: string
    size: string
    color: string
    /* Цена после применения скидки. 
    Нужно указать только цифры, скрипт сам форматирует для вывода ценой.*/
    totalPrice: number
    /* Цена до применения скидки */
    discountPrice?: number
    /* цена за один товар */
    pricePerItem: number
    /* кол-во в наличии */
    stock?: number
    /* кол-во в корзине */
    amount: number
}

interface CartInfo {
    totalPrice?: number
    discountPrice?: number
    deliveryPrice?: string
    weight?: number
}

interface Cart {
    /** Добавляет элементы в корзину, если элемент с таким id уже есть, то заменяет его новыми данными */
    addItems(list: Product[]): void
    /** Полностью заменяет корзину */
    setItems(list: Product[]): void
    /** Убирает элемент из корзины по id. Если элемента с таким id нет - ничего не происходит */
    removeItem(id: Product['id']): void
    /** Очищает корзину */
    clear(): void
    /** Выставляет информацию в корзине */
    setInfo(info: CartInfo): void
}
```

Обратиться к методам можно через глобальный объект `window.cart`, либо напрямую `cart`. Главное чтобы скрипт, который обращается к объекту был после его инициализации.

Методы изменяют цифру у кнопки корзины. При добавлении элемента продукта, разметка элемента корзины копируется из `.cart__product-layout`.

На кнопки изменения количества в корзине и добавления в корзину обработчиков нет. Подразумевается, что сборщик сам реализует с помощью этих методов как ему необходимо.

На кнопки удаления продукта и очистки корзины стоят обработчики, которые вызывают `cart.removeItem()` и `cart.clear()` соответственно.
