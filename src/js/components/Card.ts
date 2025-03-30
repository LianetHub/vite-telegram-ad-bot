import { CardProps } from "../api/types.ts";
import { formatDate } from "../utils/formatDate.ts";
import { formatNumber } from "../utils/formatNumber.ts";
import { addThousandSeparator } from "../utils/addThousandSeparator";
import { store } from "../store/store.ts";
import { getGridClass } from "../utils/getGridClass.ts";

interface CardOptions {
	data: CardProps;
	isInCart?: boolean;
	hasSending?: boolean;
	hasRemoveButton?: boolean;
	isDisabled?: boolean;
}

export class Card {
	private data: CardProps;
	private isInCart: boolean;
	private hasSending: boolean;
	private hasRemoveButton: boolean;
	private isDisabled: boolean;
	private isOneLanguageCard: boolean;

	constructor(options: CardOptions) {
		this.data = options.data;
		this.isInCart = store.isInCart(this.data.id);
		this.hasSending = options.hasSending ?? false;
		this.hasRemoveButton = options.hasRemoveButton ?? false;
		this.isDisabled = options.isDisabled ?? false;
		this.isOneLanguageCard = Object.keys(this.data.users_per_lang).length === 1;
	}

	render(): HTMLElement {
		const cardElement = document.createElement("div");
		cardElement.classList.add("card");
		this.isDisabled && cardElement.classList.add("card-disabled");
		cardElement.setAttribute("id", this.data.id.toString());

		const cardHeader = this.createCardHeader();
		cardElement.appendChild(cardHeader);

		const cardBody = this.createCardBody();
		cardElement.appendChild(cardBody);

		return cardElement;
	}

	private createCardHeader(): HTMLElement {
		const cardHeader = document.createElement("div");
		cardHeader.classList.add("card__header");

		const cardThumb = document.createElement("div");
		cardThumb.classList.add("card__thumb");

		const img = document.createElement("img");
		img.src = this.data.photo_url;
		img.alt = "Иконка приложения";

		cardThumb.appendChild(img);

		const cardApp = document.createElement("div");
		cardApp.classList.add("card__app");

		const appName = document.createElement("div");
		appName.classList.add("card__app-name", "callout", "fw-medium");
		appName.textContent = this.data.name;

		const appLink = document.createElement("a");
		appLink.href = `https://t.me/${this.data.username}`;
		appLink.classList.add("card__app-link", "link");
		appLink.textContent = this.data.username;

		cardApp.appendChild(appName);
		cardApp.appendChild(appLink);

		cardHeader.appendChild(cardThumb);
		cardHeader.appendChild(cardApp);

		if (this.isOneLanguageCard) {
			const sendingBlock = this.createSendingBlock();
			cardHeader.appendChild(sendingBlock);
		}

		return cardHeader;
	}

	private createCardBody(): HTMLElement {
		const cardBody = document.createElement("div");
		cardBody.classList.add("card__body");

		if (!this.isOneLanguageCard) {
			const cardBodyTop = this.createCardBodyTop();
			cardBody.appendChild(cardBodyTop);
		}

		const cardBodyBottom = this.createCardBodyBottom();
		cardBody.appendChild(cardBodyBottom);

		return cardBody;
	}

	private createCardBodyTop(): HTMLElement {
		const cardRow = document.createElement("div");
		cardRow.className = "card__row";

		const cardActive = this.createActiveBlock();

		cardRow.appendChild(cardActive);

		const sendingBlock = this.createSendingBlock();
		cardRow.appendChild(sendingBlock);

		return cardRow;
	}

	private createSendingBlock(): HTMLElement {
		const sendingBlock = this.hasSending ? this.createSending() : this.createTimeLink();
		return sendingBlock;
	}

	private createCardBodyBottom(): HTMLElement {
		const cardRow = document.createElement("div");
		cardRow.className = "card__row";

		const cardActions = document.createElement("div");
		cardActions.classList.add("card__actions");

		const cardPrice = document.createElement("div");
		cardPrice.classList.add("card__price", "title-sm", "fw-semibold");
		cardPrice.textContent = `${addThousandSeparator(this.data.total_price, true)}\u205F${this.data.currency === "RUB" ? "₽" : this.data.currency}`;

		const actionButtonBlock = this.hasRemoveButton ? this.createRemoveBtn() : this.createAddBtn();

		cardActions.appendChild(cardPrice);
		cardActions.appendChild(actionButtonBlock);

		if (this.isOneLanguageCard) {
			const activeBlock = this.createActiveBlock(true);
			cardRow.appendChild(activeBlock);
		} else {
			const cardCountries = this.createCountriesBlock();
			cardRow.appendChild(cardCountries);
		}

		cardRow.appendChild(cardActions);

		return cardRow;
	}

	private createActiveBlock(hasCountryIcon: boolean = false): HTMLElement {
		const cardActive = document.createElement("div");
		cardActive.className = "card__active subtitle";

		const activeLabel = document.createElement("span");
		activeLabel.className = "color-secondary";
		activeLabel.textContent = "Актив:";

		const activeUsers = document.createElement("span");
		activeUsers.className = "fw-medium";
		activeUsers.textContent = formatNumber(this.data.total_users).toString();

		cardActive.appendChild(activeLabel);
		cardActive.appendChild(activeUsers);

		if (hasCountryIcon) {
			const countryIconBlock = document.createElement("span");
			countryIconBlock.classList.add("card__active-flag");
			const countryIcon = document.createElement("img");
			const countryFlag = Object.keys(this.data.users_per_lang)[0];
			countryIcon.src = `/img/flags/${countryFlag}.svg`;
			countryIcon.alt = "Флаг";

			countryIconBlock.appendChild(countryIcon);

			cardActive.appendChild(countryIconBlock);
		}

		return cardActive;
	}

