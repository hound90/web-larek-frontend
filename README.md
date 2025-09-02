# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
Используемый паттерн проектирования: Проект реализован на основе паттерна MVP. 
Взаимодействие между Моделью и Представлением реализовано через события пользователя.

# Api
### Базовый класс для работы с HTTP-запросами к REST API. Предоставляет основные методы для выполнения GET и POST запросов.

### type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
### Перечисление HTTP-методов, которые используют тело запроса (payload).

`constructor(baseUrl: string, options: RequestInit = {})`

### Параметры:

* `baseUrl: string` - базовый `URL API` сервера
* 
* `options: RequestInit = {}` - дополнительные опции для `fetch` запросов

Инициализирует:

* `this.baseUrl` - сохраняет базовый URL
* 
* `this.options` - настройки запроса с заголовком `Content-Type: application/json` по умолчанию

Свойства
`readonly baseUrl: string`
Базовый `URL API` endpoint'а. Не может быть изменен после создания экземпляра.

`protected options: RequestInit`
Настройки для HTTP-запросов. Включает заголовки и другие параметры `fetch`.
-----------------------
Методы
`protected handleResponse(response: Response): Promise<object>` : Обработка ответов от сервера.

Параметры:

response: Response - объект ответа от fetch
-----------------------
Логика:

Если ответ успешен `(response.ok === true)`, возвращает распарсенный JSON

Если ответ с ошибкой, пытается извлечь сообщение об ошибке из JSON или использует statusText
-----------------------
`get(uri: string): Promise<object>` : Выполнение GET-запроса.
Параметры:

`uri: string - endpoint URI (добавляется к baseUrl)`

Возвращает: Promise с распарсенными данными ответа
-----------------------
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`
Выполнение `POST/PUT/DELETE` запроса с телом.
Параметры:

* `uri: string` - endpoint URI
* 
* `data: object` - данные для отправки (сериализуются в JSON)

`method: ApiPostMethods = 'POST' - HTTP метод`

Возвращает: Promise с распарсенными данными ответа

# CardsAPI
### Специализированный API клиент для работы с каталогом товаров и заказами. Наследуется от базового класса Api.


**Интерфейс: ICatalogAPI**
`interface ICatalogAPI {
getCatalog: () => Promise<ICard[]>;              // Получение всего каталога
getProductItem: (id: string) => Promise<ICard>;  // Получение конкретного товара
orderProduct: (order: IOrder) => Promise<IOrderResult>; // Оформление заказа
}`

### Класс: CardsAPI extends Api implements ICatalogAPI

`constructor(cdn: string, baseUrl: string, options?: RequestInit)`


Параметры:

* `cdn: string` - базовый URL CDN для изображений
* 
* `baseUrl: string` - базовый URL API сервера
* 
* `options?: RequestInit` - дополнительные опции запросов

Свойства
`readonly cdn: string`
`readonly` — это модификатор доступа в TypeScript, который делает свойство или поле доступным только для чтения

Методы
`getProductItem(id: string): Promise<ICard>` : Получение информации о конкретном товаре.

Параметры:

* `id: string` - идентификатор товара

Логика:

Выполняет GET запрос к `/product/{id}`
Модифицирует URL изображения, добавляя CDN префикс
Возвращает объект товара с корректным URL изображения

`getCatalog(): Promise<ICard[]>` : Получение всего каталога товаров.
Возвращает: `Promise` с массивом товаров



**`orderProduct(order: IOrder): Promise<IOrderResult>`** : Оформление заказа.
Параметры:

`order: IOrder `- объект заказа с информацией о товарах и клиенте

Возвращает: Promise с результатом оформления заказа (ID заказа, итоговая сумма и т.д.)

# Component
### Абстрактный базовый класс для создания UI компонентов. Предоставляет общие методы для работы с DOM элементами, 
### управления видимостью, классами и содержимым.

Параметры:

`container: HTMLElement` - корневой DOM-элемент компонента

Модификатор `readonly` гарантирует, что ссылка на `container` не может быть изменена

Модификатор `protected` обеспечивает доступ для наследуемых классов

**Методы**

* `toggleClass(element: HTMLElement, className: string, force?: boolean): void`
Переключение CSS класса на элементе.

Параметры:

* `element: HTMLElement` - целевой DOM-элемент
* 
* `className: string` - имя CSS класса
* 
* `force?: boolean` - опциональный флаг принудительного добавления/удаления

* `setDisabled(element: HTMLElement, state: boolean): void` : Управление состоянием `disabled` элемента.

Параметры:

`element: HTMLElement` - целевой элемент

`state: boolean` - состояние блокировки (true - заблокирован)

Возвращает: HTMLElement - корневой элемент компонента

* `setHidden , setVisible` - скрывает, отображает переданный элемент.

* `setImage()` - установка изображения с обработкой альтернативного текста
Параметры:
`element: HTMLImageElement`
Строгая типизация, что метод работает только с <img> элементами

`src: string` - Обязательный параметр URL изображения

`alt?: string` (опциональный) - Альтернативный текст

* `render(data?: Partial<T>): HTMLElement` : Основной метод рендеринга компонента.

Параметры:
`data?: Partial<T>` - опциональные данные для обновления компонента
`Partial<T>` — это встроенный utility-тип в TypeScript, который делает все свойства типа `T` **необязательными**.


# EventEmitter
### Классическая реализация брокера событий. Брокер событий реализует паттерн "Наблюдатель",
### позволяющий отправлять события и подписываться на события, происходящие в системе.
### Класс используется для связи слоя данных и представления.

Свойства:
`events` - структура хранения событий.

Методы:
`on`- подписка на событие.
`off` - отписка от события.
`emit`- инициализация события.
`onAll` - подписка одновременно на все события.
`offAll` - сброс ВСЕХ обработчиков.
`trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

