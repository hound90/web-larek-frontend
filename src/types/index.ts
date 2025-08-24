enum CardCategory {
	SOFT = 'soft',
	HARD = 'hard',
	BUTTON = 'button',
	OTHER = 'other',
	ADDITIONAL = 'additional'
}

const RusToEng = {
	'софт-скил': CardCategory.SOFT,
	'хард-скил': CardCategory.HARD,
	'кнопка': CardCategory.BUTTON,
	'другое': CardCategory.OTHER,
	'дополнительное': CardCategory.ADDITIONAL
} as const

export interface IcardObj {
	id:string
	title:string
	image:string
	price:number | null
	category:string
	descriptions:string
}

export class CategoryTranslate {
	// Преобразует русское название в английское для CSS
	static toEnglish(rusCategory: string): CardCategory {
		return RusToEng[rusCategory as keyof typeof RusToEng]
	}

	// Получает CSS класс
	static getCssClass(rusCategory: string): string {
		const engCategory = this.toEnglish(rusCategory)
		return `card__category card__category_${engCategory}`
	}
}


export interface IcardModel {
	card:IcardObj
	openCard:(data:string) => IcardObj
	closeCard:(id:string) => void;
}

export interface ImodalData {
	validation: boolean;
	errors: string[];
}


export interface IbuyerObj {
	payment: 'card'|'cash'|''
	email:string
	phone:string
	address:string
}