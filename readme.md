# Верстка Loft офис

## Страницы

- [Главная](https://aaccent.github.io/loft-office_layout/index.html)
- [Каталог 1 уровня](https://aaccent.github.io/loft-office_layout/catalog.html)
- [Каталог 2 уровня](https://aaccent.github.io/loft-office_layout/catalog-2level.html)
- [Коллекция](https://aaccent.github.io/loft-office_layout/collection.html)
- [Продукт](https://aaccent.github.io/loft-office_layout/product.html)
- [Избранное](https://aaccent.github.io/loft-office_layout/favorites.html)
- [Оформление](https://aaccent.github.io/loft-office_layout/order.html)
- [Отзывы текстовые](https://aaccent.github.io/loft-office_layout/text-reviews.html)
- [Отзывы видео](https://aaccent.github.io/loft-office_layout/video-reviews.html)
- [Отзывы внешние](https://aaccent.github.io/loft-office_layout/external-reviews.html)
- [Блог](https://aaccent.github.io/loft-office_layout/blog.html)
- [Статья](https://aaccent.github.io/loft-office_layout/article.html)
- [Результат поиска](https://aaccent.github.io/loft-office_layout/search-result.html)
- [О нас](https://aaccent.github.io/loft-office_layout/about.html)
- [Сотрудничество](https://aaccent.github.io/loft-office_layout/cooperation.html)
- [Типовая](https://aaccent.github.io/loft-office_layout/content.html)

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

## Поиск

В `window` есть объект `search` с методами

```typescript
interface SearchResultItem {
    title: string
    link: string
}

interface SearchResultProduct {
    title: string
    image: string
    color: string
    price: string
    link: string
}

interface SearchObject {
    /** Выводит результат поиска в правую колонку с категориями */
    setSearchResultCategories(list: SearchResultItem[]): void
    /** Выводит результат поиска в левую колонку с продуктами */
    setSearchResultProducts(list: SearchResultProduct[]): void
}
```

Изначальный список популярных категорий и продуктов сохраняется в переменную.
Если пользователь очищает поле поиска, то выводятся сохраненные списки.

При вызове `search.setSearchResultCategories()` если список в аргументе будет пустым,
то выводит сообщение, что ничего не нашлось.

При вызове `search.setSearchResultProducts()` если список в аргументе будет пустым,
то список который был выведен в изначальной верстке.

## Гео

В `window` есть объект `geo` с методами

```typescript
interface GeoItem {
    title: string
    link: string
}

interface GeoObject {
    /**
     * Выводит результат поиска в список под полем
     * @param list - Выводимый список
     * @param handler - Обработчик нажатия на город из выводимого списка
     * */
    setSearchResult(list: GeoItem[], handler?: (event: MouseEvent) => void): void
    /** Открывает уведомление с уточением города */
    openGeoNotification(): void
    /** Выставляет город во все контейнеры в шапке на сайте с названием города. */
    setCity(text: string): void
}
```

Изначальный список популярных городов сохраняется в переменную.
Если пользователь очищает поле поиска, то выводится сохраненный список городов.

При вызове `geo.setSearchResult()` если список в аргументе будет пустым,
то выводит сообщение, что ничего не нашлось.

`geo.setCity()` выставляет город в:

- Кнопке города в шапке десктоп и мобильной версии
- Уведомлении с уточнением города

Задуманный сценарий использования:

1. Проверка на бэке города
2. Если пользователь ранее не уточнял город, то вызов уведомления через `geo.openGeoNotification()`
3. Пользователь уточняет город и вызывается `geo.setCity()`

## Оформление

На странице оформления нет шапки, если это проблема, то можем дописать сокрытие шапки через стили.

В `window` есть объект `order` с методами

```typescript
interface AdditionalPriceInfo {
    id: number | string
    title: string
    text: string
    /** По умолчанию 'discount' */
    type?: 'discount' | 'info'
}

interface OrderInfo {
    weight?: string
    deliveryPrice?: string
    totalPrice?: string
    /**
     * Если массив пустой, то убирает все элементы.
     * Поле нужно для добавления дополнительных скидок.
     * Если с таким `id` уже существует, то заменяет его данные.
     * Если `type` будет `discount`, то `text` будет выводиться красным
     * */
    additional?: AdditionalPriceInfo[]
}

interface OrderObject {
    /** Выставляет цену, вес, скидки и прочую информацию о цене */
    setOrderInfo(info: OrderInfo): void
}
```

Если пользователь пытается изменить корзину со страницы оформления,
то изменения в списке с фотками автоматически отображаются, это не нужно регулировать.

Но что нужно регулировать - это цены и информацию о заказе через метод `order.setOrderInfo()`

Например, я хочу выставить, что в корзине:

- Вес `15кг`,
- Общая стоимость заказа `4500₽`
- Скидка 15%, что вычитает `— 1250 ₽`

Для этого мне нужно вызвать метод с аргументами:

```typescript
setOrderInfo({
    weight: '15 кг',
    totalPrice: '5000 ₽',
    additional: [
        {
            id: 'discount',
            title: 'Скидка 15%',
            text: '— 1250 ₽',
            type: 'discount',
        },
    ],
})
```

Выбранную доставку можно отслеживать по изменению полей<br>
`input.delivery-method__input`

Выбранные пункт выдачи или адресс можно отслеживать по изменению скрытого поля<br>
`.delivery-method__final input[name="delivery-address"]`

Когда пользователь выберет вариант доставки и пункт выдачи, то нужно отобразить это в цене:

- Стоимость доставки `500₽`
- Общая стоимость заказа станет `5000₽`

```typescript
setOrderInfo({
    totalPrice: '5000 ₽',
    deliveryPrice: '500 ₽',
})
```

И после ввода промокода нужно изменить так-же цену:

- Промокод делает скидку в `500₽`
- Общая стоимость заказа станет `4500₽`

```typescript
setOrderInfo({
    totalPrice: '4500 ₽',
    additional: [
        {
            id: 'promocode',
            title: 'Промокод',
            text: '— 500 ₽',
            type: 'discount',
        },
    ],
})
```

Если с применением промокода скидка не должна применяться, то можно удалить все допы через:

```typescript
setOrderInfo({
    additional: [],
})
```

И снова указать промокод

```typescript
setOrderInfo({
    additional: [
        {
            id: 'promocode',
            title: 'Промокод',
            text: '— 500 ₽',
            type: 'discount',
        },
    ],
})
```

## Пункты выдачи

По умолчанию список пунктов выдачи пустой, его нужно заполнять через метод `window.delivery.setList()`:

```typescript
interface ReceiveItem {
    id: number | string
    address: string
    price: number
    date: string
    coords: [number, number]
}

interface DeliveryObject {
    /** Выставляет список пунктов выдачи в попапе доставок */
    setList(list: ReceiveItem[]): void
}
```

Попап пунктов выдачи один на странице, а вариантов доставки с пунктами много.
Для решения можно отслеживать открытие попапа `.points` через пользовательское событие `opened`:

```typescript
export interface OpenPopupEvent extends CustomEvent {
    detail: {
        /** Кнопка которая открыла попап. Если `null`, то попап открылся через код */
        target: HTMLElement | null
    }
}

document.querySelector('.points')?.addEventListener('opened', (event: OpenPopupEvent) => {
    // Код для выявления какой способ доставки выбран...
    // Для выявления можно использовать input'ы способа доставки
})
```

В обработчике можно уже узнать какой пункт выдачи выбран через `input:checked` селектор.
Далее вызывать `delivery.setList()` с нужными пунктами
