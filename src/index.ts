import './scss/styles.scss'
import './components/base/api'
import { CardsAPI } from './components/CardsAPI'
import { API_URL, CDN_URL } from './utils/constants'
import { Cards } from './components/Cards'

const template = document.querySelector('#card-catalog') as HTMLTemplateElement
const contentElement = document.querySelector('.gallery')

const api = new CardsAPI(CDN_URL, API_URL)


api.getCatalog()
	.then((items) => {
		items.forEach(item => {
			const cardItem = new Cards(template)
			const itemElement = cardItem.render(item)
			contentElement.prepend(itemElement)
		})
	})
	.catch(err => console.log(err))


api.getCatalog()
	.then((res) => console.log(res))
	.catch(err => console.log(err))

