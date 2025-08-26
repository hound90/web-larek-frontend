import './scss/styles.scss'
import './components/base/api'
import { CardsAPI } from './components/CardsAPI'
import { API_URL, CDN_URL } from './utils/constants'
import { Card } from './components/Card'
import { EventEmitter } from "./components/base/events"
import { Modal } from "./components/Modal"
// import { PreviewCard } from "./components/CardPreview"
import { Page } from './components/Page'
import { State } from "./components/State"
import { ensureElement, cloneTemplate } from './utils/utils'
import { ICard } from './types/index'

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement

const contentElement = document.querySelector('.gallery')
const cardPopup = document.querySelector('#modal-container') as HTMLElement



const api = new CardsAPI(CDN_URL, API_URL)
const events = new EventEmitter()
const modal = new Modal(cardPopup, events)
const state = new State(events)
const page = new Page(document.body, events)

events.on('items:changed', () => {
	page.cards = state.cards.map((item) => {
		const card = new Card(`card`, cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:select', item)
			},
		})
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		})
	})
})


events.on('card:select', (item: ICard) => {
	if (item) {
		api
			.getProductItem(item.id)
			.then((res) => {
				const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
					onClick: (evt) => {
						const button = evt.target as HTMLButtonElement
						if (button.textContent === 'Купить') {
							button.textContent = 'В корзину'
							state.toggleOrderItem(res.id, true)
							page.counter = state.order.items.length
							events.emit('basket:changed')
						} else if (button.textContent === 'В корзину') {
							events.emit('basket:open', item)
						}
					},
				})

				card.setInBasket(state.order.items.includes(res.id))

				modal.render({
					content: card.render({
						title: res.title,
						image: res.image,
						description: res.description,
						price: res.price,
						category: res.category,
					}),
				})
			})
			.catch((err) => {
				console.error(`Error: ` + err)
			})
	} else {
		modal.close()
	}
})



api.getCatalog()
	.then(state.setCards.bind(state))
	.catch(err => console.log(err))