import { store } from "../store/store";
import { addThousandSeparator } from "../utils/addThousandSeparator";

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
	}

	public updateCartTotal() {
		const totalElements = document.querySelectorAll("[data-total-price]");

		if (totalElements.length) {
			let totalPrice = store.getState().total ?? 0;

			totalElements.forEach((totalElement) => {
				totalElement.textContent = `${addThousandSeparator(totalPrice)} ₽`;
			});
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
}
