import { IcardObj, CategoryTranslate } from '../types/index'

export class Cards {
	protected itemElement: HTMLElement
	protected title: HTMLElement
	protected category: HTMLElement
	protected image: HTMLImageElement
	protected price: HTMLElement

	constructor(template: HTMLTemplateElement) {
		this.itemElement = template.content.cloneNode(true) as HTMLElement;
		this.title = this.itemElement.querySelector('.card__title')
		this.category = this.itemElement.querySelector('.card__category')
		this.image = this.itemElement.querySelector('.card__image')
		this.price = this.itemElement.querySelector('.card__price')
	}

	render (item:IcardObj){
		this.title.textContent = item.title
		this.category.textContent = item.category
		this.category.className = CategoryTranslate.getCssClass(item.category)
		this.image.src = item.image
		this.image.alt = item.title;
		this.price.textContent = item.price !== null ? `${item.price} синапсов` : 'Бесценно'
		return this.itemElement
	}
}