import { Modal } from "../../components/Modal";
import { EventEmitter } from "../../store/EventEmitter";
import { store } from "../../store/store";
import { removeLoading } from "../../utils/buttonLoadingUtils";
import { RangeSlider } from "../../components/RangeSlider";
import { addThousandSeparator } from "../../utils/addThousandSeparator";

export class UsersFilterHandler {
	private usersRangeSlider: RangeSlider | null = null;

	constructor(private eventEmitter: EventEmitter, private modal: Modal) {
		this.initEventListeners();
	}

	public initUsersRangeSlider() {
		const rangeUsers = document.querySelector("#range-users") as HTMLElement;
		const rangeUsersMinInput = document.querySelector("#start-users-input") as HTMLInputElement;
		const rangeUsersMaxInput = document.querySelector("#end-users-input") as HTMLInputElement;

		if (this.usersRangeSlider) {
			const minValue = parseInt(rangeUsersMinInput.defaultValue.replace(/\s/g, ""));
			const maxValue = parseInt(rangeUsersMaxInput.defaultValue.replace(/\s/g, ""));
			this.usersRangeSlider.resetSlider(minValue, maxValue, minValue, maxValue);
			return;
		}

		if (rangeUsers && rangeUsersMinInput && rangeUsersMaxInput) {
			this.usersRangeSlider = new RangeSlider(rangeUsers, rangeUsersMinInput, rangeUsersMaxInput);
		}
	}

	private initEventListeners() {
		document.addEventListener("click", this.handleClick.bind(this));
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target) return;

		const completeUsersBtn = target.closest("[data-users-complete]") as HTMLButtonElement | null;
		if (completeUsersBtn) {
			const resetUsersBtn = document.querySelector("[data-users-reset]") as HTMLButtonElement;

			if (!this.hasUsersFiltersChanged()) {
				this.modal.closeModal();
				if (this.isStoreFiltersChangedFromDefault()) {
					this.eventEmitter.emit("filters:users-reset", true);
					this.removeTogglerState();
					resetUsersBtn.classList.remove("hidden");
				}

				return;
			}

			this.modal.closeModal();
			this.updateUsersUI();
			this.eventEmitter.emit("filters:complete");

			setTimeout(() => {
				resetUsersBtn.classList.remove("hidden");
			}, 200);
		}

		const resetUsersBtn = target.closest("[data-users-reset]") as HTMLButtonElement | null;
		if (resetUsersBtn) {
			this.modal.closeModal();
			this.eventEmitter.emit("filters:users-reset", true);
			this.removeTogglerState();
		}

