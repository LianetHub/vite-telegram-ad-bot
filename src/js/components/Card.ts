import { CardProps } from "../api/types.ts";
import { formatDate } from "../utils/formatDate.ts";
import { formatNumber } from "../utils/formatNumber.ts";
import { addThousandSeparator } from "../utils/addThousandSeparator";
import { store } from "../store/store.ts";

export class Card {
	private data: CardProps;
	private isInCart: boolean;

	constructor(data: CardProps) {
		this.data = data;
		this.isInCart = false;
	}

	render(): HTMLElement {
		const cardElement = document.createElement("div");
		cardElement.classList.add("card");
		cardElement.setAttribute("id", this.data.id.toString());

		if (store.isInCart(this.data.id)) {
			this.isInCart = true;
		}

		const sortedLanguages = Object.entries(this.data.users_per_lang).sort(([, a], [, b]) => b.count - a.count);

		const countriesList = sortedLanguages
			.map(([lang, { count }]) => {
				const flagSrc = `/img/flags/${lang}.svg`;
				return `<li class="card__countries-item caption-lg">
                <img src="${flagSrc}" alt="Флаг"> ${formatNumber(count)}
              </li>`;
			})
			.slice(0, 3)
			.join("");

		const countriesSide =
			sortedLanguages.length > 3
				? `<div class="card__countries-side">
          <button class="card__countries-more footnote"> 
              Ещё ${sortedLanguages.length - 3} 
              <span class="card__countries-icon">
                <svg><use xlink:href="/img/sprite.svg#icon-chevron-down"></use></svg>
              </span>
          </button>
          <ul class="card__countries-list">
            ${sortedLanguages
				.slice(3)
				.map(([lang, { count }]) => {
					const flagSrc = `/img/flags/${lang}.svg`;
					return `<li class="card__countries-item caption-lg">
                    <img src="${flagSrc}" alt="Флаг"> ${formatNumber(count)}
                  </li>`;
				})
				.join("")}
          </ul>
        </div>`
				: "";

		cardElement.innerHTML = `
        <div class="card__header">
          <div class="card__thumb">
            <img src="${this.data.photo_url}" alt="Иконка приложения">
         </div>
          <div class="card__app">
            <div class="card__app-name callout fw-medium">${this.data.name}</div>
            <a href="https://t.me/${this.data.username}" class="card__app-link link">${this.data.username}</a>
          </div>
        </div>
        <div class="card__body">
          <div class="card__row">
            <div class="card__active subtitle">
              <span class="color-secondary">Актив:</span>
              <span class="fw-medium">${formatNumber(this.data.total_users)}</span>
            </div>
            <button type="button" class="card__time subtitle fw-medium">
              <span class="card__time-value">${formatDate(this.data.next_available_date)}</span>
              <svg><use xlink:href="/img/sprite.svg#icon-chevron-right"></use></svg>
            </button>
          </div>
          <div class="card__row">
            <div class="card__countries">
              <ul class="card__countries-list">
               ${countriesList}
              </ul>
              ${countriesSide}
            </div>
            <div class="card__actions">
              <div class="card__price title-sm fw-semibold">${addThousandSeparator(this.data.total_price)} ${this.data.currency}</div>
              <button type="button" class="card__btn btn btn-icon btn-rounded btn-primary-outline btn-sm ${this.isInCart ? "active" : ""}">
                <span class="icon-plus">
                  <svg>
                    <use xlink:href="img/sprite.svg#icon-plus"></use>
                  </svg>
                </span>
                <span class="icon-minus">
                  <svg>
                    <use xlink:href="img/sprite.svg#icon-minus"></use>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>`;

		return cardElement;
	}
}
