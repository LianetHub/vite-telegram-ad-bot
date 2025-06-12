import { LanguageCode } from "../../api/types";
import { Modal } from "../../components/Modal";
import { EventEmitter } from "../../store/EventEmitter";
import { store } from "../../store/store";
import { addLoading, removeLoading } from "../../utils/buttonLoadingUtils";

export class LanguagesHandler {
	private premiumToggler: HTMLInputElement | null;

	constructor(private eventEmitter: EventEmitter, private modal: Modal) {
		this.initEventListeners();
		this.premiumToggler = document.querySelector("[data-premium-toggler]");
	}

	private languageNames: Record<LanguageCode, string> = {
		en: "English",
		ru: "Русский",
		ar: "Arabic",
		be: "Belarusian",
		ca: "Catalan",
		hr: "Croatian",
		cs: "Czech",
		nl: "Nederlands",
		fi: "Finnish",
		fr: "French",
		de: "German",
		he: "Hebrew",
		hu: "Hungarian",
		id: "Indonesian",
		it: "Italian",
		kk: "Kazakh",
		ko: "Korean",
		ms: "Malay",
		nb: "Norwegian",
		fa: "Persian",
		pl: "Polish",
		"pt-BR": "Portuguese",
		sr: "Serbian",
		sk: "Slovak",
		es: "Spanish",
		sv: "Swedish",
		tr: "Turkish",
		uk: "Ukrainian",
		uz: "Uzbek",
	};

	private initEventListeners() {
		document.addEventListener("click", this.handleClick.bind(this));
		document.querySelector<HTMLInputElement>("[data-premium-toggler]")?.addEventListener("change", () => {
			setTimeout(() => {
				this.eventEmitter.emit("filters:premium-change");
				this.languageUIUpdate();
			}, 0);
		});
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target) return;

		const languagesResetBtn = target.closest("[data-reset-languages]") as HTMLElement | null;
		if (languagesResetBtn) {
			const languageCompleteBtn = document.querySelector("[data-language-complete]") as HTMLButtonElement | null;
			addLoading(languageCompleteBtn);
			this.languageUIUpdate(0);
			this.eventEmitter.emit("filters:languages-reset");
		}

