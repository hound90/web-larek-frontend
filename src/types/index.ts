export interface ICatalogAPI {
	getCatalog: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}
//=============================================
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

export class CategoryTranslate {
	// Преобразует русское название в английское для CSS
	static toEnglish(rusCategory: string): CardCategory {
		return RusToEng[rusCategory as keyof typeof RusToEng]
	}

	// Получает CSS класс
	static getCssClass(rusCategory: string): string {
		const engCategory = this.toEnglish(rusCategory)
		return `card__category_${engCategory}`
	}
}
//=============================================
export interface ICard {
	id?:string
	title:string
	image?:string
	price:number | null
	category?:string
	description?:string
}

export interface IPage {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IOrdersForm extends IState {
	items: string[];
	total: number;
	address: string;
	payment: 'card'|'cash'|''
	email: string;
	phone: string;
}
//=============================================
export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: boolean;
}

export interface ICardBasketData {
	id: string;
	title: string;
	price: number | null;
	index: number;
}
//=============================================
export interface IOrder extends IContact {
	payment: 'card'|'cash'|''
	items: string[];
	address:string
	total: number;
}
export interface IContact {
	email: string
	phone: string
}

export interface IOrderResult {
	id: string
	total: number;
}

export interface ISuccess {
	total: number;
}
//=============================================
export interface IErrorsForm extends ContactsError, FormError{}

export type FormError = {
	address?: string;
	payment?: string;
};

export type ContactsError = {
	email?: string;
	phone?: string;
};
//=============================================

export interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IState {
	validation: boolean;
	errors: string[];
}

export interface IModalData {
	content: HTMLElement;
}