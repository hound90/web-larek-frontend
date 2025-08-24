import { IcardObj, IcardModel } from '../types/index'
import { IEvents } from './base/events'


export class CardModel implements IcardModel {
	protected _cards:IcardObj[]

	constructor() {
		this._cards = []
	}

	set cards(data:IcardObj[]) {
		this._cards = data
	}

	get cards(){
		return this._cards
	}

	openCard (data: string) {
		const onCard:IcardObj
		this._cards.onclick
	}

}