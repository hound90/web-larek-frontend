import { ensureElement } from '../utils/utils';
import { Component } from './Component';
import { IEvents } from './base/events';
import { IPage } from '../types';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _cards: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this._cards = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basket = ensureElement<HTMLElement>('.header__basket', container);

		this._basket.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set cards(items: HTMLElement[]) {
		this._cards.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}