# BaseCard
### Абстрактный базовый класс для карточек товаров, наследуется от `Component<ICard>`. 
### Предоставляет общую функциональность для отображения карточек товаров для класса Card и CardBasket.

Конструктор
`constructor(protected blockName: string, container: HTMLElement)`

Параметры:
* `blockName: string` - CSS блок компонента
* `container: HTMLElement` - корневой DOM-элемент карточки

Методы
`protected initializeElements(): void` - Инициализация DOM элементов карточки
Использует `ensureElement` для безопасного поиска элементов
Находит элементы по CSS селекторам на основе `blockName`
Инициализирует `_title` и `_price` элементы

Геттеры и сеттеры:

Сеттер `set id` : Устанавливает ID товара в data-атрибут элемента
Геттер `get id` : Возвращает ID товара из data-атрибута
Сеттер `set title` : Устанавливает заголовок товара через наследуемый setText()
Геттер `get title` : Возвращает текущий текст заголовка
Сеттер `set price` : Устанавливает цену товара с обработкой null-значений

Интерфейсы для BaseCard:
interface ICard {
* id?: string;           // Опциональный идентификатор товара
* title: string;         // Обязательное название товара
* image?: string;        // Опциональный URL изображения
* price: number | null;  // Цена (может быть null для бесценных товаров)
* category?: string;     // Опциональная категория товара
* description?: string;  // Опциональное описание товара
}

# Card
### Конкретная реализация карточки товара, наследуется от `BaseCard`. 
### Добавляет функциональность для изображений, описания, кнопок и обработки событий.

Конструктор:

constructor(
    blockName: string,
    container: HTMLElement,
    actions?: ICardActions
)
Параметры:
* `blockName: string` - CSS блок компонента
* `container: HTMLElement` - корневой DOM-элемент карточки
* `actions?: ICardActions` - опциональные обработчики событий

`interface ICardActions {
onClick: (event: MouseEvent) => void; // Обработчик клика
}`
Свойства:
`protected _image: HTMLImageElement`
Элемент изображения товара.

`protected _description: HTMLElement | null = null`
Элемент описания товара (может быть null если отсутствует в шаблоне).

