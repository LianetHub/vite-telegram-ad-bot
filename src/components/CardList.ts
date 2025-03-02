import { CardProps } from "../js/types.ts";
import { Card } from "./Card.ts";

export class CardList {
	private cards: Card[];

	constructor(cardsData: CardProps[]) {
		this.cards = cardsData.map((data) => new Card(data));
	}

	render(): HTMLElement {
		const cardsWrapper = document.createElement("div");
		cardsWrapper.classList.add("cards");

		const cardsContainer = document.createElement("div");
		cardsContainer.classList.add("cards__container");

		this.cards.forEach((card) => {
			cardsContainer.appendChild(card.render());
		});
		cardsWrapper.appendChild(cardsContainer);

		return cardsWrapper;
	}
}
