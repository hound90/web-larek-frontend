import { ICard, IOrder, IOrderResult, } from '../types/index'
import { Api, ApiListResponse } from './base/api'


export interface ICatalogAPI {
	getCatalog: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export class CardsAPI extends Api implements ICatalogAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	async getCatalog(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image
			}))
		);
	}
	orderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}


}



