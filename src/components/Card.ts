import { BaseCard } from './BaseCard';
import { CategoryTranslate, ICardActions } from '../types';
import { ensureElement } from '../utils/utils';

export class Card extends BaseCard {
	protected _image: HTMLImageElement;
	protected _description: HTMLElement | null = null;
	protected _button: HTMLButtonElement | null = null;
	protected _category: HTMLElement;

	constructor(
		blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(blockName, container);
		this.initCardElements();
		this.setupEvents(actions);
	}

	protected initCardElements(): void {
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);

		// Опциональные элементы - если есть в шаблоне
		try {
			this._description = ensureElement<HTMLElement>(
				'.card__text',
				this.container
			);
		} catch {
			this._description = null;
		}

		try {
			this._button = ensureElement<HTMLButtonElement>(
				'.card__button',
				this.container
			);
		} catch {
			this._button = null;
		}
	}

	public setInBasket(value: boolean): void {
		if (this._button) {
			this.setText(this._button, value ? 'Удалить из корзины' : 'Купить');
			this.setDisabled(this._button, false);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			CategoryTranslate.getCssClass(value),
			true
		);
	}

	set description(value: string | string[]) {
		if (!this._description) return;

		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		super.price = value;

		if (this._button) {
			if (value === null || isNaN(value)) {
				this.setDisabled(this._button, true);
				this.setText(this._button, 'Недоступно');
			}
		}
	}

	private setupEvents(actions?: ICardActions): void {
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
			}
		}
	}
}