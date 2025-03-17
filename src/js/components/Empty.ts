interface EmptyStateOptions {
	message: string;
	subtitle?: string;
	showButton?: boolean;
	buttonType?: "button" | "link";
	buttonActionOrLink?: string;
	buttonText?: string;
	imageType?: "egg" | "empty" | "glasses" | "lupe";
}

export class EmptyState {
	private message: string;
	private subtitle?: string;
	private showButton: boolean;
	private buttonType: "button" | "link";
	private buttonActionOrLink: string;
	private buttonText: string;
	private imageType: string;

	constructor(options: EmptyStateOptions) {
		this.message = options.message;
		this.subtitle = options.subtitle;
		this.showButton = options.showButton ?? false;
		this.buttonType = options.buttonType ?? "button";
		this.buttonActionOrLink = options.buttonActionOrLink ?? "";
		this.buttonText = options.buttonText ?? "Перезагрузить";
		this.imageType = options.imageType ?? "lupe";
	}

	render(): HTMLElement {
		const wrapper = document.createElement("div");
		wrapper.classList.add("empty", "active");

		const picture = document.createElement("div");
		picture.classList.add("picture");

		const img = document.createElement("img");
		img.src = `img/duck/${this.imageType}.gif`;
		img.alt = "Duck";

		picture.appendChild(img);

		const headline = document.createElement("span");
		headline.classList.add("headline", "fw-semibold", "color-secondary");
		headline.textContent = this.message;

		wrapper.append(picture);
		wrapper.append(headline);

		if (this.subtitle) {
			const subtitle = document.createElement("span");
			subtitle.classList.add("subtitle", "color-secondary");
			subtitle.textContent = this.subtitle;
			wrapper.append(subtitle);
		}

		if (this.showButton) {
			const buttonWrapper = document.createElement("div");
			buttonWrapper.classList.add("complete-btn__wrapper");

			let buttonElement: HTMLButtonElement | HTMLAnchorElement;

			if (this.buttonType === "button") {
				buttonElement = document.createElement("button");
				buttonElement.classList.add("complete-btn", "btn", "btn-primary", "btn-sm");
				buttonElement.textContent = this.buttonText;
				buttonElement.setAttribute(`data-${this.buttonActionOrLink}`, "");
			} else {
				buttonElement = document.createElement("a");
				buttonElement.classList.add("complete-btn", "btn", "btn-primary", "btn-sm");
				buttonElement.textContent = this.buttonText;
				buttonElement.setAttribute("href", this.buttonActionOrLink);
			}

			buttonWrapper.appendChild(buttonElement);
			wrapper.append(buttonWrapper);
		}

		return wrapper;
	}
}
