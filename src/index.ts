import './scss/styles.scss';
import './components/base/api';
import { CardsAPI } from './components/CardsAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Card } from './components/Card';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { AppState } from './components/State';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ContactsError, ICard, IErrorsForm } from './types';
import { Basket, CardBasket } from './components/basket';
import { Order } from './components/Order';
import { Contact } from './components/Contact';
import { Success } from './components/Success';

const events = new EventEmitter();
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const popupElement = document.querySelector('#modal-container') as HTMLElement

const api = new CardsAPI(CDN_URL, API_URL)
const modal = new Modal(popupElement, events)
const appState = new AppState({}, events);
const page = new Page(document.body, events)
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contact(cloneTemplate(contactsTemplate), events);


events.on('items:changed', () => {
	page.cards = appState.cards.map((item) => {
		const card = new Card(`card`, cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:select', item)
			},
		})
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		})
	})
})


events.on('card:select', (item: ICard) => {
	if (item) {
		api.getProductItem(item.id)
		.then((res) => {
			let isInBasket = appState.order.items.includes(res.id);
			const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
				onClick: (evt) => {
					const button = evt.target as HTMLButtonElement;
					if (button.classList.contains('card__button')) {
						if (isInBasket) {
							appState.toggleOrderItem(res.id, false);
							// Используем метод setInBasket карточки
							card.setInBasket(false);
							isInBasket = false;
						} else {
							appState.toggleOrderItem(res.id, true);
							// Используем метод setInBasket карточки
							card.setInBasket(true);
							isInBasket = true;
						}
						page.counter = appState.order.items.length;
						events.emit('basket:changed');
					}
				},
			})

			modal.render({
				content: card.render({
					title: res.title,
					image: res.image,
					description: res.description,
					price: res.price,
					category: res.category,
				}),
			})
		})
		.catch((err) => {
			console.error(`Error: ` + err)
		})
	} else {
		modal.close()
	}
})

events.on('basket:changed', () => {
	const basketCards = appState.getCards();

	basket.items = basketCards.map((cardItem, index) => {
		const card = new CardBasket(cloneTemplate(basketCardTemplate), {
			onClick: () => {
				appState.toggleOrderItem(cardItem.id, false);
			},
		});

		return card.render({
			id: cardItem.id,
			title: cardItem.title,
			price: cardItem.price,
			index: index + 1,
		});
	});

	page.counter = appState.order.items.length;
	basket.total = appState.total();
	basket.selected = appState.order.items;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render()
	});
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: appState.order.address || '',
			payment: appState.order.payment || '',
			valid: appState.isFilledFieldsOrder(),
			errors: []
		})
	});
});

events.on(
	'order:change',
	(data: { field: keyof IErrorsForm; value: string }) => {
		appState.setField(data.field, data.value);
	}
);



events.on('contacts:open', () => {
	const validation = appState.isFilledFieldsContacts();
	contact.valid = validation;
	contact.errors = validation ? '' : 'Не заполнены обязательные поля';
	modal.render({
		content: contact.render({
			email: appState.order.email,
			phone: appState.order.phone,
			valid: appState.isFilledFieldsContacts(),
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	if (appState.validateContacts()) {
		api.orderProduct(appState.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appState.clearBasket();
				}
			});
			success.total = result.total;
			modal.render({ content: success.render({}) });
		})
		.catch((err) => {
			contact.errors = 'Ошибка при оформлении заказа';
		});
	} else {
		contact.errors = 'Заполните email и телефон корректно';
	}
});

events.on('form:change', (data: { field: keyof IErrorsForm; value: string }) => {
	appState.setField(data.field, data.value);

	if (['address', 'payment'].includes(data.field)) {
		order.valid = appState.validateOrder();
	}

	if (['email', 'phone'].includes(data.field)) {
		contact.valid = appState.validateContacts();
	}
});

events.on('formContactsErrors:change', (errors: ContactsError) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;

	contact.errors = Object.values({ email, phone })
	.filter((i) => !!i)
	.join('; ');
});

events.on('formOrderErrors:change', (errors: Partial<IErrorsForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
	.filter((i) => !!i)
	.join('; ');
});


events.on('order:submit', () => {
	if (appState.validateOrder()) {
		events.emit('contacts:open');
	} else {
		order.errors = 'Заполните адрес и выберите способ оплаты';
	}
});

api.getCatalog()
.then(appState.setCards.bind(appState))
.catch(err => console.log(err))