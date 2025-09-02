import { Form } from './Form';
import { IErrorsForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IErrorsForm> {
	protected _submit: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _buttonCard: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this._buttonCash = ensureElement<HTMLButtonElement>(
			'[name=cash]',
			this.container
		);
		this._buttonCard = ensureElement<HTMLButtonElement>(
			'[name=card]',
			this.container
		);

		if (this._buttonCash) {
			this._buttonCash.addEventListener('click', () => {
				this.onPaymentChange('cash');
				this.toggleClass(this._buttonCash, 'button_alt-active', true);
				if (this._buttonCard) {
					this.toggleClass(this._buttonCard, 'button_alt-active', false);
				}
				this.events.emit('form:change', {
					field: 'payment',
					value: 'cash',
				});
			});
		}

		if (this._buttonCard) {
			this._buttonCard.addEventListener('click', () => {
				this.onPaymentChange('card');
				this.toggleClass(this._buttonCard, 'button_alt-active', true);
				if (this._buttonCash) {
					this.toggleClass(this._buttonCash, 'button_alt-active', false);
				}
				this.events.emit('form:change', {
					field: 'payment',
					value: 'card',
				});
			});
		}

		const addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		if (addressInput) {
			addressInput.addEventListener('input', () => {
				this.events.emit('form:change', {
					field: 'address',
					value: addressInput.value,
				});
			});
		}
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set address(value: string) {
		const addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		if (addressInput) {
			addressInput.value = value;
		}
	}
}