import { Component } from './Component';
import { ensureElement } from '../utils/utils';
import { ICard } from '../types';

export abstract class BaseCard extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement) {
		super(container);
		this.initializeElements();
	}

	protected initializeElements(): void {
		this._title = ensureElement<HTMLElement>(
			`.${this.blockName}__title`,
			this.container
		);
		this._price = ensureElement<HTMLElement>(
			`.${this.blockName}__price`,
			this.container
		);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title?.textContent || '';
	}

	set price(value: number | null) {
		if (value === null || isNaN(value)) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}
}