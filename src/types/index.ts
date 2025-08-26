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

export interface ICard {
	id:string
	title:string
	image:string
	price:number | null
	category:string
	description?:string
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

export interface IOrder extends IContact {
	total: number
	items: string[]
	payment: string
	address: string
}



export interface IbuyerObj {
	payment: 'card'|'cash'|''
	email:string
	phone:string
	address:string
}
export interface IContact {
	email: string
	phone: string
}
export interface IBasket {
	items: HTMLElement[]
	total: number
	selected: string[]
}

export interface IOrderForm extends ContactsError, OrderError{}

export interface IOrderResult {
	id: string
	total: number;
}

export type OrderError = {
	address?: string;
	payment?: string;
};

export type ContactsError = {
	email?: string;
	phone?: string;
};

export interface IOrdersForm extends IState {
	items: string[];
	total: number;
	address: string;
	payment: string;
	email: string;
	phone: string;
}

export interface IState {
	validation: boolean;
	errors: string[];
}