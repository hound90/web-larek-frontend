// import { Card } from './Component'
// import { ICard, CategoryTranslate } from '../types/index'
//
// export class PreviewCard extends Card {
// 	private button: HTMLButtonElement;
// 	private description: HTMLElement;
//
// 	constructor(
// 		template: HTMLTemplateElement,
// 		private onButtonClick: (item: ICard) => void
// 	) {
// 		super(template);
// 	}
//
// 	protected initializeElements(): void {
// 		this.button = this.itemElement.querySelector('.card__button');
// 		this.description = this.itemElement.querySelector('.card__text');
// 	}
//
// 	protected setupEvents(): void {
// 		if (this.button) {
// 			this.button.addEventListener('click', (event) => {
// 				event.stopPropagation();
// 				if (this.cardData) {
// 					this.onButtonClick(this.cardData);
// 				}
// 			});
// 		}
// 	}
//
// 	protected fillAdditionalData(item: ICard): void {
// 		if (this.description) {
// 			this.description.textContent = item.description || 'Описание отсутствует';
// 		}
// 	}
// }