		const languageBtn = target.closest("[data-language-complete]") as HTMLButtonElement | null;
		if (languageBtn) {
			this.modal.closeModal();
			this.eventEmitter.emit("filters:complete");
			this.updateHeaderLanguageUI();
			this.updateAppClassSingleLanguage();
		}
	}

	public languageUIUpdate(count?: number, forceSyncWithStore = false) {
		const selectedLanguages = this.getSelectedLanguages();
		const languageTitle = document.querySelector<HTMLElement>("[data-language-title]");
		const languageWrapper = document.querySelector(".language") as HTMLElement | null;
		const premiumFromStore = this.getPremiumState();

		if (forceSyncWithStore && this.premiumToggler) {
			this.premiumToggler.checked = !!premiumFromStore;
		}

		if (typeof count !== "number") {
			count = selectedLanguages.length;
			document.querySelectorAll<HTMLInputElement>('input[name="languages"]').forEach((languageInput) => {
				languageInput.checked = false;
			});
			selectedLanguages.forEach((lang) => {
				const input = document.querySelector<HTMLInputElement>(`input[name="languages"][value="${lang}"]`);
				if (input) input.checked = true;
			});
		}

		if (count > 0 || this.premiumToggler?.checked) {
			languageWrapper?.classList.add("modal-selected");
		} else {
			languageWrapper?.classList.remove("modal-selected");
		}

		if (languageTitle) {
			if (this.premiumToggler?.checked && count === 0) {
				languageTitle.textContent = "Telegram Premium";
			} else if (count > 0) {
				languageTitle.textContent = "Выбрано";
			}
		}

		console.log(`Количество выбранных языков: ${count}`);
	}

	public updateLanguagesCompleteButtonText(type: "бот" = "бот"): void {
		const languageCompleteBtn = document.querySelector("[data-language-complete]") as HTMLButtonElement;

		const state = store.getState();
		const quantity = state.cards.length;
		const filters = state.filters;

		const hasLanguagesSelected = typeof filters?.languages === "string" && filters.languages.trim() !== "";

		const getDeclension = (num: number, word: string): string => {
			if (num % 10 === 1 && num % 100 !== 11) return `${word}а`;
			if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return `${word}а`;
			return `${word}ов`;
		};

		let priceSpan = languageCompleteBtn.querySelector(".complete-btn__price");
		if (priceSpan) priceSpan.remove();

		let text: string;

		if (hasLanguagesSelected) {
			if (quantity === 0) {
				text = "Показать все";
			} else {
				text = `Показать ${quantity} ${getDeclension(quantity, type)}`;
			}
		} else {
			text = "Показать все";
		}

		languageCompleteBtn.textContent = "";
		priceSpan = document.createElement("span");
		priceSpan.className = "complete-btn__price";
		priceSpan.textContent = text;
		languageCompleteBtn.appendChild(priceSpan);

		removeLoading(languageCompleteBtn);
	}

	private getSelectedLanguages(): LanguageCode[] {
		const state = store.getState();
		const langString = state.filters.languages || "";
		return langString
			.split(",")
			.map((lang) => lang.trim())
			.filter(Boolean) as LanguageCode[];
	}

	private getPremiumState(): boolean | undefined {
		const state = store.getState();
		return state.filters.premium;
	}

	private updateHeaderLanguageUI(): void {
		const selectedLanguages = this.getSelectedLanguages();
		const isPremium = this.getPremiumState();

		const headerBtn = document.querySelector(".header__users") as HTMLElement;
		if (!headerBtn) return;

		const textBody = headerBtn.querySelector(".btn__text-body") as HTMLElement;
		const icon = headerBtn.querySelector(".btn__icon") as HTMLElement;
		const flag = headerBtn.querySelector(".btn__flag") as HTMLElement;
		const quantity = headerBtn.querySelector(".btn__quantity") as HTMLElement;

		if (isPremium) {
			textBody.textContent = selectedLanguages.length === 0 ? "Telegram Premium" : this.languageNames[selectedLanguages[0]] || selectedLanguages[0];

			headerBtn.classList.add("header__users--premium");

			icon?.classList.remove("hidden");
			flag?.classList.add("hidden");
			quantity?.classList.toggle("hidden", selectedLanguages.length <= 1);

			if (quantity && selectedLanguages.length > 1) {
				quantity.textContent = String(selectedLanguages.length - 1);
			}

			flag.innerHTML = "";
			return;
		}

		if (selectedLanguages.length === 0) {
			textBody.textContent = "Все пользователи";
			headerBtn.classList.remove("header__users--premium");

			icon?.classList.remove("hidden");
			flag?.classList.add("hidden");
			quantity?.classList.add("hidden");

			flag.innerHTML = "";
			return;
		}

		const firstLang = selectedLanguages[0] as LanguageCode;
		textBody.textContent = this.languageNames[firstLang] || firstLang;

		headerBtn.classList.remove("header__users--premium");

		icon?.classList.add("hidden");
		flag?.classList.remove("hidden");

		flag.innerHTML = "";
		const img = document.createElement("img");
		img.src = `/img/flags/${firstLang}.svg`;
		img.alt = "Флаг";
		flag.appendChild(img);

		if (selectedLanguages.length > 1) {
			quantity?.classList.remove("hidden");
			quantity.textContent = String(selectedLanguages.length - 1);
		} else {
			quantity?.classList.add("hidden");
		}
	}

	private updateAppClassSingleLanguage(): void {
		const appWrapper = document.getElementById("app") as HTMLElement | null;
		const selectedLanguages = this.getSelectedLanguages();
		appWrapper?.classList.toggle("one-language-selected", selectedLanguages.length === 1);
	}
}
