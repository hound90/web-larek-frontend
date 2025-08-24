import { IcardObj  } from '../types/index'
import { Api, ApiListResponse } from './base/api'


export interface ICatalogAPI {
	getCatalog: () => Promise<IcardObj[]>;
}

export class CardsAPI extends Api implements ICatalogAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCatalog(): Promise<IcardObj[]> {
		return this.get('/product').then((data: ApiListResponse<IcardObj>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image
			}))
		);
	}


}



