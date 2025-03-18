import { CardProps } from "../api/types.ts";
import { Card } from "./Card.ts";

type CardType = "default" | "cart";

export class CardList {
	private cards: Card[];
	private cardType: CardType;

	constructor(cardsData: CardProps[], cardType: CardType = "default") {
		this.cardType = cardType;
		this.cards = cardsData.map((data) => {
			return new Card({
				data: data,
				hasSending: this.cardType === "cart",
				hasRemoveButton: this.cardType === "cart",
			});
		});
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