`protected _button: HTMLButtonElement | null = null`
Кнопка действия (может быть null если отсутствует в шаблоне).

`protected _category: HTMLElement`
Элемент категории товара.

Методы
`protected initCardElements(): void` : Инициализация дополнительных DOM элементов карточки.

Особенности:

Использует `try-catch` для опциональных элементов
`_description `и `_button` могут быть `null` если не найдены в DOM
Использует конкретные типы (`HTMLImageElement, HTMLButtonElement`)

`public setInBasket(value: boolean): void` : Обновление состояния кнопки корзины.
Логика:
Если value = true - показывает "Удалить из корзины"
Если value = false - показывает "Купить"
Всегда снимает блокировку кнопки


Сеттеры:
Сеттер `image` : Установка изображения товара.
Использует наследуемый метод `setImage() с alt` текстом из заголовка.

Сеттер `category` : Установка категории товара.
Устанавливает текст категории
Добавляет CSS класс соответствующей категории
`Enum: CardCategory` : Перечисление возможных категорий товаров.
`enum CardCategory {
SOFT = 'soft',          // Софт-скилы
HARD = 'hard',          // Хард-скилы  
BUTTON = 'button',      // Кнопки
OTHER = 'other',        // Другое
ADDITIONAL = 'additional' // Дополнительное
}`

Класс: `CategoryTranslate` : Утилита для преобразования категорий.

Методы:
`static toEnglish(rusCategory: string): CardCategory` - конвертирует русское название в английское

`static getCssClass(rusCategory: string): string` - возвращает CSS класс для категории

Сеттер `description` : Установка описания товара.
Строка - просто устанавливает текст
Массив строк - создает несколько элементов описания

Сеттер `price` : Переопределение цены.
Вызывает базовую логику отображения цены
Дополнительно блокирует кнопку для недоступных товаров

`private setupEvents(actions?: ICardActions): void` : Настройка обработчиков событий.
Логика:
Если передан `actions.onClick` и есть кнопка - вешает обработчик на кнопку
Если кнопки нет - вешает обработчик на весь контейнер карточки

# Basket
### Компоненты для работы с корзиной товаров. Содержит два класса: `Basket` для основной корзины и 
### `CardBasket` для карточек товаров в корзине.

Конструктор
`constructor(container: HTMLElement, protected events: EventEmitter)`

Параметры:
* `container: HTMLElement` - корневой DOM-элемент корзины
* `events: EventEmitter` - экземпляр EventEmitter для работы с событиями

Свойства:
`protected _list: HTMLElement`
Контейнер для списка товаров в корзине.

`protected _total: HTMLElement`
Элемент для отображения общей суммы.

`protected _button: HTMLElement`
Кнопка оформления заказа.

`protected events: EventEmitter`
Экземпляр EventEmitter для генерации событий.

Реализует корзину. Предоставляет сеттеры для изменения отображения корзины.

Сеттеры:

* `items` - меняет содержимое в корзине в зависимости от переданных товаров.
* `total` - меняет значение в элементе суммы товаров на переданное.
* `selected `- переключает активность кнопки.

