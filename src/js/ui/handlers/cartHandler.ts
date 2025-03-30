import { CardList } from "../../components/CardList";
import { store } from "../../store/store";
import { addThousandSeparator } from "../../utils/addThousandSeparator";

import { formatNumber } from "../../utils/formatNumber";

interface CartItem {
	currency: string;
	id: number;
	name: string;
	next_available_date: number;
	photo_url: string;
	total_price: number;
	total_users: number;
	username: string;
	users_per_lang: Record<string, { count: number }>;
}

interface LanguageData {
	lang: string;
	count: number;
}

export class CartHandler {
	public handleCartUpdate() {
		const cartQuantity = store.getState().cart.length;
		const bagElement = document.querySelector(".bag");

		if (bagElement) {
			if (cartQuantity > 0) {
				bagElement.classList.add("visible");
			} else {
				bagElement.classList.remove("visible");
			}
		}

		this.renderCards();
		this.updateCartFooter();
		this.updateCartTotal();
	}

	public updateCartTotal() {
		const totalElements = document.querySelectorAll("[data-total-price]");

		if (totalElements.length) {
			let totalPrice = store.getState().total ?? 0;
			document.querySelector("[data-clear-cart]")?.classList.remove("hidden");
			totalElements.forEach((totalElement) => {
				totalElement.textContent = `${addThousandSeparator(totalPrice)} ₽`;
			});
		} else {
			document.querySelector("[data-clear-cart]")?.classList.remove("hidden");
		}
	}

	public clearCartList() {
		const cartList = document.querySelector("#cart-list") as HTMLElement | null;
		const cartContent = document.querySelector(".cart__content") as HTMLElement | null;
		const cartEmptyBlock = document.querySelector(".cart__empty") as HTMLElement | null;
		cartContent?.classList.add("removed");
		cartEmptyBlock?.classList.remove("hide");

		if (cartList) {
			setTimeout(() => {
				cartList.innerHTML = "";
				cartContent?.classList.add("hidden");
				cartContent?.classList.remove("removed");
			}, 300);
		}
	}

	private getCartData(): CartItem[] {
		const cart: string[] = store.getState().cart;
		return store.getState().fullData.filter((card: CartItem) => cart.includes(card.id.toString()));
	}

	private renderCards() {
		console.log("Рендер карточек Корзины");
		const cartItems = this.getCartData();

		if (!cartItems.length) return;

		const cartWrapper = document.querySelector("#cart-list");
		if (!cartWrapper) return;

		cartWrapper.innerHTML = "";

		const cardList = new CardList(cartItems, "cart");
		cartWrapper.appendChild(cardList.render());
	}

	public updateCartFooter(): void {
		const cartItems: CartItem[] = this.getCartData();

		// Обновление общего количества
		const totalBots: number = cartItems.length;
		const totalMessages: number = cartItems.reduce((sum, item) => sum + item.total_users, 0);
		const totalPrice: number = cartItems.reduce((sum, item) => sum + item.total_price, 0);

		const totalPriceElement: HTMLElement | null = document.querySelector("[data-total-price]");
		if (totalPriceElement) {
			totalPriceElement.textContent = `${addThousandSeparator(totalPrice)} ₽`;
		}

		// Обновление текстового описания
		const descElement: HTMLElement | null = document.querySelector(".cart__desc");
		if (descElement) {
			descElement.textContent = `${totalBots} ${this.pluralize(totalBots, ["бот", "бота", "ботов"])} · ${totalBots} ${this.pluralize(totalBots, [
				"рассылка",
				"рассылки",
				"рассылок",
			])} · ${addThousandSeparator(totalMessages)} раз будет отправлено рекламное сообщение`;
		}

		const audienceData: LanguageData[] = this.aggregateUsersByLanguage(cartItems);
		this.updateInfoList(".cart__info-list", audienceData);

		const audienceCaption: HTMLElement | null = document.querySelector(".cart__info-caption");
		if (audienceCaption) {
			audienceCaption.textContent = `Аудитория: ${formatNumber(totalMessages)}`;
		}
	}

	private aggregateUsersByLanguage(cartItems: CartItem[]): LanguageData[] {
		const langCounts: Record<string, number> = {};
		cartItems.forEach((item) => {
			Object.entries(item.users_per_lang).forEach(([lang, data]) => {
				langCounts[lang] = (langCounts[lang] || 0) + data.count;
			});
		});

		return Object.entries(langCounts)
			.sort((a, b) => b[1] - a[1])
			.map(([lang, count]) => ({ lang, count }));
	}

	private updateInfoList(selector: string, data: LanguageData[]): void {
		const listElement: HTMLElement | null = document.querySelector(selector);
		if (listElement) {
			listElement.innerHTML = data.map(({ lang, count }) => `<li>${lang} – ${formatNumber(count)}</li>`).join("\n");
		}
	}

	private pluralize(count: number, words: string[]): string {
		const cases: number[] = [2, 0, 1, 1, 1, 2];
		return words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];
	}
}
