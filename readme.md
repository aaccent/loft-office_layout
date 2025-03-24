# Верстка Loft офис

## Страницы

- [Главная](https://aaccent.github.io/loft-office_layout//index.html)
- [Каталог 1 уровня](https://aaccent.github.io/loft-office_layout//catalog.html)
- [Каталог 2 уровня](https://aaccent.github.io/loft-office_layout//catalog-2level.html)
- [Коллекция](https://aaccent.github.io/loft-office_layout//collection.html)
- [Продукт](https://aaccent.github.io/loft-office_layout//product.html)
- [Избранное](https://aaccent.github.io/loft-office_layout//favorites.html)
- [Отзывы текстовые](https://aaccent.github.io/loft-office_layout//text-reviews.html)
- [Отзывы видео](https://aaccent.github.io/loft-office_layout//video-reviews.html)
- [Отзывы внешние](https://aaccent.github.io/loft-office_layout//external-reviews.html)

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

export interface CartNotification {
    image: string
    name: string
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
    /** Показывает уведомление добавления в корзину */
    showNotification(props: CartNotification)
}
```

Обратиться к методам можно через глобальный объект `window.cart`, либо напрямую `cart`.
Главное чтобы скрипт, который обращается к объекту был после его инициализации.

Методы изменяют цифру у кнопки корзины.
При добавлении элемента продукта, разметка элемента корзины копируется из `.cart__product-layout`.

На кнопки изменения количества в корзине и добавления в корзину обработчиков нет.
Подразумевается, что сборщик сам реализует с помощью этих методов как ему необходимо.

На кнопки удаления продукта и очистки корзины стоят обработчики, которые вызывают `cart.removeItem()` и `cart.clear()` соответственно.

## Предзаказ

Чтобы в попапе предзаказа корректно отображался продукт, нужно карточку товара или элемент в данными о товаре обернуть в класс `.preorder-bounds`.

Элементам с заголовком, размером, цветом, картинкой и идентификатором добавить `data-field` аттрибуты:

- id – `data-field="id"`
- Заголовок – `data-field="title"`
- Размер – `data-field="size"`
- Цвет – `data-field="color"`
- Картинка – `data-field="image"`

Тогда при нажатии на открытие попапа `preorder`, скрипт найдёт свои рамки элемента относительно кнопки, найдёт элементы с данными и вставит куда необходимо.

В верстке карточек товара и на детальной товара всё верно расставлено.
Один из примеров правильно расставленных аттрибутов и классов:

```html
<!--Добавляем `preorder-bounds`-->
<div class="some-product preorder-bounds">
    <!-- Для id нужно указать `data-id` аттрибут.
         Необязательно отдельный элемент, это может быть любой элемент внутри `preorder-bounds`.
         Главное указать верные data-* аттрибуты -->
    <div class="some-product__id" data-field="id" data-id="5" style="hidden"></div>
    <div class="some-product__title" data-field="title">Title</div>
    <img class="some-product__image" data-field="image" src="image.jpg" alt="" />
    <div class="some-product__size" data-field="size">192 x 149 x 21</div>
    <div class="some-product__color" data-field="color">Red</div>
    <!-- `preorder-bounds` нужно ставить на родителе полей и кнопки вызова попапа -->
    <button data-action="popup" data-popup="preorder">Предзаказ</button>
</div>
```