# CardBasket

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)`

Параметры:

* `container: HTMLElement` : DOM-элемент карточки
* 
* `actions?: ICardActions` : обработчики событий

Свойства
`protected _index: HTMLElement` : Элемент для отображения порядкового номера товара.
`protected _btnDelete: HTMLButtonElement` : Кнопка удаления товара из корзины.

Сеттер `index: number` : Установка порядкового номера товара.

Метод
`render(data: ICardBasketData): HTMLElement` : Рендеринг карточки товара в корзине.
Устанавливает:
* ID товара
* Заголовок товара
* Цену товара
* Порядковый номер

### Интерфейсы
Интерфейс: IBasketView : Описывает структуру данных для компонента корзины.
`interface IBasketView {
items: HTMLElement[];    // Массив DOM-элементов товаров
total: number;           // Общая сумма заказа
selected: string[];      // Массив ID выбранных товаров
}`

Интерфейс: ICardBasketData : Описывает структуру данных для карточки товара в корзине.
`interface ICardBasketData {
id: string;              // ID товара
title: string;           // Название товара
price: number | null;    // Цена товара
index: number;           // Порядковый номер в корзине
}
`

# Page
### Основной компонент страницы, управляющий основными UI элементами. 
### Отвечает за отображение счетчика корзины, галереи товаров и блокировку интерфейса.

Конструктор
`constructor(container: HTMLElement, protected events: IEvents)`

Параметры:

`container: HTMLElement` - корневой DOM-элемент страницы
`events: IEvents` - экземпляр `EventEmitter` для работы с событиями

Свойства:
* protected `_counter: HTMLElement` : Элемент для отображения счетчика товаров в корзине.
* protected `_cards: HTMLElement` : Контейнер для галереи товаров.
* protected `_wrapper: HTMLElement `: Основной wrapper страницы, используется для блокировки интерфейса.
* protected `_basket: HTMLElement` : Элемент кнопки/иконки корзины.
* protected `events: IEvents` : Экземпляр `EventEmitter `для генерации и обработки событий.

Сеттеры
* `counter: number` : Установка значения счетчика товаров в корзине.
* `cards: HTMLElement[]` : Установка списка карточек товаров в галерею.
* `locked: boolean` : Блокировка/разблокировка интерфейса страницы.

Интерфейс: IPage
`interface IPage {
content: HTMLElement; // Основной контент страницы
}`

# Model
### Абстрактный базовый класс для всех моделей данных в приложении. 
### Предоставляет общую функциональность для работы с данными и уведомления об изменениях через систему событий.

Конструктор
`constructor(data: Partial<T>, protected events: IEvents)`

Параметры:

`data: Partial<T>` - данные для модели
`events: IEvents` - экземпляр EventEmitter для работы с событиями

Свойства
`protected events: IEvents` : Экземпляр EventEmitter для генерации событий об изменениях модели.
Методы
`emitChanges(event: string, payload?: object): void` : Уведомление подписчиков об изменениях в модели.

Параметры:
`event: string` - название события
`payload?: object` - опциональные данные для передачи вместе с событием

# Form
### Универсальный компонент формы с валидацией, обработкой ввода и отправки данных.
### Поддерживает различные типы форм через дженерики.

Конструктор
`constructor(protected container: HTMLFormElement, protected events: IEvents)`

Параметры:
`container: HTMLFormElement` - DOM-элемент формы
`events: IEvents` - экземпляр `EventEmitter `для работы с событиями

Свойства
`protected _submit: HTMLButtonElement` : Кнопка отправки формы.
`protected _errors: HTMLElement` : Контейнер для отображения ошибок валидации.
`protected container: HTMLFormElement` : DOM-элемент формы.
`protected events: IEvents` : Экземпляр `EventEmitter` для генерации событий.

Методы
`protected initEventListeners(): void` : Инициализация обработчиков событий формы.
`protected onInputChange(field: keyof T, value: string): void` : Обработка изменений в полях формы.
`protected onPaymentChange(value: string): void` : Специфичный обработчик для изменения способа оплаты.

Сеттеры:
`valid` : Управление состоянием кнопки отправки.
`errors` : Установка текста ошибок валидации.

Метод render
`render(state: Partial<T> & IFormState): HTMLElement` : Обновление состояния формы.

Параметры:
`state: Partial<T> & IFormState` - комбинированное состояние формы и данных

Интерфейс: IFormState
Описывает состояние валидации формы.
`interface IFormState {
valid: boolean;     // Флаг валидности формы
errors: string[];   // Массив ошибок валидации
}`

# Order
### Специализированный класс формы заказа, наследуется от универсальной `Form<IErrorsForm>`.
### Добавляет функциональность для выбора способа оплаты и управления адресом доставки.

Конструктор
`constructor(container: HTMLFormElement, events: IEvents)`

Параметры:
`container: HTMLFormElement` - DOM-элемент формы заказа
`events: IEvents` - экземпляр EventEmitter для работы с событиями

Свойства
`protected _submit: HTMLButtonElement` : Кнопка отправки формы.
`protected _buttonCash: HTMLButtonElement` : Кнопка выбора наличной оплаты.
`protected _buttonCard: HTMLButtonElement` : Кнопка выбора безналичной оплаты.

Обработчики:
* `_buttonCash` : Наличная оплата
* `_buttonCard` : Безналичная оплата
* `addressInput` : Поле адреса

Сеттеры
`valid` : Управление состоянием кнопки отправки формы (переопределяет родительский сеттер).
`address` : Установка значения поля адреса доставки.

Интерфейс: IErrorsForm
`// Наследует от FormError{}:
type FormError = {
address?: string;
payment?: string;
};`
`// Наследует от ContactsError:
type ContactsError = {
email?: string;
phone?: string;
};`

# Contact
### Специализированный класс формы контактной информации, наследуется от универсальной Form<IOrdersForm>.
### Управляет полями ввода email и телефона, обеспечивает валидацию и интеграцию с системой событий приложения.

Конструктор
`constructor(container: HTMLFormElement, events: IEvents)`

Параметры:
* `container: HTMLFormElement `- DOM-элемент формы, содержащий поля ввода
* `events: IEvents` - экземпляр системы событий

Свойства
`protected _email: HTMLInputElement` : Элемент ввода для email адреса.
`protected _phone: HTMLInputElement `: Элемент ввода для номера телефона.

Сеттеры:
`valid` : Управление состоянием кнопки отправки формы.
`phone` : Установка значения поля телефона.
`email` : Установка значения поля email.

Обработчики событий:
`input для email` : Отслеживание изменений в поле email и генерация события.
`input для phone` : Отслеживание изменений в поле телефона и генерация события.
`submit формы` : Обработка отправки контактной формы.

Интерфейсы:
IOrdersForm : Описание структуры данных полного заказа, включая контактную информацию.
`interface IOrdersForm extends IState {
items: string[];
total: number;
address: string;
payment: 'card'|'cash'|'';
email: string;
phone: string;
}`

IContact : Описание структуры исключительно контактных данных.
`interface IContact {
email: string;
phone: string;
}`

# Success
### Класс Success представляет компонент отображения успешного завершения заказа.
### Наследуется от базового класса Component и управляет отображением информации о списанной сумме и кнопкой закрытия.

Конструктор
`constructor(container: HTMLElement, action?: ICardActions)`

Параметры:
`container: HTMLElement` - DOM-элемент контейнера компонента успешного заказа
`action?: ICardActions` - опциональный объект с действиями для обработки событий

Свойства
`protected _close: HTMLElement` : Элемент кнопки закрытия уведомления.
`protected _total: HTMLElement` : Элемент отображения общей суммы списания. 
Хранение и управление элементом отображения итоговой суммы заказа.

Сеттер `total` : Установка и отображение общей суммы списания с правильным склонением.

Обработчик `_close` клика на кнопку закрытия

Интерфейсы
ISuccess : Описание структуры данных для компонента успешного заказа.
`interface ISuccess {
total: number;
}`

ICardActions : Описание действий, которые могут быть выполнены при взаимодействии с компонентом.
`interface ICardActions {
onClick: (event: MouseEvent) => void;
}`

# Modal
### Класс модального окна для отображения различного контента.
### Управляет открытием, закрытием и отображением содержимого в модальном окне.

Конструктор
`constructor(container: HTMLElement, protected events: IEvents)`

Параметры:
`container: HTMLElement` - DOM-элемент модального окна
`events: IEvents` - экземпляр EventEmitter для работы с событиями

Свойства
`protected _closeButton: HTMLButtonElement` : Кнопка закрытия модального окна.
`protected _content: HTMLElement` : Контейнер для содержимого модального окна.
`protected events: IEvents` : Экземпляр EventEmitter для генерации событий.

Обработчики
`_closeButton` : Закрытие по кнопке
`container` : Закрытие по клику на оверлей
`_content` : Предотвращение закрытия при клике на контент

Сеттер `content` : Установка содержимого модального окна.

Методы
`open()` : Открытие модального окна.
`close()` : Закрытие модального окна.
`render(data: IModalData)` : Рендеринг и открытие модального окна.

Интерфейс: IModalData : Описывает структуру данных для модального окна.
`interface IModalData {
content: HTMLElement;  // DOM-элемент для отображения в модальном окне
}`

# AppState
### Основной класс управления состоянием приложения.
### Наследуется от `Model<IAppState>` и отвечает за хранение данных о товарах, корзине, заказе и валидации форм.

Конструктор
Неявно наследует конструктор родительского класса:
`constructor(data: Partial<IAppState>, events: IEvents)`

Свойства
`cards: ICard[]` : Массив всех товаров/карточек в каталоге.
`basket: string[]` : Массив ID товаров, добавленных в корзину.
`order: IOrder` : Объект заказа с контактными данными и составом:
`{
email: '',        // Email покупателя
phone: '',        // Телефон покупателя
address: '',      // Адрес доставки
payment: '',      // Способ оплаты ('card' | 'cash' | '')
total: null,      // Общая сумма заказа
items: []         // Массив ID товаров в заказе
}`
`preview: string | null` : ID товара для предпросмотра (может быть null).
`formContactsErrors: ContactsError` : Объект с ошибками валидации контактных данных.
`formErrors: FormError `: Объект с ошибками валидации данных заказа.

Методы
`toggleOrderItem` : Добавление/удаление товара из заказа.
`clearBasket()` : Полная очистка корзины и данных заказа.
`total() `: Расчет общей суммы заказа.
Возвращает: Сумму всех товаров в корзине
`setCards` : Установка массива товаров.
`getCards()`: Получение товаров, находящихся в корзине.
Возвращает: Отфильтрованный массив товаров
`isFilledFieldsOrder()` : Проверка заполненности полей заказа.
Возвращает: true если адрес и способ оплаты заполнены
`isFilledFieldsContacts()` : Проверка заполненности контактных данных.
Возвращает: true если email и телефон заполнены
`clearOrderFields() `: Очистка всех полей заказа.
`setField(field: keyof IErrorsForm, value: string)` : Назначение: Установка значения поля с валидацией.
`validateOrder()` : Валидация данных заказа.
`validateContacts()` : Назначение: Валидация контактных данных.
`private isValidEmail(email: string)` : Проверка формата email.
`private isValidPhone(phone: string)` : Проверка формата телефона.

Интерфейсы
IAppState
`interface IAppState {
catalog: ICard[];      // Каталог товаров
basket: string[];      // ID товаров в корзине
preview: string | null;// ID товара для предпросмотра
order: IOrder | null;  // Данные заказа
}`

IOrder
`interface IOrder {
items: string[];       // ID товаров
total: number;         // Общая сумма
address: string;       // Адрес доставки
payment: 'card'|'cash'|''; // Способ оплаты
email: string;         // Email
phone: string;         // Телефон
}`

ContactsError
`type ContactsError = {
email?: string;       // Email
phone?: string;       // Телефон
};`

FormError
`type FormError = {
address?: string;     // Адрес доставки
payment?: string;     // Способ оплаты
};`

События приложения
`items:changed` - изменение массива товаров каталога.
`card:select` - выбор карточки.
`basket:changed` - изменение списка товаров корзины.
`basket:open` - открытие модального окна корзины.
`order:open` - открытие окна оформления заказа.
`order:change` - изменение поля в форме.
`contacts:open` - валидация полей формы
`contacts:submit` - проверка заполнения форм
`form:change` - валидацию данных заказа
`formOrderErrors:change` - изменение в списке ошибок валидации формы.
`formContactErrors:change` - изменение в списке ошибок валидации формы.
`order:submit` - отправка формы.
