import { Component } from './Component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { BaseCard } from './BaseCard';
import { IBasketView, ICardActions, ICardBasketData } from '../types/index';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>('.button', this.container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
			this.setDisabled(this._button, true);
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(enable: boolean) {
		this.setDisabled(this._button, !enable);
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}



export class CardBasket extends BaseCard {
	protected _index: HTMLElement;
	protected _btnDelete: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		actions?: ICardActions
	) {
		super('card', container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._btnDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

		if (actions?.onClick) {
			this._btnDelete.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	render(data: ICardBasketData): HTMLElement {
		this.id = data.id;
		this.title = data.title;
		this.price = data.price;
		this.index = data.index;

		return this.container;
	}
}