	private createCountriesBlock(): HTMLElement {
		const cardCountries = document.createElement("div");
		cardCountries.classList.add("card__countries");

		const cardCountriesList = document.createElement("ul");
		cardCountriesList.classList.add("card__countries-list");
		cardCountries.appendChild(cardCountriesList);

		const sortedLanguages = Object.entries(this.data.users_per_lang).sort(([, a], [, b]) => b.count - a.count);

		sortedLanguages.slice(0, 3).forEach(([lang, { count }]) => {
			const listItem = document.createElement("li");
			listItem.classList.add("card__countries-item", "caption-lg");

			const flagImg = document.createElement("img");
			flagImg.src = `/img/flags/${lang}.svg`;
			flagImg.alt = "Флаг";

			const countText = document.createTextNode(` ${formatNumber(count)}`);

			listItem.appendChild(flagImg);
			listItem.appendChild(countText);

			cardCountriesList.appendChild(listItem);
		});

		const countriesSide = sortedLanguages.length > 3 ? document.createElement("div") : null;

		if (countriesSide) {
			countriesSide.classList.add("card__countries-side");

			const moreButton = document.createElement("button");
			moreButton.classList.add("card__countries-more", "footnote", "btn", "btn-white");
			moreButton.textContent = `Ещё ${sortedLanguages.length - 3}`;

			const icon = document.createElement("span");
			icon.classList.add("card__countries-icon");

			const svg = `<svg><use xlink:href="/img/sprite.svg#icon-chevron-down"></use></svg>`;
			icon.insertAdjacentHTML("beforeend", svg);

			moreButton.appendChild(icon);
			countriesSide.appendChild(moreButton);

			const moreCountriesList = document.createElement("ul");
			moreCountriesList.className = `card__countries-list ${getGridClass(sortedLanguages.length - 3)}`;

			sortedLanguages.slice(3).forEach(([lang, { count }]) => {
				const listItem = document.createElement("li");
				listItem.classList.add("card__countries-item", "caption-lg");

				const flagImg = document.createElement("img");
				flagImg.src = `/img/flags/${lang}.svg`;
				flagImg.alt = "Флаг";

				const countText = document.createTextNode(` ${formatNumber(count)}`);

				listItem.appendChild(flagImg);
				listItem.appendChild(countText);

				moreCountriesList.appendChild(listItem);
			});

			countriesSide.appendChild(moreCountriesList);
			cardCountries.appendChild(countriesSide);
		}

		return cardCountries;
	}

	private createRemoveBtn(): HTMLElement {
		const removeBtn = document.createElement("button");
		removeBtn.type = "button";
		removeBtn.classList.add("card__remove");

		const svg = `<svg><use xlink:href="/img/sprite.svg#icon-trash"></use></svg>`;

		removeBtn.insertAdjacentHTML("beforeend", svg);

		return removeBtn;
	}

	private createAddBtn(): HTMLElement {
		const addBtn = document.createElement("button");
		addBtn.type = "button";
		addBtn.classList.add("card__btn", "btn", "btn-icon", "btn-rounded", "btn-primary-outline", "btn-sm");
		this.isInCart && addBtn.classList.add("active");

		const iconPlusBlock = document.createElement("span");
		iconPlusBlock.classList.add("icon-plus");
		const iconPlus = `<svg><use xlink:href="/img/sprite.svg#icon-plus"></use></svg>`;
		iconPlusBlock.insertAdjacentHTML("beforeend", iconPlus);

		const iconMinusBlock = document.createElement("span");
		iconMinusBlock.classList.add("icon-minus");
		const iconMinus = `<svg><use xlink:href="/img/sprite.svg#icon-minus"></use></svg>`;
		iconMinusBlock.insertAdjacentHTML("beforeend", iconMinus);

		addBtn.appendChild(iconPlusBlock);
		addBtn.appendChild(iconMinusBlock);

		return addBtn;
	}

	private createSending(): HTMLElement {
		const sendingBlock = document.createElement("div");
		sendingBlock.classList.add("card__sending");

		const link = document.createElement("a");
		link.href = "";
		link.classList.add("card__sending-btn", "notify");
		link.textContent = "1 рассылка";

		const button = document.createElement("button");
		button.type = "button";
		button.classList.add("card__sending-add", "btn", "btn-icon", "btn-rounded", "btn-primary-outline");

		const svg = `<svg><use xlink:href="/img/sprite.svg#icon-plus"></use></svg>`;

		button.insertAdjacentHTML("beforeend", svg);

		sendingBlock.appendChild(link);
		sendingBlock.appendChild(button);

		return sendingBlock;
	}

	private createTimeLink(): HTMLElement {
		const timeLink = document.createElement("a");
		timeLink.href = "#check-available-date";
		timeLink.setAttribute("data-modal", "");
		timeLink.classList.add("card__time", "subtitle", "fw-medium", "btn", "btn-white");

		const timeValue = document.createElement("span");
		timeValue.classList.add("card__time-value");
		timeValue.textContent = formatDate(this.data.next_available_date);

		const svg = `<svg><use xlink:href="/img/sprite.svg#icon-chevron-right"></use></svg>`;

		timeLink.appendChild(timeValue);
		timeLink.insertAdjacentHTML("beforeend", svg);

		return timeLink;
	}
}
