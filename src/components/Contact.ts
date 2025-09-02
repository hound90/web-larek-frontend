import { IOrdersForm } from '../types';
import { Form } from './Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Contact extends Form<IOrdersForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>(
			'input[name=email]',
			this.container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'input[name=phone]',
			this.container
		);

		// Обработчики input
		this._email.addEventListener('input', () => {
			this.events.emit('form:change', {
				field: 'email',
				value: this._email.value,
			});
		});

		this._phone.addEventListener('input', () => {
			this.events.emit('form:change', {
				field: 'phone',
				value: this._phone.value,
			});
		});

		// Обработчик submit
		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}
}