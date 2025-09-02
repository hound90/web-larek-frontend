import {
	ContactsError,
	FormError,
	IAppState,
	ICard,
	IErrorsForm,
	IOrder,
} from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	cards: ICard[];
	basket: string[];
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: null,
		items: [],
	};
	preview: string | null;
	formContactsErrors: ContactsError = {};
	formErrors: FormError = {};

	toggleOrderItem(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = [...new Set([...this.order.items, id])];
		} else {
			this.order.items = this.order.items.filter((it) => it !== id);
		}
		this.events.emit('basket:changed');
	}

	clearBasket() {
		this.order.items.forEach((id) => this.toggleOrderItem(id, false));
		this.clearOrderFields();
		this.events.emit('basket:changed', { order: this.order });
	}

	total() {
		return (this.order.total = this.order.items.reduce(
			(acc, curr) =>
				acc + Number(this.cards.find((it) => it.id === curr)?.price || 0),
			0
		));
	}

	setCards(items: ICard[]) {
		this.cards = items;
		this.events.emit('items:changed', { cards: this.cards });
	}

	getCards(): ICard[] {
		return this.cards.filter((item) => this.order.items.includes(item.id));
	}

	isFilledFieldsOrder(): boolean {
		return !!this.order.address && !!this.order.payment;
	}

	isFilledFieldsContacts(): boolean {
		return !!this.order.email && !!this.order.phone;
	}

	clearOrderFields() {
		this.order.email = '';
		this.order.address = '';
		this.order.payment = '';
		this.order.phone = '';
	}

	setField(field: keyof IErrorsForm, value: string) {
		if (field === 'payment') {
			if (value === 'card' || value === 'cash' || value === '') {
				this.order[field] = value as 'card' | 'cash' | '';
			} else {
				console.warn(`Недопустимое значение для payment: ${value}`);
				return;
			}
		} else {
			this.order[field] = value;
		}

		if (['address', 'payment'].includes(field)) {
			this.validateOrder();
		}

		if (['email', 'phone'].includes(field)) {
			this.validateContacts();
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) errors.address = 'Необходимо указать адрес';
		if (!this.order.payment)
			errors.payment = 'Необходимо указать способ оплаты';

		this.formErrors = errors;
		this.events.emit('formOrderErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formContactsErrors = {};

		// Валидация email
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!this.isValidEmail(this.order.email)) {
			errors.email = 'Некорректный формат email';
		}

		// Валидация телефона
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!this.isValidPhone(this.order.phone)) {
			errors.phone = 'Некорректный формат телефона';
		}

		this.formContactsErrors = errors;
		this.events.emit('formContactsErrors:change', this.formContactsErrors);
		return Object.keys(errors).length === 0;
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private isValidPhone(phone: string): boolean {
		const cleanedPhone = phone.replace(/\D/g, '');
		return cleanedPhone.length === 11 && /^[78]/.test(cleanedPhone);
	}
}