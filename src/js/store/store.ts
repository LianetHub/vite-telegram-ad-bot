import { Api } from "../api/api";
import { EventEmitter } from "./EventEmitter";

// types.ts
export interface CardState {
	id: string;
	isInCart: boolean;
	name: string;
	username: string;
	total_users: number;
	total_price: number;
	currency: string;
	photo_url: string;
	next_available_date: string;
}

export interface StoreState {
	cards: CardState[];
	user?: { name: string; email: string };
	filters?: { category: string; priceRange: [number, number] };
}

class Store {
	private state = {
		products: [] as any[],
		loading: false,
		error: null as string | null,
		cart: [] as string[],
	};

	private events = new EventEmitter();

	getState() {
		return this.state;
	}

	subscribe(event: string, callback: () => void) {
		this.events.on(event, callback);
	}

	async fetchProducts(params: any) {
		this.state.loading = true;
		this.events.emit("loading:start");

		try {
			const response = await Api.searchCatalog(params);
			if ("error" in response) throw new Error(response.error);

			this.state.products = response.data;
			this.events.emit("products:loaded");
		} catch (error) {
			this.state.error = error.message;
			this.events.emit("error", error.message);
		} finally {
			this.state.loading = false;
			this.events.emit("loading:end");
		}
	}

	addToCart(itemId: string) {
		if (!this.state.cart.includes(itemId)) {
			this.state.cart.push(itemId);
			this.events.emit("cart:update");
		}
	}

	removeFromCart(itemId: string) {
		this.state.cart = this.state.cart.filter((id) => id !== itemId);
		this.events.emit("cart:update");
	}

	// isCardInCart(id: string): boolean {
	// 	return this.cardState[id] || false;
	// }
}

export const store = new Store();