		const btnResetSort = target.closest(".btn__reset") as HTMLElement | null;
		if (btnResetSort) {
			let btnWrapper = btnResetSort?.closest(".header__sort-btn");

			if (btnWrapper?.getAttribute("href") === "#select-users") {
				this.removeTogglerState();
				this.eventEmitter.emit("filters:users-reset", true);
			}
		}
	}

	public updateUsersUI(forceSyncWithStore: boolean = false) {
		const btn = document.querySelector("[data-users-toggler]");
		const btnWrapperText = btn?.querySelector(".btn__value") as HTMLElement;

		const rangeUsersMinInput = document.querySelector("#start-users-input") as HTMLInputElement | null;
		const rangeUsersMaxInput = document.querySelector("#end-users-input") as HTMLInputElement | null;

		const { users_min, users_max } = store.getState().filters;

		if (forceSyncWithStore) {
			if (rangeUsersMinInput) {
				rangeUsersMinInput.value = users_min !== undefined ? String(users_min) : rangeUsersMinInput.defaultValue;
			}
			if (rangeUsersMaxInput) {
				rangeUsersMaxInput.value = users_max !== undefined ? String(users_max) : rangeUsersMaxInput.defaultValue;
			}

			this.usersRangeSlider?.onInputChange(true);
		}

		if (users_min !== undefined || users_max !== undefined) {
			btn?.classList.add("selected");
		}

		if (users_min !== undefined && users_max !== undefined) {
			const formattedMin = addThousandSeparator(users_min);
			const formattedMax = addThousandSeparator(users_max);

			btnWrapperText.textContent = `${formattedMin} – ${formattedMax}\u202Fчел.`;
		} else if (users_min === undefined && users_max !== undefined) {
			const formattedMax = addThousandSeparator(users_max);

			btnWrapperText.textContent = `до ${formattedMax}\u202Fчел.`;
		} else if (users_min !== undefined && users_max === undefined) {
			const formattedMin = addThousandSeparator(users_min);

			btnWrapperText.textContent = `${formattedMin}\u202Fчел.`;
		}
	}

	public removeTogglerState() {
		const btnToggler = document.querySelector("[data-users-toggler]");
		btnToggler?.classList.remove("selected");
		const btnWrapperText = btnToggler?.querySelector(".btn__value") as HTMLElement;
		btnWrapperText.textContent = "Количество пользователей";
	}

	public updateUsersButtonText(type: "бот" = "бот") {
		const completeUsersBtn = document.querySelector("[data-users-complete]") as HTMLButtonElement;

		const state = store.getState();
		const quantity = state.cards.length;
		const filters = state.filters;

		const isAllFiltersUndefined = filters && typeof filters === "object" ? Object.values(filters).every((value) => value === undefined) : false;

		const getDeclension = (num: number, word: string): string => {
			if (num % 10 === 1 && num % 100 !== 11) return `${word}а`;
			if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return `${word}а`;
			return `${word}ов`;
		};

		let priceSpan = completeUsersBtn.querySelector(".complete-btn__price");
		if (priceSpan) priceSpan.remove();

		if (quantity > 0) {
			let text: string;

			if (isAllFiltersUndefined || !this.hasUsersFiltersChanged()) {
				text = "Показать все";
			} else {
				text = `Показать ${quantity} ${getDeclension(quantity, type)}`;
			}

			completeUsersBtn.textContent = "";
			priceSpan = document.createElement("span");
			priceSpan.className = "complete-btn__price";
			priceSpan.textContent = text;
			completeUsersBtn.appendChild(priceSpan);
		} else {
			completeUsersBtn.textContent = "Показать 0 ботов";
		}

		removeLoading(completeUsersBtn);
	}

	private hasUsersFiltersChanged(): boolean {
		const usersMinInput = document.querySelector<HTMLInputElement>("input[name='users_min']");
		const usersMaxInput = document.querySelector<HTMLInputElement>("input[name='users_max']");

		const normalize = (value: string) => value.replace(/[^\d]/g, "");

		const usersMinChanged = usersMinInput && normalize(usersMinInput.value) !== normalize(usersMinInput.defaultValue);
		const usersMaxChanged = usersMaxInput && normalize(usersMaxInput.value) !== normalize(usersMaxInput.defaultValue);

		return !!usersMinChanged || !!usersMaxChanged;
	}

	private isStoreFiltersChangedFromDefault(): boolean {
		const state = store.getState();

		if (!state.tempFilters) return true;

		const { users_min, users_max } = state.tempFilters;

		const usersMinInput = document.querySelector<HTMLInputElement>("input[name='users_min']");
		const usersMaxInput = document.querySelector<HTMLInputElement>("input[name='users_max']");

		const normalize = (value: string) => value.replace(/[^\d]/g, "");
		const defaultMin = usersMinInput ? parseInt(normalize(usersMinInput.defaultValue)) : undefined;
		const defaultMax = usersMaxInput ? parseInt(normalize(usersMaxInput.defaultValue)) : undefined;

		const isMinChanged = users_min !== undefined && users_min !== defaultMin;
		const isMaxChanged = users_max !== undefined && users_max !== defaultMax;

		return isMinChanged || isMaxChanged;
	}
}
